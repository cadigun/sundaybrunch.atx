import { useState } from 'react'
import { formatDate } from '../lib/format'
import type { EventData } from '../types'

type Props = {
  events: EventData[]
  selectedId: string | null
  store: 'local' | 'production'
  deletingId: string | null
  onSelect: (id: string) => void
  onDelete: (id: string, name: string, submissionCount: number) => void
}

export const EventTable = ({ events, selectedId, store, deletingId, onSelect, onDelete }: Props) => {
  const [copied, setCopied] = useState('')

  const copy = async (eventId: string, kind: 'id' | 'url') => {
    const value = kind === 'id'
      ? eventId
      : store === 'production'
        ? `https://pasture.place/c/${encodeURIComponent(eventId)}`
        : `http://localhost:5173/c/${encodeURIComponent(eventId)}`

    try {
      await navigator.clipboard.writeText(value)
      setCopied(`${eventId}:${kind}`)
      window.setTimeout(() => setCopied(''), 1600)
    } catch {
      setCopied(`${eventId}:error`)
      window.setTimeout(() => setCopied(''), 1600)
    }
  }

  return (
    <div className="table-wrap event-table-wrap">
      <table className="event-table">
        <thead><tr><th>Event</th><th>Status</th><th>Starts</th><th>Ends</th><th>Submissions</th><th>Actions</th></tr></thead>
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
                <td>
                  <div className="event-copy-actions">
                    <button
                      className={copied === `${event.id}:id` ? 'event-copy-button copied' : 'event-copy-button'}
                      type="button"
                      aria-label={copied === `${event.id}:id` ? 'Event ID copied' : 'Copy event ID'}
                      title={copied === `${event.id}:id` ? 'Copied' : 'Copy event ID'}
                      onClick={() => void copy(event.id, 'id')}
                    >
                      <span>ID</span>
                      {copied === `${event.id}:id` ? <CheckIcon /> : <CopyIcon />}
                    </button>
                    <button
                      className={copied === `${event.id}:url` ? 'event-copy-button copied' : 'event-copy-button'}
                      type="button"
                      aria-label={copied === `${event.id}:url` ? 'Event URL copied' : 'Copy event URL'}
                      title={copied === `${event.id}:url` ? 'Copied' : 'Copy event URL'}
                      onClick={() => void copy(event.id, 'url')}
                    >
                      <span>URL</span>
                      {copied === `${event.id}:url` ? <CheckIcon /> : <CopyIcon />}
                    </button>
                    {copied === `${event.id}:error` && <small role="status">Copy failed</small>}
                    <button
                      className="event-delete-button"
                      type="button"
                      aria-label={`Delete ${event.config.name ?? event.id}`}
                      title="Delete event and submissions"
                      disabled={deletingId === event.id}
                      onClick={() => onDelete(event.id, event.config.name ?? event.id, event.claims.length)}
                    >
                      <TrashIcon />
                      <span>{deletingId === event.id ? 'Deleting' : 'Delete'}</span>
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function CopyIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16">
      <rect x="5.25" y="5.25" width="8" height="8" rx="1.5" />
      <path d="M10.75 5.25v-1A1.5 1.5 0 0 0 9.25 2.75h-5A1.5 1.5 0 0 0 2.75 4.25v5A1.5 1.5 0 0 0 4.25 10.75h1" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16">
      <path d="m3 8.25 3.25 3.25L13 4.75" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16">
      <path d="M2.75 4.25h10.5M6 4.25V2.75h4v1.5m2.25 0-.6 8.5H4.35l-.6-8.5m3.5 2.25v4m3.5-4v4" />
    </svg>
  )
}
