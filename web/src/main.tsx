import { useState, type FormEvent } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

const TALLY_FORM_ID = 'your-form-id'
const SIGNUP_STORAGE_KEY = 'pasture-waitlist'
const SIGNUP_ENDPOINT = import.meta.env.VITE_SIGNUP_ENDPOINT ?? ''

type SignupEntry = {
  email: string
  city: string
  submittedAt: string
}

const ArrowUpRight = () => (
  <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
    <path d="M5.5 14.5 14.5 5.5M7 5.5h7.5V13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const Instagram = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.7" />
    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.7" />
    <circle cx="17.5" cy="6.7" r="1" fill="currentColor" />
  </svg>
)

const MediaSlot = ({ label, className, video = false }: { label: string; className: string; video?: boolean }) => (
  <div className={`media-slot ${className}`} aria-label={`${label} media placeholder`}>
    <span className="media-slot-label">{label}</span>
    {video && <span className="play-button">▶</span>}
  </div>
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
      const storedEntries = JSON.parse(localStorage.getItem(SIGNUP_STORAGE_KEY) ?? '[]') as SignupEntry[]
      localStorage.setItem(SIGNUP_STORAGE_KEY, JSON.stringify([...storedEntries, entry]))

      if (SIGNUP_ENDPOINT) {
        const response = await fetch(SIGNUP_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(entry),
        })

        if (!response.ok) throw new Error('Signup request failed')
      }

      setEmail('')
      setCity('')
      setStatus('saved')
    } catch {
      setStatus('error')
    }
  }

  return (
    <form className="tally-preview" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor="signup-email">Email address</label>
      <input
        className="form-line"
        id="signup-email"
        name="email"
        type="email"
        placeholder="email address"
        autoComplete="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
      />
      <label className="sr-only" htmlFor="signup-city">City or area</label>
      <input
        className="form-line"
        id="signup-city"
        name="city"
        type="text"
        placeholder="city or area"
        autoComplete="address-level2"
        value={city}
        onChange={(event) => setCity(event.target.value)}
        required
      />
      <button className="form-submit" type="submit" disabled={status === 'saving'}>
        {status === 'saving' ? 'saving…' : status === 'saved' ? 'you’re on the list' : 'sign up'}
        {status !== 'saved' && <ArrowUpRight />}
      </button>
      <p role="status">
        {status === 'saved' && 'Saved on this device for now.'}
        {status === 'error' && 'Something went wrong. Please try again.'}
      </p>
    </form>
  )
}

const TallyEmbed = () => {
  if (TALLY_FORM_ID === 'your-form-id') {
    return <SignupForm />
  }

  return <iframe className="tally-embed" title="Pasture pre-launch signup form" src={`https://tally.so/embed/${TALLY_FORM_ID}?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1`} loading="lazy" />
}

function App() {
  return (
    <div className="site-shell">
      <header className="site-header page-width">
        <a className="brand" href="#top" aria-label="Pasture home">pasture</a>
        <nav className="header-nav" aria-label="Main navigation">
          <a href="#signup">sign up <ArrowUpRight /></a>
          <a className="instagram-link" href="https://instagram.com" aria-label="Pasture on Instagram"><Instagram /></a>
        </nav>
      </header>

      <main id="top">
        <section className="hero page-width">
          <div className="hero-copy">
            <p className="eyebrow">coming soon / Austin, TX</p>
            <h1>come solo.<br /><em>leave with new friends.</em></h1>
            <p className="hero-deck">pasture is a social app for Christians to meet in real life — over brunch, dinner, and whatever makes a good plan.</p>
            <a className="primary-button" href="#signup">sign up <ArrowUpRight /></a>
            <p className="hero-note"><span className="live-dot" /> first stop: Austin, TX</p>
          </div>

          <div className="hero-media" aria-label="Pasture people and community media placeholders">
            <MediaSlot label="photo / 01" className="media-main" video />
            <MediaSlot label="photo / 02" className="media-small media-small-one" />
            <MediaSlot label="photo / 03" className="media-small media-small-two" />
            <span className="media-star">✳</span>
          </div>
        </section>

        <section className="one-line page-width">
          <p>real people. easy plans. <em>more life together.</em></p>
          <div className="one-line-tags"><span>brunch</span><span>dinner</span><span>new friends</span></div>
        </section>

        <section className="signup page-width" id="signup">
          <div className="signup-copy">
            <h2>pasture starts<br /><em>in Austin, TX.</em></h2>
            <p>Get the first invite when we’re ready to gather.</p>
            <p className="signup-location"><span className="live-dot" /> coming soon</p>
          </div>
          <div className="signup-card">
            <div className="signup-card-head"><span>save your spot.</span><span>✳</span></div>
            <div className="signup-card-copy"><p>join the early list.</p><h3>be the first to know.</h3></div>
            <TallyEmbed />
          </div>
        </section>
      </main>

      <footer className="site-footer page-width">
        <a className="brand" href="#top">pasture</a>
        <p>made for real life.</p>
        <div className="footer-links">
          <a href="/privacy.html">privacy</a>
          <a href="/terms.html">terms</a>
        <a href="mailto:hello@pasture.place">hello@pasture.place</a>
        </div>
      </footer>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<App />)
