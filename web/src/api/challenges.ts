import { apiBaseUrl } from "./constant"

type ApiError = {
  error?: string
}

export type ChallengeEvent = {
  id: string
  name: string
  open: boolean
  status: 'upcoming' | 'open' | 'ended' | 'closed'
  start_time: string | null
  end_time: string | null
}

export type ChallengeClaim = {
  claim_id: string
  prompt: string
  status: 'claimed' | 'completed'
}

async function request<T>(path: string, init?: RequestInit) {
  const response = await fetch(`${apiBaseUrl}/api/v1${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  })
  const body = await response.json().catch(() => ({})) as T & ApiError

  if (!response.ok) throw new Error(body.error ?? 'Something went wrong')
  return body
}

export const getChallenge = (eventId: string) =>
  request<{ ok: true; event: ChallengeEvent }>(`/challenges/${encodeURIComponent(eventId)}`)

export const claimChallenge = (eventId: string, input: { instagram: string; email: string; interest_opt_in: boolean }) =>
  request<{ ok: true; claim: ChallengeClaim }>(`/challenges/${encodeURIComponent(eventId)}/claim`, {
    method: 'POST',
    body: JSON.stringify(input),
  })

export const completeChallenge = (eventId: string, claimId: string, funFact: string) =>
  request<{ ok: true; status: 'completed'; completed_at: string }>(`/challenges/${encodeURIComponent(eventId)}/complete`, {
    method: 'POST',
    body: JSON.stringify({ claim_id: claimId, fun_fact: funFact }),
  })
