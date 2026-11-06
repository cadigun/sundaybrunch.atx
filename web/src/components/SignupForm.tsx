import { useState, type FormEvent } from 'react'
import { apiBaseUrl } from '../api/constant'
import { Checkmark } from './icons'

const SIGNUP_ENDPOINT = `${apiBaseUrl}/api/v1/signup`

type SignupEntry = {
  email: string
  city: string
  submittedAt: string
}

const SignupCardCopy = () => (
  <div className="signup-card-copy"><p>join the early list.</p><h3>save your spot.</h3></div>
)

const SignupForm = () => {
  const [email, setEmail] = useState('')
  const [city, setCity] = useState('')
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('saving')

    const entry: SignupEntry = {
      email: email.trim(),
      city: city.trim(),
      submittedAt: new Date().toISOString(),
    }

    try {
      const response = await fetch(SIGNUP_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      })

      if (!response.ok) throw new Error('Signup request failed')

      setEmail('')
      setCity('')
      setStatus('saved')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'saved') {
    return (
      <div className="signup-success" role="status">
        <p className="signup-success-kicker">you’re on the list.</p>
        <h3>see you at the table.</h3>
      </div>
    )
  }

  return (
    <>
      <SignupCardCopy />
      <form className="signup-form" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="signup-email">Email address</label>
        <input className="form-line" id="signup-email" name="email" type="email" placeholder="email address" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        <label className="sr-only" htmlFor="signup-city">City or area</label>
        <input className="form-line" id="signup-city" name="city" type="text" placeholder="city or area (optional)" autoComplete="address-level2" value={city} onChange={(event) => setCity(event.target.value)} />
        <button className="form-submit" type="submit" disabled={status === 'saving'}>
          {status === 'saving' ? 'saving…' : 'get on the list'}
          <Checkmark />
        </button>
        <p className={`form-message${status === 'error' ? ' form-message-error' : ''}`} role="status">
          {status === 'error' && 'Something went wrong. Please try again.'}
        </p>
      </form>
    </>
  )
}

export const SignupCard = () => <SignupForm />
