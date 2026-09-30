export const DEFAULT_USER_ID = 'aniket'
export const DEFAULT_PASSWORD = 'HabitTrack@2026'

const SESSION_KEY = 'habittrack-authenticated'

async function hashPassword(password: string): Promise<string> {
  const bytes = new TextEncoder().encode(password)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

export async function authenticate(userId: string, password: string): Promise<boolean> {
  if (userId.trim().toLowerCase() !== DEFAULT_USER_ID) return false
  return (await hashPassword(password)) === (await hashPassword(DEFAULT_PASSWORD))
}

export function isAuthenticated(): boolean {
  return localStorage.getItem(SESSION_KEY) === 'true'
}

export function startSession(): void {
  localStorage.setItem(SESSION_KEY, 'true')
}

export function endSession(): void {
  localStorage.removeItem(SESSION_KEY)
}