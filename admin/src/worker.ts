interface Env {
  CHALLENGES_LOCAL: KVNamespace
  CHALLENGES_PRODUCTION: KVNamespace
  WAITLIST_LOCAL: KVNamespace
  WAITLIST_PRODUCTION: KVNamespace
}

type EventConfig = {
  name: string
  active: boolean | null
  startTime: string | null
  endTime: string | null
  prompts: (string | { template: string; options: Record<string, string[]> })[]
}

function selectStore(env: Env, store: string | null, kind: 'challenge' | 'waitlist') {
  if (store === 'local') return kind === 'challenge' ? env.CHALLENGES_LOCAL : env.WAITLIST_LOCAL
  return kind === 'challenge' ? env.CHALLENGES_PRODUCTION : env.WAITLIST_PRODUCTION
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

async function listKeys(namespace: KVNamespace, prefix: string) {
  const keys: string[] = []
  let cursor: string | undefined

  do {
    const page = await namespace.list({ prefix, cursor })
    keys.push(...page.keys.map(({ name }) => name))
    cursor = page.list_complete ? undefined : page.cursor
  } while (cursor)

  return keys
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
        return Response.json({ events: await getEvents(selectStore(env, store, 'challenge')) }, { headers })
      }

      if (request.method === 'POST') {
        const body = await request.json().catch(() => null) as { id?: string; config?: EventConfig; store?: string } | null
        if (!body?.id || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(body.id)) {
          return Response.json({ error: 'Use a lowercase event ID with letters, numbers, and hyphens.' }, { status: 400, headers })
        }
        if (!body.config?.name?.trim() || !body.config.prompts?.length) {
          return Response.json({ error: 'Event name and at least one prompt are required.' }, { status: 400, headers })
        }
        if (body.config.startTime && body.config.endTime && Date.parse(body.config.endTime) <= Date.parse(body.config.startTime)) {
          return Response.json({ error: 'End time must be later than start time.' }, { status: 400, headers })
        }
        const namespace = selectStore(env, body.store ?? 'local', 'challenge')
        const key = `event:${body.id}`
        if (await namespace.get(key) !== null) {
          return Response.json({ error: 'That event ID already exists in this store.' }, { status: 409, headers })
        }
        await namespace.put(key, JSON.stringify(body.config))
        return Response.json({ ok: true, id: body.id }, { status: 201, headers })
      }

      return new Response('Method not allowed', { status: 405 })
    }

    const deleteEventMatch = url.pathname.match(/^\/api\/events\/([^/]+)$/)
    if (deleteEventMatch && request.method === 'DELETE') {
      let eventId: string
      try {
        eventId = decodeURIComponent(deleteEventMatch[1])
      } catch {
        return Response.json({ error: 'Invalid event ID.' }, { status: 400, headers })
      }
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(eventId)) {
        return Response.json({ error: 'Invalid event ID.' }, { status: 400, headers })
      }

      const namespace = selectStore(env, url.searchParams.get('store'), 'challenge')
      const eventKey = `event:${eventId}`
      if (await namespace.get(eventKey) === null) {
        return Response.json({ error: 'Event not found.' }, { status: 404, headers })
      }

      const keys = await listKeys(namespace, `event:${eventId}:`)
      await Promise.all([...keys, eventKey].map((key) => namespace.delete(key)))
      return Response.json({ ok: true, id: eventId }, { headers })
    }

    if (url.pathname === '/api/waitlist') {
      if (request.method !== 'GET') return new Response('Method not allowed', { status: 405 })
      const signups = await listValues<Record<string, any>>(selectStore(env, url.searchParams.get('store'), 'waitlist'), 'signup:')
      signups.sort((a, b) => (b.submitted_at ?? '').localeCompare(a.submitted_at ?? ''))
      return Response.json({ signups }, { headers })
    }

    return Response.json({ error: 'Not found' }, { status: 404, headers })
  },
}
