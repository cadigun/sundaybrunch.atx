import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { usePageTitle } from '../hooks/usePageTitle'

const LegalLayout = ({ title, children }: { title: string; children: ReactNode }) => {
  usePageTitle(`${title} | Pasture`)

  return (
    <div className="legal-page">
      <div className="legal-shell">
        <header className="legal-header">
          <Link className="legal-brand" to="/">pasture</Link>
          <Link className="back-link" to="/">back home ↗</Link>
        </header>
        <h1>{title}</h1>
        <p className="legal-date">Effective date: November 4, 2026</p>
        <div className="legal-content">{children}</div>
        <footer className="legal-footer">
          <Link to="/privacy">privacy</Link>
          <Link to="/terms">terms</Link>
          <Link to="/">pasture</Link>
        </footer>
      </div>
    </div>
  )
}

export const PrivacyPage = () => (
  <LegalLayout title="Privacy policy">
    <p>Thanks for visiting Pasture. This page outlines how Pasture (“Pasture,” “we,” “us,” or “our”) collects, uses, and shares information when you visit our website, sign up for updates, or otherwise interact with us online.</p>
    <h2>What we collect</h2>
    <p>We collect the information you choose to provide, such as your email address and city or area. We may also collect information about how you use the website, including device, browser, approximate location, pages viewed, and interactions with the site. We may use cookies, analytics tools, and similar technologies for these purposes.</p>
    <h2>How we use information</h2>
    <p>We use information to operate, maintain, secure, and improve Pasture; understand interest in Pasture and potential locations; communicate with you about Pasture, including launch updates and invitations; respond to questions; prevent misuse; and comply with legal obligations.</p>
    <h2>Analytics and service providers</h2>
    <p>We may use Google Analytics and other third-party providers for website hosting, analytics, communications, security, and other business operations. These providers may process information on our behalf and may have their own privacy policies. We may also disclose information when reasonably necessary to comply with law, protect rights and safety, prevent fraud or misuse, or support a merger, financing, acquisition, or other business transfer.</p>
    <h2>Advertising and sale of information</h2>
    <p>We do not sell your personal information for money. We do not knowingly use information you provide to us for targeted advertising across unrelated websites. If our practices change, we will update this Policy and provide any notices or choices required by applicable law.</p>
    <h2>Retention and security</h2>
    <p>We retain information for as long as reasonably necessary for the purposes described in this Policy, including to maintain business records, resolve disputes, enforce agreements, and comply with law. We use reasonable safeguards designed to protect information, but no method of transmission or storage is completely secure.</p>
    <h2>Children</h2>
    <p>Pasture is not directed to children under 13, and we do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal information, please contact us so we can take appropriate action.</p>
    <h2>Updates</h2>
    <p>We may update this Policy from time to time. The updated version will be posted on this page with a revised effective date. Your continued use of the website after an update means the updated Policy applies to your use of the website, to the extent permitted by law.</p>
    <h2>Contact</h2>
    <p>Questions about this policy can be sent to <a href="mailto:hello@pasture.place">hello@pasture.place</a>.</p>
  </LegalLayout>
)

export const TermsPage = () => (
  <LegalLayout title="Terms of service">
    <p>Thanks for visiting Pasture. These Terms explain the rules for using our website, signing up for updates, and participating in Pasture. By using Pasture, you agree to these Terms.</p>
    <h2>About Pasture</h2>
    <p>Pasture is a social app designed to help Christians meet in real life.</p>
    <h2>Eligibility and information</h2>
    <p>Pasture is intended for people who are at least 18 years old. By using Pasture, you confirm that you meet this requirement and can enter into these Terms. You agree to provide accurate information and to update it when necessary.</p>
    <h2>Communications</h2>
    <p>When you sign up for updates, we may send you news about Pasture, including invitations, locations, and related product updates.</p>
    <h2>Acceptable use</h2>
    <p>You may not use Pasture to impersonate, exploit, or harm another person; submit unlawful or unauthorized content; infringe someone else’s rights; interfere with the service or its security; scrape or collect information without permission; or use Pasture for unlawful, abusive, fraudulent, or commercial purposes without our approval.</p>
    <h2>Third-party services and links</h2>
    <p>Pasture may link to or use third-party services. Those services have their own terms and policies. Pasture is not responsible for third-party services, content, availability, security, or practices.</p>
    <h2>Intellectual property</h2>
    <p>The Pasture name, logo, website, content, design, and related materials belong to Pasture or its licensors. You may not copy, modify, distribute, sell, or create derivative works from them without permission.</p>
    <h2>Disclaimers</h2>
    <p>To the fullest extent permitted by law, Pasture is provided “as is” and “as available,” without warranties of any kind. We do not guarantee that Pasture will always be available, secure, accurate, complete, or error-free.</p>
    <h2>Changes</h2>
    <p>We may update these Terms from time to time. We will post the updated version on this page and revise the effective date. Your continued use of Pasture after an update means you accept the revised Terms, to the extent permitted by law.</p>
    <h2>Contact</h2>
    <p>Questions about these terms can be sent to <a href="mailto:hello@pasture.place">hello@pasture.place</a>.</p>
  </LegalLayout>
)
