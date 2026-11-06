import { useEffect, useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { claimChallenge, completeChallenge, getChallenge, type ChallengeEvent } from '../api/challenges'
import { Asterisk, Checkmark, Instagram } from '../components/icons'

type ChallengeStage = 'claim' | 'challenge' | 'complete'
type EventState = 'loading' | 'ready' | 'closed' | 'error'

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
        setEventState(challengeEvent.open ? 'ready' : 'closed')
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
          <section className="challenge-card challenge-status-card" aria-live="polite">
            <p className="challenge-kicker">one moment.</p>
            <h1>finding the <em>table.</em></h1>
            <p className="challenge-copy">Checking this challenge is ready for you.</p>
          </section>
        )}

        {eventState === 'error' && (
          <section className="challenge-card challenge-status-card" aria-live="assertive">
            <p className="challenge-kicker">we hit a bump.</p>
            <h1>this invite is <em>not ready.</em></h1>
            <p className="challenge-copy">{error}</p>
          </section>
        )}

        {eventState === 'closed' && (
          <section className="challenge-card challenge-status-card" aria-live="polite">
            <p className="challenge-kicker">come back soon.</p>
            <h1>this challenge is <em>closed.</em></h1>
            <p className="challenge-copy">This Pasture event is not accepting new participants right now.</p>
          </section>
        )}

        {eventState === 'ready' && stage === 'claim' && (
          <section className="challenge-card" aria-labelledby="challenge-title">
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
              <label className="challenge-label" htmlFor="challenge-email">Email address <span>for the drawing</span></label>
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
          </section>
        )}

        {eventState === 'ready' && stage === 'challenge' && (
          <section className="challenge-card challenge-card-assignment" aria-labelledby="assignment-title">
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
          </section>
        )}

        {stage === 'complete' && (
          <section className="challenge-card challenge-card-complete" aria-labelledby="complete-title">
            <div className="challenge-card-topline">
              <span>{event?.name}</span>
              <Asterisk />
            </div>
            <div className="complete-content">
              <div className="complete-mark"><Checkmark /></div>
              <p className="challenge-kicker">you're in.</p>
              <h1 id="complete-title">look at us <em>making friends.</em></h1>
              <p className="challenge-copy">Thanks for playing along! We hope you made a new connection tonight!</p>
              <div className="complete-reminder">
                <Instagram />
                <p>Follow <strong>@pasture.place</strong> for the winner announcement.</p>
              </div>
              <Link className="challenge-secondary-link" to="/">learn more about pasture <span>↗</span></Link>
            </div>
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
