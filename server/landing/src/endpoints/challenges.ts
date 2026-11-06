import type { Context } from 'hono'
import { getChallenges } from '../data/getChallenges'
import type { AppEnv } from '../types'

type ChallengeEvent = {
  name?: string
  active?: boolean | null
  startTime?: string | null
  endTime?: string | null
  prompts?: string[]
}

type ChallengeClaim = {
  claim_id: string
  event_id: string
  instagram: string
  email: string
  interest_opt_in: boolean
  prompt_id: string
  prompt: string
  status: 'claimed' | 'completed'
  claimed_at: string
  completed_at: string | null
}

type ClaimRequest = {
  instagram: string
  email: string
  interest_opt_in?: boolean
}

type CompleteRequest = {
  claim_id: string
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const instagramPattern = /^[a-zA-Z0-9._]{1,30}$/

function eventKey(eventId: string) {
  return `event:${eventId}`
}

function participantKey(eventId: string, identityHash: string) {
  return `event:${eventId}:participant:${identityHash}`
}

function claimKey(eventId: string, claimId: string) {
  return `event:${eventId}:claim:${claimId}`
}

function normalizeInstagram(value: string) {
  return value.trim().replace(/^@/, '').toLowerCase()
}

function isOpen(event: ChallengeEvent) {
  if (event.active === true) return true
  if (event.active === false) return false

  const now = Date.now()
  const startTime = event.startTime ? Date.parse(event.startTime) : null
  const endTime = event.endTime ? Date.parse(event.endTime) : null

  if (startTime !== null && !Number.isNaN(startTime) && now < startTime) return false
  if (endTime !== null && !Number.isNaN(endTime) && now >= endTime) return false
  return true
}

function eventStatus(event: ChallengeEvent): 'upcoming' | 'open' | 'ended' | 'closed' {
  if (event.active === true) return 'open'
  if (event.active === false) return 'closed'

  const now = Date.now()
  const startTime = event.startTime ? Date.parse(event.startTime) : null
  const endTime = event.endTime ? Date.parse(event.endTime) : null

  if (startTime !== null && !Number.isNaN(startTime) && now < startTime) return 'upcoming'
  if (endTime !== null && !Number.isNaN(endTime) && now >= endTime) return 'ended'
  return 'open'
}

async function identityHash(instagram: string) {
  const bytes = new TextEncoder().encode(instagram)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

function claimResponse(claim: ChallengeClaim) {
  return {
    claim_id: claim.claim_id,
    prompt: claim.prompt,
    status: claim.status,
  }
}

async function getEvent(c: Context<AppEnv>, eventId: string) {
  const event = await getChallenges(c).get<ChallengeEvent>(eventKey(eventId), 'json')
  return event
}

export async function GetChallenge(c: Context<AppEnv>) {
  const eventId = c.req.param('eventId')
  const event = await getEvent(c, eventId)

  if (!event) return c.json({ ok: false, error: 'Challenge event not found' }, 404)

  return c.json({
    ok: true,
    event: {
      id: eventId,
      name: event.name ?? 'Pasture challenge',
      open: isOpen(event),
      status: eventStatus(event),
      start_time: event.startTime ?? null,
      end_time: event.endTime ?? null,
    },
  })
}

export async function ClaimChallenge(c: Context<AppEnv>) {
  const eventId = c.req.param('eventId')
  const event = await getEvent(c, eventId)
  const body = (await c.req.json().catch(() => null)) as ClaimRequest | null

  if (!event) return c.json({ ok: false, error: 'Challenge event not found' }, 404)
  if (!isOpen(event)) return c.json({ ok: false, error: 'This challenge is not currently open' }, 409)
  if (!body) return c.json({ ok: false, error: 'Invalid JSON body' }, 400)

  const instagram = normalizeInstagram(body.instagram ?? '')
  const email = body.email?.trim().toLowerCase() ?? ''

  if (!instagram) return c.json({ ok: false, error: 'instagram is required' }, 400)
  if (!instagramPattern.test(instagram)) return c.json({ ok: false, error: 'instagram is invalid' }, 400)
  if (!email) return c.json({ ok: false, error: 'email is required' }, 400)
  if (!emailPattern.test(email)) return c.json({ ok: false, error: 'email is invalid' }, 400)

  const prompts = event.prompts ?? []
  if (!prompts.length) return c.json({ ok: false, error: 'This challenge has no prompts configured' }, 500)

  const kv = getChallenges(c)
  const identity = await identityHash(instagram)
  const existingClaimId = await kv.get(participantKey(eventId, identity))

  if (existingClaimId) {
    const existingClaim = await kv.get<ChallengeClaim>(claimKey(eventId, existingClaimId), 'json')
    if (existingClaim) return c.json({ ok: true, existing: true, claim: claimResponse(existingClaim) })
  }

  const claimId = crypto.randomUUID()
  const promptId = String(Math.floor(Math.random() * prompts.length) + 1).padStart(2, '0')
  const now = new Date().toISOString()
  const claim: ChallengeClaim = {
    claim_id: claimId,
    event_id: eventId,
    instagram,
    email,
    interest_opt_in: body.interest_opt_in !== false,
    prompt_id: promptId,
    prompt: prompts[Number(promptId) - 1],
    status: 'claimed',
    claimed_at: now,
    completed_at: null,
  }

  await kv.put(claimKey(eventId, claimId), JSON.stringify(claim))
  await kv.put(participantKey(eventId, identity), claimId)

  return c.json({ ok: true, existing: false, claim: claimResponse(claim) }, 201)
}

export async function CompleteChallenge(c: Context<AppEnv>) {
  const eventId = c.req.param('eventId')
  const body = (await c.req.json().catch(() => null)) as CompleteRequest | null

  if (!body?.claim_id) return c.json({ ok: false, error: 'claim_id is required' }, 400)

  const kv = getChallenges(c)
  const claim = await kv.get<ChallengeClaim>(claimKey(eventId, body.claim_id), 'json')
  if (!claim) return c.json({ ok: false, error: 'Challenge claim not found' }, 404)

  if (claim.status === 'completed') {
    return c.json({ ok: true, status: claim.status, completed_at: claim.completed_at })
  }

  const completedAt = new Date().toISOString()
  const completedClaim: ChallengeClaim = {
    ...claim,
    status: 'completed',
    completed_at: completedAt,
  }

  await kv.put(claimKey(eventId, body.claim_id), JSON.stringify(completedClaim))

  return c.json({ ok: true, status: completedClaim.status, completed_at: completedAt })
}
