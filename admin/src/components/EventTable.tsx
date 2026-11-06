import { formatDate } from '../lib/format'
import type { EventData } from '../types'

type Props = {
  events: EventData[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export const EventTable = ({ events, selectedId, onSelect }: Props) => (
  <div className="table-wrap event-table-wrap">
    <table className="event-table">
      <thead><tr><th>Event</th><th>Status</th><th>Starts</th><th>Ends</th><th>Submissions</th></tr></thead>
      <tbody>
        {events.map((event) => {
          const status = event.config.active === null || event.config.active === undefined
            ? 'Scheduled'
            : event.config.active ? 'Open' : 'Paused'
          return (
            <tr key={event.id} className={selectedId === event.id ? 'selected' : ''}>
              <td>
                <button className="event-select" type="button" aria-pressed={selectedId === event.id} onClick={() => onSelect(event.id)}>
                  <strong>{event.config.name ?? event.id}</strong><small>{event.id}</small>
                </button>
              </td>
              <td><span className="event-state">{status}</span></td>
              <td>{formatDate(event.config.startTime)}</td>
              <td>{formatDate(event.config.endTime)}</td>
              <td>{event.claims.length}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  </div>
)
