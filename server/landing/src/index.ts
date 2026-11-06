import { Hono } from 'hono'
import { cors } from 'hono/cors'
import type { Context } from 'hono'
import { ClaimChallenge, CompleteChallenge, GetChallenge } from './endpoints/challenges'
import { PostSignup } from './endpoints/postSignup'
import type { AppEnv } from './types'

const allowed = [
  'https://pasture.place',
  'https://www.pasture.place',
  'http://localhost:5173',
]

const app = new Hono<AppEnv>()

app.use(
  '*',
  cors({
    origin: allowed,
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['Content-Type'],
    credentials: false,
  }),
)

const health = (c: Context<AppEnv>) => c.json({ ok: true })

app.get('/health', health)
app.get('/api/health', health)
app.post('/v1/signup', PostSignup)
app.post('/api/v1/signup', PostSignup)
app.get('/v1/challenges/:eventId', GetChallenge)
app.get('/api/v1/challenges/:eventId', GetChallenge)
app.post('/v1/challenges/:eventId/claim', ClaimChallenge)
app.post('/api/v1/challenges/:eventId/claim', ClaimChallenge)
app.post('/v1/challenges/:eventId/complete', CompleteChallenge)
app.post('/api/v1/challenges/:eventId/complete', CompleteChallenge)

export default app
