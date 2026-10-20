// All dates are stored as local "YYYY-MM-DD" strings so they're easy to compare and group.

export function toISO(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function parseISO(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export const today = () => toISO(new Date())

export function addDays(iso: string, n: number): string {
  const d = parseISO(iso)
  d.setDate(d.getDate() + n)
  return toISO(d)
}

/** Monday of the week containing `iso`. */
export function startOfWeek(iso: string): string {
  const d = parseISO(iso)
  const offset = (d.getDay() + 6) % 7
  return addDays(iso, -offset)
}

export function weekDates(iso: string): string[] {
  const start = startOfWeek(iso)
  return Array.from({ length: 7 }, (_, i) => addDays(start, i))
}

export const dayShort = (iso: string) => parseISO(iso).toLocaleDateString(undefined, { weekday: 'short' })
export const dayNum = (iso: string) => parseISO(iso).getDate()
export const monthDay = (iso: string) => parseISO(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
export const longDate = (iso: string) =>
  parseISO(iso).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })

export function greeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export function mealTypeForNow(): 'breakfast' | 'lunch' | 'dinner' {
  const h = new Date().getHours()
  if (h < 11) return 'breakfast'
  if (h < 16) return 'lunch'
  return 'dinner'
}
