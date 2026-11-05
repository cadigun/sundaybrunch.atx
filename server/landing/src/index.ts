import { Hono } from 'hono'
import { cors } from 'hono/cors'
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
    allowMethods: ['POST', 'OPTIONS'],
    allowHeaders: ['Content-Type'],
    credentials: false,
  }),
)

const health = (c: Parameters<typeof app.get>[1]) => c.json({ ok: true })

app.get('/health', health)
app.get('/api/health', health)
app.post('/v1/signup', PostSignup)
app.post('/api/v1/signup', PostSignup)

export default app
