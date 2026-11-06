import { Asterisk, Instagram } from './icons'

type ChallengeStatusCardProps = {
  title: string
  emphasis: string
  message: string
  eventName?: string
  live?: 'polite' | 'assertive'
}

export const ChallengeStatusCard = ({
  title,
  emphasis,
  message,
  eventName,
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
      <p>Follow <a href="https://instagram.com/pasture.place" target="_blank" rel="noreferrer"><strong>@pasture.place</strong></a> for future events and annoucements.</p>
    </div>
  </section>
)
