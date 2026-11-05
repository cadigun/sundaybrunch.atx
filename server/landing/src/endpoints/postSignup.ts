import type { Context } from 'hono'
import { getSignups } from '../data/getSignups'
import type { AppEnv } from '../types'

export type PostSignupRequest = {
  email: string
  city?: string
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export async function PostSignup(c: Context<AppEnv>) {
  const body = (await c.req.json().catch(() => null)) as PostSignupRequest | null

  if (!body) return c.json({ ok: false, error: 'Invalid JSON body' }, 400)

  const email = body.email?.trim().toLowerCase()
  const city = body.city?.trim()

  if (!email) return c.json({ ok: false, error: 'email is required' }, 400)
  if (!isEmail(email)) return c.json({ ok: false, error: 'email is invalid' }, 400)
  const signup = {
    email,
    city,
    submitted_at: new Date().toISOString(),
  }

  await getSignups(c)
    .put(`signup:${encodeURIComponent(email)}`, JSON.stringify(signup))

  return c.json({ ok: true }, 201)
}
