import { useEffect, useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { claimChallenge, completeChallenge, getChallenge, type ChallengeEvent } from '../api/challenges'
import { ChallengeStatusCard } from '../components/ChallengeStatusCard'
import { Asterisk, Checkmark, Instagram } from '../components/icons'

type ChallengeStage = 'claim' | 'challenge' | 'complete'
type EventState = 'loading' | 'ready' | 'upcoming' | 'ended' | 'closed' | 'error'

type ChallengeForm = {
  instagram: string
  email: string
  joinInterestList: boolean
}

const defaultFormValue = {
  instagram: '',
  email: '',
  joinInterestList: true,
}

const formatEventEndTime = (value: string) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

const EventEndNote = ({ endTime }: { endTime?: string | null }) => {
  if (!endTime) return null
  const formatted = formatEventEndTime(endTime)
  return formatted ? <p className="challenge-event-end">Challenge ends {formatted}</p> : null
}

export const ChallengePage = () => {
  const { eventId = 'preview' } = useParams()
  const [eventState, setEventState] = useState<EventState>('loading')
  const [event, setEvent] = useState<ChallengeEvent | null>(null)
  const [stage, setStage] = useState<ChallengeStage>('claim')
  const [assignedPrompt, setAssignedPrompt] = useState('')
  const [claimId, setClaimId] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState<ChallengeForm>(defaultFormValue);

  useEffect(() => {
    let cancelled = false

    getChallenge(eventId)
      .then(({ event: challengeEvent }) => {
        if (cancelled) return
        setEvent(challengeEvent)
        setEventState(challengeEvent.open ? 'ready' : challengeEvent.status === 'open' ? 'ready' : challengeEvent.status)
      })
      .catch((requestError: Error) => {
        if (cancelled) return
        setError(requestError.message)
        setEventState('error')
      })

    return () => {
      cancelled = true
    }
  }, [eventId])

  const updateForm = (field: keyof ChallengeForm, value: string | boolean) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const handleClaim = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const response = await claimChallenge(eventId, {
        instagram: form.instagram,
        email: form.email,
        interest_opt_in: form.joinInterestList,
      })
      setClaimId(response.claim.claim_id)
      setAssignedPrompt(response.claim.prompt)
      setStage(response.claim.status === 'completed' ? 'complete' : 'challenge')
      requestAnimationFrame(() => {
        document.getElementById('challenge-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleComplete = async () => {
    setError('')
    setIsSubmitting(true)

    try {
      await completeChallenge(eventId, claimId)
      setStage('complete')
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="challenge-page">
      <header className="challenge-header">
        <Link className="challenge-brand" to="/" aria-label="Pasture home">pasture</Link>
      </header>

      <div className="challenge-content">
        {eventState === 'loading' && (
          <ChallengeStatusCard title="finding the" emphasis="table." message="Checking whether this event is ready for you." />
        )}

        {eventState === 'error' && (
          <ChallengeStatusCard
            title={error.toLowerCase().includes('not found') ? 'we couldn’t find' : 'this invite is'}
            emphasis={error.toLowerCase().includes('not found') ? 'this event.' : 'not ready.'}
            message={error.toLowerCase().includes('not found') ? 'Check the link and try again.' : error}
            live="assertive"
          />
        )}

        {(eventState === 'upcoming' || eventState === 'ended' || eventState === 'closed') && (
          <ChallengeStatusCard
            eventName={event?.name}
            endTime={event?.end_time}
            title={eventState === 'closed' ? 'this event is' : 'this event has'}
            emphasis={eventState === 'upcoming' ? 'not started yet.' : eventState === 'ended' ? 'ended.' : 'closed.'}
            message=""
          />
        )}

        {eventState === 'ready' && stage === 'claim' && (
          <section id="challenge-card" className="challenge-card" aria-labelledby="challenge-title">
            <div className="challenge-card-topline">
              <span>{event?.name}</span>
              <Asterisk />
            </div>
            <div className="challenge-intro">
              <h1 id="challenge-title">make a new <em>connection.</em></h1>
              <p className="challenge-copy">Take on a quick challenge, capture the moment and share it on Instagram. Tag <strong>@pasture.place</strong> for your chance to win a $100 gift card!</p>
            </div>

            <form className="challenge-form" onSubmit={handleClaim}>
              <div className="challenge-form-heading">
                <span>tell us where to find you.</span>
              </div>
              <label className="challenge-label" htmlFor="challenge-instagram">Instagram username <span>required</span></label>
              <div className="challenge-input-wrap">
                <Instagram />
                <input
                  className="challenge-input"
                  id="challenge-instagram"
                  name="instagram"
                  type="text"
                  placeholder="@yourusername"
                  autoComplete="username"
                  value={form.instagram}
                  onChange={(event) => updateForm('instagram', event.target.value)}
                  required
                />
              </div>
              <label className="challenge-label" htmlFor="challenge-email">Email address</label>
              <input
                className="challenge-input challenge-input-plain"
                id="challenge-email"
                name="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                value={form.email}
                onChange={(event) => updateForm('email', event.target.value)}
                required
              />
              <label className="challenge-checkbox">
                <input
                  type="checkbox"
                  checked={form.joinInterestList}
                  onChange={(event) => updateForm('joinInterestList', event.target.checked)}
                />
                <span className="challenge-checkmark"><Checkmark /></span>
                <span>I'm interested in future events.</span>
              </label>
              <button className="challenge-button" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving your spot…' : 'Take the challenge'}
                <span>→</span>
              </button>
              {error && <p className="challenge-form-error" role="alert">{error}</p>}
            </form>
            <EventEndNote endTime={event?.end_time} />
          </section>
        )}

        {eventState === 'ready' && stage === 'challenge' && (
          <section id="challenge-card" className="challenge-card challenge-card-assignment" aria-labelledby="assignment-title">
            <div className="challenge-card-topline">
              <span>{event?.name}</span>
            </div>
            <div className="assignment-content">
              <h1 id="assignment-title">find your <em>person.</em></h1>
              <div className="prompt-card">
                <p>{assignedPrompt}</p>
              </div>
              <ol className="challenge-steps">
                <li><span>1</span><p>Find your person and take a picture together.</p></li>
                <li><span>2</span><p>Share it on Instagram and tag <strong>@pasture.place</strong>.</p></li>
                <li><span>3</span><p>Come back here and let us know you did it.</p></li>
              </ol>
              <button className="challenge-button" type="button" onClick={handleComplete} disabled={isSubmitting}>
                {isSubmitting ? 'Saving your entry…' : 'I completed it'}
                {' '}<Checkmark />
              </button>
              {error && <p className="challenge-form-error" role="alert">{error}</p>}
            </div>
            <EventEndNote endTime={event?.end_time} />
          </section>
        )}

        {stage === 'complete' && (
          <section id="challenge-card" className="challenge-card challenge-card-complete" aria-labelledby="complete-title">
            <div className="challenge-card-topline">
              <span>{event?.name}</span>
              <Asterisk />
            </div>
            <div className="complete-content">
              <div className="complete-mark"><Checkmark /></div>
              <p className="challenge-kicker">you're in.</p>
              <h1 id="complete-title">look at us <em>making friends.</em></h1>
              <p className="challenge-copy">Thanks for playing along! We hope you made a new friend tonight!</p>
              <div className="complete-reminder">
                <Instagram />
                <p>Follow <a href="https://instagram.com/pasture.place" target="_blank" rel="noreferrer"><strong>@pasture.place</strong></a> for the winner announcement.</p>
              </div>
              <Link className="challenge-secondary-link" to="/">learn more about pasture <span>↗</span></Link>
            </div>
            <EventEndNote endTime={event?.end_time} />
          </section>
        )}
      </div>

      <footer className="challenge-footer">
        <p>seven people. one table. <em>more life together.</em></p>
        <div className="challenge-footer-tags" aria-label="Gathering types">
          <span>brunch</span><span>dinner</span><span>new friends</span>
        </div>
      </footer>
    </main>
  )
}
