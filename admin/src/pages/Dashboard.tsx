import { useEffect, useState } from 'react'
import { EventCard } from '../components/EventCard'
import { EventForm } from '../components/EventForm'
import { EventTable } from '../components/EventTable'
import { WaitlistTable } from '../components/WaitlistTable'
import type { EventData, WaitlistSignup } from '../types'

type Tab = 'events' | 'waitlist'
type Store = 'local' | 'production'

export const Dashboard = () => {
  const [tab, setTab] = useState<Tab>('events')
  const [store, setStore] = useState<Store>('local')
  const [events, setEvents] = useState<EventData[]>([])
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
  const [signups, setSignups] = useState<WaitlistSignup[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [reload, setReload] = useState(0)

  useEffect(() => {
    setSelectedEventId(null)
    setLoading(true)
    const request = tab === 'events'
      ? fetch(`/admin/api/events?store=${store}`).then(async (response) => {
        const body = await response.json()
        if (!response.ok) throw new Error(body.error ?? 'Could not load events.')
        setEvents(body.events)
      })
      : fetch(`/admin/api/waitlist?store=${store}`).then(async (response) => {
        const body = await response.json()
        if (!response.ok) throw new Error(body.error ?? 'Could not load waitlist.')
        setSignups(body.signups)
      })

    request
      .then(() => setError(''))
      .catch((loadError: Error) => setError(loadError.message))
      .finally(() => setLoading(false))
  }, [tab, store, reload])

  return (
    <main className="shell">
      <header className="topbar">
        <a className="brand" href="#">pasture<span> / admin</span></a>
        <nav className="tab-bar" aria-label="Admin sections">
          <button className={tab === 'events' ? 'tab active' : 'tab'} aria-current={tab === 'events' ? 'page' : undefined} onClick={() => setTab('events')}>Events</button>
          <button className={tab === 'waitlist' ? 'tab active' : 'tab'} aria-current={tab === 'waitlist' ? 'page' : undefined} onClick={() => setTab('waitlist')}>Waitlist</button>
        </nav>
        <div className="topbar-actions">
          <div className="environment-toggle" role="group" aria-label="Data environment">
            <button className={store === 'local' ? 'selected' : ''} onClick={() => setStore('local')}>Local</button>
            <button className={store === 'production' ? 'selected' : ''} onClick={() => setStore('production')}>Production</button>
          </div>
        </div>
      </header>

      {error && <p className="empty error" role="alert">{error} Check your Wrangler session and admin Worker.</p>}

      {tab === 'events' && (
        <section className="admin-section">
          <EventForm store={store} onSaved={() => setReload((value) => value + 1)} />
          {loading ? <p className="empty">Loading events…</p> : events.length === 0 ? <p className="empty">No events yet.</p> : (
            <>
              <EventTable events={events} selectedId={selectedEventId} store={store} onSelect={setSelectedEventId} />
              {selectedEventId ? <EventCard event={events.find((event) => event.id === selectedEventId)!} /> : <p className="empty event-selection-hint">Select an event to see its details.</p>}
            </>
          )}
        </section>
      )}

      {tab === 'waitlist' && (
        <section className="admin-section">
          {loading ? <p className="empty">Loading waitlist…</p> : <WaitlistTable signups={signups} />}
        </section>
      )}
    </main>
  )
}
