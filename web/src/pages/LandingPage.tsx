import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import friendsImage from '../assets/friends.webp'
import foodImage from '../assets/food.webp'
import placesImage from '../assets/places.webp'
import { MediaSlot } from '../components/MediaSlot'
import { Asterisk, ArrowUpRight, Compass, Instagram } from '../components/icons'
import { SignupCard } from '../components/SignupForm'
import { usePageTitle } from '../hooks/usePageTitle'

export const LandingPage = () => {
  usePageTitle('Pasture — Come solo. Leave with new friends.')

  useEffect(() => {
    const scrollToSignup = () => {
      if (window.location.hash !== '#signup') return
      document.getElementById('signup')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    requestAnimationFrame(scrollToSignup)
    window.addEventListener('hashchange', scrollToSignup)
    return () => window.removeEventListener('hashchange', scrollToSignup)
  }, [])

  return (
    <div className="site-shell">
    <header className="site-header page-width">
      <a className="brand" href="#top" aria-label="Pasture home">pasture</a>
      <nav className="header-nav" aria-label="Main navigation">
        <a href="#signup">explore <Compass /></a>
        <a className="instagram-link" href="https://instagram.com/pasture.place" target="_blank" rel="noreferrer" aria-label="Pasture on Instagram"><Instagram /></a>
      </nav>
    </header>

    <main id="top">
      <section className="hero page-width">
        <div className="hero-copy">
          <h1>come solo.<br /><em>leave with new friends.</em></h1>
          <p className="hero-deck">pasture is a social app for Christians to meet in real life — over brunch, dinner, and whatever makes a good plan.</p>
          <a className="primary-button" href="#signup">I'm interested <ArrowUpRight /></a>
          <p className="hero-note"><span className="live-dot" /> first stop: Austin, TX</p>
        </div>

        <div className="hero-media" aria-label="Pasture people and community media placeholders">
          <div className="media-frame">
            <MediaSlot className="media-main" src={placesImage} alt="Places to gather in Austin" />
            <MediaSlot className="media-small media-small-one" src={friendsImage} alt="Friends gathered around a fire outdoors" />
            <MediaSlot className="media-small media-small-two" src={foodImage} alt="Food prepared for sharing" />
            <Asterisk className="media-star" />
            <Asterisk className="media-star media-star-top" />
            <Asterisk className="media-star media-star-right" />
          </div>
        </div>
      </section>

      <section className="one-line page-width">
        <p>seven people. one table. <em>more life together.</em></p>
        <div className="one-line-tags"><span>brunch</span><span>dinner</span><span>new friends</span></div>
      </section>

      <section className="signup page-width" id="signup">
        <div className="signup-copy">
          <h2><span>Coming to</span><em>Austin, TX.</em></h2>
          <p>Get the first invite when we launch.</p>
        </div>
        <div className="signup-card">
          <div className="signup-card-head"><span>be the first to know.</span><span><Asterisk /></span></div>
          <SignupCard />
        </div>
      </section>
    </main>

    <footer className="site-footer page-width">
      <a className="brand" href="#top">pasture</a>
      <p>made for real life.</p>
      <div className="footer-links">
        <Link to="/privacy">privacy</Link>
        <Link to="/terms">terms</Link>
        <a href="mailto:hello@pasture.place">hello@pasture.place</a>
      </div>
    </footer>
    </div>
  )
}
