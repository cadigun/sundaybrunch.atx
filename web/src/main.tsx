import { createRoot } from 'react-dom/client'
import { useState } from 'react'
import './styles.css'

const ArrowUpRight = () => (
  <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
    <path d="M5.5 14.5 14.5 5.5M7 5.5h7.5V13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const ChevronDown = () => (
  <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
    <path d="m5 7.5 5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const Check = () => (
  <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
    <path d="m4.5 10.2 3.7 3.7 7.4-8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const Calendar = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
    <rect x="3.5" y="5" width="17" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M7.5 3.5v3M16.5 3.5v3M3.5 9.5h17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const Users = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
    <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
    <path d="M3.5 19.5c.5-3.1 2.2-5 5.5-5s5 1.9 5.5 5M16 11a3 3 0 1 0 0-6M16.3 14.7c2.5.3 3.9 1.9 4.2 4.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const Sparkle = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
    <path d="m12 2 1.35 6.65L20 10l-6.65 1.35L12 18l-1.35-6.65L4 10l6.65-1.35L12 2ZM19.2 16.2l.55 2.65 2.65.55-2.65.55-.55 2.65-.55-2.65-2.65-.55 2.65-.55.55-2.65Z" stroke="currentColor" strokeWidth="1.35" strokeLinejoin="round" />
  </svg>
)

