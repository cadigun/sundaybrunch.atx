import { useState, type FormEvent } from 'react'
import type { EventConfig } from '../types'

type PromptDraft = { template: string; optionsText: string }

const newPrompt = (): PromptDraft => ({ template: '', optionsText: '' })
const generateEventId = () => {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789'
  const random = crypto.getRandomValues(new Uint8Array(8))
  return Array.from(random, (byte) => alphabet[byte % alphabet.length]).join('')
}

function parseOptions(value: string) {
  const options: Record<string, string[]> = {}
  for (const line of value.split('\n').map((part) => part.trim()).filter(Boolean)) {
    const [name, ...rawValues] = line.split(':')
    const values = rawValues.join(':').split(',').map((part) => part.trim()).filter(Boolean)
    if (!name.trim() || !values.length) throw new Error('Write options like “color: red, blue”.')
    options[name.trim()] = values
  }
  return options
}

export const EventForm = ({ store, onSaved }: { store: 'local' | 'production'; onSaved: () => void }) => {
  const [id, setId] = useState('')
  const [name, setName] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [schedule, setSchedule] = useState<'scheduled' | 'open' | 'paused'>('scheduled')
  const [prompts, setPrompts] = useState<PromptDraft[]>([newPrompt()])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  const updatePrompt = (index: number, field: keyof PromptDraft, value: string) => {
    setPrompts((current) => current.map((prompt, promptIndex) => promptIndex === index ? { ...prompt, [field]: value } : prompt))
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    setSaved(false)

    try {
      const config: EventConfig = {
        name: name.trim(),
        active: schedule === 'scheduled' ? null : schedule === 'open',
        startTime: startTime ? new Date(startTime).toISOString() : null,
        endTime: endTime ? new Date(endTime).toISOString() : null,
        prompts: prompts.map(({ template, optionsText }) => {
          const options = parseOptions(optionsText)
          return Object.keys(options).length ? { template: template.trim(), options } : template.trim()
        }),
      }
      const response = await fetch('/admin/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: id.trim(), config, store }),
      })
      const body = await response.json()
      if (!response.ok) throw new Error(body.error ?? 'Could not save event.')

      setSaved(true)
      setId('')
      setName('')
      setStartTime('')
      setEndTime('')
      setSchedule('scheduled')
      setPrompts([newPrompt()])
      onSaved()
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Could not save event.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <details className="event-form-panel">
      <summary>Create event</summary>
      <form className="event-form" onSubmit={submit}>
        <div className="form-grid">
          <label>Event title<input value={name} onChange={(event) => setName(event.target.value)} placeholder="Sunday Table" required /></label>
          <label>Event ID<div className="event-id-field"><input value={id} onChange={(event) => setId(event.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))} placeholder="sunday-table" pattern="[a-z0-9]+(-[a-z0-9]+)*" required /><button className="icon-button generate-id" type="button" aria-label="Generate random event ID" title="Generate random event ID" onClick={() => setId(generateEventId())}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h3l10 10h3M4 17h3L17 7h3M17 4h3v3M17 17h3v3" /></svg></button></div><small>Used in the QR link: /c/{id || 'event-id'}</small></label>
          <label>Availability<select value={schedule} onChange={(event) => setSchedule(event.target.value as typeof schedule)}><option value="scheduled">Use start and end times</option><option value="open">Force open</option><option value="paused">Paused</option></select></label>
          <label>Starts<input type="datetime-local" value={startTime} onChange={(event) => setStartTime(event.target.value)} /></label>
          <label>Ends<input type="datetime-local" value={endTime} onChange={(event) => setEndTime(event.target.value)} /></label>
        </div>
        <div className="prompt-editor-heading"><h3>Challenge prompts</h3><button className="text-button" type="button" onClick={() => setPrompts((current) => [...current, newPrompt()])}>+ Add prompt</button></div>
        <div className="prompt-editor-list">
          {prompts.map((prompt, index) => (
            <fieldset className="prompt-editor" key={index}>
              <legend>Prompt {index + 1}</legend>
              <label>Prompt text<textarea value={prompt.template} onChange={(event) => updatePrompt(index, 'template', event.target.value)} placeholder="Take a picture with someone wearing {color}." required /></label>
              <label>Optional choices, one placeholder per line<textarea value={prompt.optionsText} onChange={(event) => updatePrompt(index, 'optionsText', event.target.value)} placeholder={'color: red, yellow, white, blue\ncontinent: Europe, Asia, Africa'} /></label>
              {prompts.length > 1 && <button className="remove-button" type="button" onClick={() => setPrompts((current) => current.filter((_, promptIndex) => promptIndex !== index))}>Remove prompt</button>}
            </fieldset>
          ))}
        </div>
        {error && <p className="form-feedback error" role="alert">{error}</p>}
        {saved && <p className="form-feedback success" role="status">Event saved.</p>}
        <button className="refresh-button save-button" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save event'}</button>
      </form>
    </details>
  )
}
