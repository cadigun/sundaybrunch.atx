import { promptTemplate } from '../lib/format'
import type { PromptConfig } from '../types'

export const PromptList = ({ prompts }: { prompts: PromptConfig[] }) => (
  <details className="prompt-details">
    <summary>Prompt pool <span>{prompts.length}</span></summary>
    <ul>
      {prompts.map((prompt, index) => (
        <li key={`${index}-${promptTemplate(prompt)}`}>
          <p>{promptTemplate(prompt)}</p>
          {typeof prompt !== 'string' && prompt.options && (
            <small>{Object.entries(prompt.options).map(([key, values]) => `${key}: ${values.join(', ')}`).join(' · ')}</small>
          )}
        </li>
      ))}
    </ul>
  </details>
)
