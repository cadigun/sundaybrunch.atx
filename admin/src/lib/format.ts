export const formatDate = (value?: string | null) => {
  if (!value) return '—'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleString()
}

export const promptTemplate = (prompt: string | { template: string }) =>
  typeof prompt === 'string' ? prompt : prompt.template
