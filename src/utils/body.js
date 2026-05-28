export function parseBodyValue(value) {
  if (value === '' || value == null) return null
  const n = Number(value)
  if (Number.isNaN(n) || n < 0) return null
  return Math.round(n * 10) / 10
}

export function emptyBody(fields) {
  return Object.fromEntries(fields.map((f) => [f.key, null]))
}

export function normalizeBody(raw, fields) {
  const body = emptyBody(fields)
  if (!raw || typeof raw !== 'object') return body
  for (const f of fields) {
    if (raw[f.key] !== undefined && raw[f.key] !== null && raw[f.key] !== '') {
      body[f.key] = parseBodyValue(raw[f.key])
    }
  }
  return body
}

export function hasAnyBody(body, fields) {
  if (!body) return false
  return fields.some((f) => body[f.key] != null)
}

export function formatBodyValue(value, unit) {
  if (value == null) return '—'
  return `${value} ${unit}`
}
