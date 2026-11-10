import { Asterisk, Instagram } from './icons'

type ChallengeStatusCardProps = {
  title: string
  emphasis: string
  message: string
  eventName?: string
  endTime?: string | null
  live?: 'polite' | 'assertive'
}

const formatEventEndTime = (value: string) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(date)
}

export const ChallengeStatusCard = ({
  title,
  emphasis,
  message,
  eventName,
  endTime,
  live = 'polite',
}: ChallengeStatusCardProps) => (
  <section className="challenge-card challenge-status-card" aria-live={live}>
    <div className="challenge-card-topline">
      <span>{eventName || "we've hit a bump"}</span>
      <Asterisk />
    </div>
    <div className="challenge-intro">
      <h1>{title} <em>{emphasis}</em></h1>
      {message && <p className="challenge-copy">{message}</p>}
    </div>
    <div className="complete-reminder challenge-status-follow">
      <Instagram />
      <p>Follow <a href="https://instagram.com/pasture.place" target="_blank" rel="noreferrer"><strong>@pasture.place</strong></a> for event updates and winner announcements.</p>
    </div>
    {endTime && formatEventEndTime(endTime) && (
      <p className="challenge-event-end">Challenge ends {formatEventEndTime(endTime)}</p>
    )}
  </section>
)
