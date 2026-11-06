import { formatDate } from '../lib/format'
import type { Submission } from '../types'

export const SubmissionTable = ({ submissions }: { submissions: Submission[] }) => {
  if (!submissions.length) return <p className="empty">No submissions yet.</p>

  return (
    <div className="table-wrap">
      <table>
        <thead><tr><th>Participant</th><th>Assigned challenge</th><th>Status</th><th>Waitlist</th><th>Submitted</th></tr></thead>
        <tbody>
          {submissions.map((submission) => (
            <tr key={submission.claim_id}>
              <td><strong>@{submission.instagram}</strong><small>{submission.email}</small></td>
              <td>{submission.prompt}</td>
              <td><span className={`status status-${submission.status}`}>{submission.status}</span></td>
              <td>{submission.interest_opt_in ? 'Yes' : 'No'}</td>
              <td>{formatDate(submission.claimed_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
