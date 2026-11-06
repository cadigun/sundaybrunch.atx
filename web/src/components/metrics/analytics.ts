const measurementId = 'G-WL3SRK6V5H'
const analyticsEnabled = import.meta.env.VITE_GA_ANALYTICS_ENABLED === 'true'

type AnalyticsWindow = Window & {
  dataLayer?: unknown[]
  gtag?: (...args: unknown[]) => void
}

export const initializeAnalytics = () => {
  if (!analyticsEnabled) return

  const analyticsWindow = window as AnalyticsWindow
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
  document.head.appendChild(script)

  analyticsWindow.dataLayer = analyticsWindow.dataLayer ?? []
  analyticsWindow.gtag = function () {
    analyticsWindow.dataLayer?.push(arguments)
  }

  analyticsWindow.gtag('js', new Date())
  analyticsWindow.gtag('config', measurementId)
}
