import { Link } from 'react-router-dom'
import { ArrowUpRight } from '../components/icons'

export const NotFoundPage = () => (
  <div className="not-found-page">
    <header className="not-found-header page-width">
      <Link className="brand" to="/">pasture</Link>
      <Link className="not-found-back-link" to="/">back home <ArrowUpRight /></Link>
    </header>
    <main className="not-found-content page-width">
      <p className="not-found-kicker">404 / page not found</p>
      <h1>looks like this page wandered off.</h1>
      <p>let’s get you back to the table.</p>
      <Link className="primary-button" to="/">return home <ArrowUpRight /></Link>
    </main>
  </div>
)
