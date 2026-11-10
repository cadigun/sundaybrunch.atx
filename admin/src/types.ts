export type PromptConfig = string | {
  template: string
  options?: Record<string, string[]>
}

export type EventConfig = {
  name?: string
  active?: boolean | null
  startTime?: string | null
  endTime?: string | null
  prompts?: PromptConfig[]
}

export type Submission = {
  claim_id: string
  instagram: string
  email: string
  prompt: string
  fun_fact?: string
  status: 'claimed' | 'completed'
  interest_opt_in: boolean
  claimed_at: string
  completed_at: string | null
}

export type EventData = {
  id: string
  config: EventConfig
  claims: Submission[]
}

export type Snapshot = {
  refreshedAt: string
  source: string
  events: EventData[]
  waitlist: WaitlistSignup[]
}

export type WaitlistSignup = {
  email: string
  city?: string
  submitted_at: string
  instagram?: string
  source?: string
}
