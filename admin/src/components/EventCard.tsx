import { formatDate } from '../lib/format'
import type { EventData } from '../types'
import { PromptList } from './PromptList'
import { SubmissionTable } from './SubmissionTable'

export const EventCard = ({ event }: { event: EventData }) => {
  const { config, claims } = event
  const completed = claims.filter((claim) => claim.status === 'completed').length
  const activeLabel = config.active === null || config.active === undefined
    ? 'Scheduled'
    : config.active ? 'Open' : 'Paused'

  return (
    <section className="event-card event-details">
      <header className="event-head">
        <div><p className="eyebrow">Event / {event.id}</p><h2>{config.name ?? event.id}</h2></div>
        <div className="event-stats">
          <div><strong>{claims.length}</strong><span>submissions</span></div>
          <div><strong>{completed}</strong><span>completed</span></div>
        </div>
      </header>
      <div className="event-meta">
        <span className="event-state">{activeLabel}</span>
        <span>Starts {formatDate(config.startTime)}</span>
        <span>Ends {formatDate(config.endTime)}</span>
      </div>
      <PromptList prompts={config.prompts ?? []} />
      <SubmissionTable submissions={claims} />
    </section>
  )
}
