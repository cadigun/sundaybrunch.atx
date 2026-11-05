import { lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './styles.css'
import './legal.css'

const LandingPage = lazy(() => import('./pages/LandingPage').then(({ LandingPage }) => ({ default: LandingPage })))
const PrivacyPage = lazy(() => import('./pages/LegalPage').then(({ PrivacyPage }) => ({ default: PrivacyPage })))
const TermsPage = lazy(() => import('./pages/LegalPage').then(({ TermsPage }) => ({ default: TermsPage })))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then(({ NotFoundPage }) => ({ default: NotFoundPage })))

const RouteLoading = () => <div className="route-loading" aria-live="polite">loading…</div>

const App = () => (
  <Suspense fallback={<RouteLoading />}>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/privacy.html" element={<Navigate to="/privacy" replace />} />
      <Route path="/terms.html" element={<Navigate to="/terms" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </Suspense>
)

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
)
