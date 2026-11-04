interface Env {
  SIGNUPS: KVNamespace
  ALLOWED_ORIGIN?: string
}

type SignupEntry = {
  email: string
  city: string
  submittedAt: string
}

const jsonHeaders = (origin: string) => ({
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Origin': origin,
  'Content-Type': 'application/json',
})

const response = (body: Record<string, unknown>, status: number, origin: string) =>
  new Response(JSON.stringify(body), {
    status,
    headers: jsonHeaders(origin),
  })

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = env.ALLOWED_ORIGIN || '*'

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: jsonHeaders(origin) })
    }

    if (request.method !== 'POST') {
      return response({ error: 'Method not allowed' }, 405, origin)
    }

    try {
      const payload = await request.json() as Partial<SignupEntry>
      const email = payload.email?.trim().toLowerCase() ?? ''
      const city = payload.city?.trim() ?? ''

      if (!email || !city || !email.includes('@')) {
        return response({ error: 'Email and city are required' }, 400, origin)
      }

      const entry: SignupEntry = {
        email,
        city,
        submittedAt: payload.submittedAt ?? new Date().toISOString(),
      }

      await env.SIGNUPS.put(`signup:${email}`, JSON.stringify(entry))

      return response({ ok: true }, 201, origin)
    } catch {
      return response({ error: 'Unable to save signup' }, 500, origin)
    }
  },
}
