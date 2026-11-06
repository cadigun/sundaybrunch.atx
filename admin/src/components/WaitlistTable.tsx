import { formatDate } from '../lib/format'
import type { WaitlistSignup } from '../types'

export const WaitlistTable = ({ signups }: { signups: WaitlistSignup[] }) => (
  <section className="event-card waitlist-card">
    <header className="event-head">
      <div><p className="eyebrow">Canonical list</p><h2>Waitlist</h2></div>
      <div className="event-stats"><div><strong>{signups.length}</strong><span>signups</span></div></div>
    </header>
    {!signups.length ? <p className="empty">No waitlist signups found.</p> : (
      <div className="table-wrap">
        <table>
          <thead><tr><th>Email</th><th>City</th><th>Instagram</th><th>Source</th><th>Submitted</th></tr></thead>
          <tbody>
            {signups.map((signup) => (
              <tr key={`${signup.email}-${signup.submitted_at}`}>
                <td><strong>{signup.email}</strong></td>
                <td>{signup.city || '—'}</td>
                <td>{signup.instagram ? `@${signup.instagram}` : '—'}</td>
                <td>{signup.source ?? 'website'}</td>
                <td>{formatDate(signup.submitted_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </section>
)
