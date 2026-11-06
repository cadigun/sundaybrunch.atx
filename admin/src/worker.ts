interface Env {
  CHALLENGES_LOCAL: KVNamespace
  CHALLENGES_REMOTE: KVNamespace
  WAITLIST: KVNamespace
}

type EventConfig = {
  name: string
  active: boolean | null
  startTime: string | null
  endTime: string | null
  prompts: (string | { template: string; options: Record<string, string[]> })[]
}

function getChallengeStore(env: Env, store: string | null) {
  return store === 'local' ? env.CHALLENGES_LOCAL : env.CHALLENGES_REMOTE
}

async function listValues<T>(namespace: KVNamespace, prefix: string): Promise<T[]> {
  const values: T[] = []
  let cursor: string | undefined

  do {
    const page = await namespace.list({ prefix, cursor })
    const pageValues = await Promise.all(page.keys.map(async ({ name }) => {
      const value = await namespace.get<T>(name, 'json')
      return value ?? null
    }))
    values.push(...pageValues.filter((value): value is T => value !== null))
    cursor = page.list_complete ? undefined : page.cursor
  } while (cursor)

  return values
}

async function getEvents(namespace: KVNamespace) {
  const eventKeys: string[] = []
  let cursor: string | undefined
  do {
    const page = await namespace.list({ prefix: 'event:', cursor })
    eventKeys.push(...page.keys.map(({ name }) => name).filter((name) => /^event:[^:]+$/.test(name)))
    cursor = page.list_complete ? undefined : page.cursor
  } while (cursor)

  return Promise.all(eventKeys.map(async (key) => {
    const id = key.slice('event:'.length)
    const config = await namespace.get(key, 'json')
    const claims = await listValues<Record<string, any>>(namespace, `event:${id}:claim:`)
    claims.sort((a, b) => (b.claimed_at ?? '').localeCompare(a.claimed_at ?? ''))
    return { id, config, claims }
  }))
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)
    const headers = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }

    if (url.pathname === '/api/events') {
      if (request.method === 'GET') {
        const store = url.searchParams.get('store')
        return Response.json({ events: await getEvents(getChallengeStore(env, store)) }, { headers })
      }

      if (request.method === 'POST') {
        const body = await request.json().catch(() => null) as { id?: string; config?: EventConfig; store?: string } | null
        if (!body?.id || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(body.id)) {
          return Response.json({ error: 'Use a lowercase event ID with letters, numbers, and hyphens.' }, { status: 400, headers })
        }
        if (!body.config?.name?.trim() || !body.config.prompts?.length) {
          return Response.json({ error: 'Event name and at least one prompt are required.' }, { status: 400, headers })
        }
        await getChallengeStore(env, body.store ?? 'remote').put(`event:${body.id}`, JSON.stringify(body.config))
        return Response.json({ ok: true, id: body.id }, { status: 201, headers })
      }

      return new Response('Method not allowed', { status: 405 })
    }

    if (url.pathname === '/api/waitlist') {
      if (request.method !== 'GET') return new Response('Method not allowed', { status: 405 })
      const signups = await listValues<Record<string, any>>(env.WAITLIST, 'signup:')
      signups.sort((a, b) => (b.submitted_at ?? '').localeCompare(a.submitted_at ?? ''))
      return Response.json({ signups }, { headers })
    }

    return Response.json({ error: 'Not found' }, { status: 404, headers })
  },
}