function App() {
  const [email, setEmail] = useState('')
  const [city, setCity] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (email.trim()) setSubmitted(true)
  }

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Sunday Brunch home">
          <span className="brand-logo-slot" aria-hidden="true">logo</span>
          <span className="brand-name">Sunday Brunch</span>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#how-it-works">How it works</a>
          <a href="#vision">Our vision</a>
          <a href="#waitlist">Join the waitlist</a>
        </nav>
        <a className="nav-cta" href="#waitlist">Join the waitlist <ArrowUpRight /></a>
      </header>

      <main id="top">
        <section className="hero section-pad">
          <div className="hero-copy">
            <p className="eyebrow"><span className="eyebrow-dot" /> For the people who want more community</p>
            <h1>Meet your people, <em>one Sunday</em> at a time.</h1>
            <p className="launch-badge"><span className="launch-pulse" /> Launching soon in <strong>Austin, TX</strong></p>
            <p className="hero-intro">A social meetup app helping Christians build real friendships over good food, easy conversation, and a table with room for one more. Austin is first — more cities are on the way.</p>
            <form className="waitlist-form hero-form" onSubmit={handleSubmit}>
              <label className="sr-only" htmlFor="hero-email">Your email address</label>
              <input id="hero-email" type="email" placeholder="Your email address" value={email} onChange={(event) => setEmail(event.target.value)} required />
              <label className="sr-only" htmlFor="hero-city">Your city or area</label>
              <input id="hero-city" type="text" placeholder="City or area" value={city} onChange={(event) => setCity(event.target.value)} required />
              <button type="submit">{submitted ? 'You’re on the list' : 'Join the waitlist'} <ArrowUpRight /></button>
            </form>
            <p className="form-note"><span className="tiny-lock">✦</span> In Austin? You’ll hear first. Elsewhere? We’ll let you know when we’re near you.</p>
          </div>

          <div className="hero-art" aria-label="Placeholder for a Sunday brunch lifestyle photo">
            <div className="photo-placeholder">
              <span className="placeholder-label">Your brunch photo here</span>
              <span className="placeholder-subtext">A candid moment of friendship</span>
            </div>
            <div className="hero-sticker sticker-top">come as you are <span>✦</span></div>
            <div className="hero-sticker sticker-bottom"><span className="sticker-dot" /> good people, good food</div>
            <div className="hero-doodle" aria-hidden="true"><span /><span /><span /></div>
          </div>
        </section>

        <section className="marquee" aria-label="Sunday Brunch values">
          <div className="marquee-track"><span>good food</span><b>✳</b><span>new friends</span><b>✳</b><span>shared Sundays</span><b>✳</b><span>good food</span><b>✳</b><span>new friends</span><b>✳</b><span>shared Sundays</span><b>✳</b></div>
        </section>

        <section className="how section-pad" id="how-it-works">
          <div className="section-heading split-heading">
            <div><p className="eyebrow">Simple by design</p><h2>Make room for <em>something new.</em></h2></div>
            <p>Showing up is the hardest part. We’ll help with the rest.</p>
          </div>
          <div className="steps-grid">
            <article className="step-card">
              <div className="step-number">01</div>
              <div className="step-icon"><Calendar /></div>
              <h3>Pick a Sunday</h3>
              <p>Find a brunch gathering that fits your schedule and your neighborhood.</p>
            </article>
            <article className="step-card step-card-featured">
              <div className="step-number">02</div>
              <div className="step-icon"><Users /></div>
              <h3>Meet your table</h3>
              <p>We bring together a small group of kind, curious people who are open to connection.</p>
            </article>
            <article className="step-card">
              <div className="step-number">03</div>
              <div className="step-icon"><Sparkle /></div>
              <h3>Leave with more</h3>
              <p>Good conversation, a full heart, and maybe a few new names in your phone.</p>
            </article>
          </div>
        </section>

        <section className="vision section-pad" id="vision">
          <div className="vision-art" aria-hidden="true">
            <div className="vision-circle vision-circle-back" />
            <div className="vision-circle vision-circle-front"><span>Sunday<br /><i>well spent</i></span></div>
            <div className="vision-scribble">✦</div>
          </div>
          <div className="vision-copy">
            <p className="eyebrow">More than a meetup</p>
            <h2>Friendship shouldn’t end when <em>brunch does.</em></h2>
            <p>Sunday Brunch starts around a table, but we’re building something that stretches far beyond it. More shared experiences. More reasons to get out of your routine. More of the kind of community that makes a city feel like home.</p>
            <ul className="vision-list">
              <li><span><Check /></span> A low-pressure way to meet new people</li>
              <li><span><Check /></span> Community rooted in kindness and curiosity</li>
              <li><span><Check /></span> Gatherings for every kind of Sunday</li>
            </ul>
            <a className="text-link" href="#waitlist">Come build it with us <ArrowUpRight /></a>
          </div>
        </section>

        <section className="waitlist section-pad" id="waitlist">
          <div className="waitlist-inner">
            <div className="waitlist-copy">
              <p className="eyebrow eyebrow-light">First dibs</p>
              <h2>Save a seat at the table.</h2>
              <p>We’re starting in Austin, TX and growing from there. Join the list for early access, launch updates, and a note when Sunday Brunch is coming to a city near you.</p>
              <div className="waitlist-meta"><span className="meta-dot" /> First stop: Austin, TX <span className="meta-divider">·</span> More cities coming soon</div>
            </div>
            <div className="tally-card">
              <div className="tally-card-head"><span>Sunday Brunch</span><span className="tally-spark">✦</span></div>
              <div className="tally-form-note"><span>✦</span><h3>Be the first to know.</h3><p>Leave your email and we’ll save you a spot.</p></div>
              {/* Replace the src below with your Tally form embed URL when ready. Include email + city/area questions. */}
              <iframe title="Sunday Brunch waitlist form" src="https://tally.so/embed/your-form-id?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1" loading="lazy" />
              <p className="tally-placeholder-note">Tally form embed goes here</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <a className="brand footer-brand" href="#top"><span className="brand-logo-slot" aria-hidden="true">logo</span><span className="brand-name">Sunday Brunch</span></a>
        <p>Good people. Good food. Shared Sundays.</p>
        <div className="footer-links"><a href="mailto:hello@sundaybrunch.app">Say hello</a><a href="#top">Back to top ↑</a></div>
      </footer>
    </div>
  )
}

export default App

createRoot(document.getElementById('root')!).render(<App />)
