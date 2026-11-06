import { useEffect, useState } from 'react'
import { EventCard } from '../components/EventCard'
import { WaitlistTable } from '../components/WaitlistTable'
import { formatDate } from '../lib/format'
import type { Snapshot } from '../types'

export const Dashboard = () => {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [reload, setReload] = useState(0)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      fetch('/admin/api/events').then((response) => {
        if (!response.ok) throw new Error('Could not load challenge events from KV.')
        return response.json()
      }),
      fetch('/admin/api/waitlist').then((response) => {
        if (!response.ok) throw new Error('Could not load waitlist signups from KV.')
        return response.json()
      })
    ])
      .then(([eventData, waitlistData]) => {
        setSnapshot({ refreshedAt: new Date().toISOString(), source: 'Cloudflare KV', ...eventData, ...waitlistData })
        setError('')
      })
      .catch((loadError: Error) => setError(loadError.message))
      .finally(() => setLoading(false))
  }, [reload])

  const totalSubmissions = snapshot?.events.reduce((sum, event) => sum + event.claims.length, 0) ?? 0
  const totalCompleted = snapshot?.events.reduce((sum, event) => sum + event.claims.filter((claim) => claim.status === 'completed').length, 0) ?? 0

  return (
    <main className="shell">
      <header className="topbar">
        <a className="brand" href="#">pasture<span> / admin</span></a>
        <button className="refresh-button" type="button" onClick={() => setReload((value) => value + 1)} disabled={loading}>
          {loading ? 'Loading KV…' : 'Refresh data'}
        </button>
      </header>
      <section className="intro">
        <p className="eyebrow">Challenge dashboard</p>
        <h1>Events &amp; <em>entries.</em></h1>
        <p className="subhead">Review preview events, assigned prompts, and completed submissions.</p>
        {snapshot && <div className="summary"><span>{snapshot.events.length} events</span><span>{totalSubmissions} submissions</span><span>{totalCompleted} completed</span></div>}
      </section>
      {error ? <p className="empty error">{error}<br />Check Wrangler login and remote KV bindings.</p> : null}
      {snapshot && <p className="source-note">Connected to Cloudflare KV · loaded {formatDate(snapshot.refreshedAt)}</p>}
      {snapshot?.events.length === 0 && <p className="empty">No challenge events in the preview namespace.</p>}
      <div className="event-list">
        {snapshot?.events.map((event) => <EventCard key={event.id} event={event} />)}
        {snapshot && <WaitlistTable signups={snapshot.waitlist ?? []} />}
      </div>
      <footer>Local dashboard · challenge data is from preview KV; waitlist data is from the canonical waitlist KV.</footer>
    </main>
  )
}
