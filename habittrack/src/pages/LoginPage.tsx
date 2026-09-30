import { useState, type FormEvent } from 'react'
import { ArrowRight, LockKeyhole, Sparkles, UserRound } from 'lucide-react'
import { authenticate, DEFAULT_USER_ID } from '../auth/auth'

export function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError('')
    const valid = await authenticate(userId, password)
    if (valid) {
      onLogin()
    } else {
      setError('That ID and password do not match the local account.')
    }
    setIsSubmitting(false)
  }

  return <main className="flex min-h-screen items-center justify-center bg-[var(--background)] px-5 py-10 text-[var(--text)]"><section className="w-full max-w-md rounded-3xl border border-[var(--border)] bg-[var(--panel)] p-7 shadow-[var(--shadow)] sm:p-9"><div className="flex items-center gap-3"><span className="flex size-11 items-center justify-center rounded-xl bg-[var(--accent)] text-slate-950"><Sparkles size={20} strokeWidth={2.5} /></span><div><p className="text-sm font-bold tracking-wide text-[var(--text-strong)]">HabitTrack</p><p className="text-xs text-[var(--text-muted)]">Your daily rhythm</p></div></div><div className="mt-10"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--accent)]">Private workspace</p><h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--text-strong)]">Welcome back.</h1><p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">Sign in to continue tracking your habits and expenses on this device.</p></div><form className="mt-8 space-y-4" onSubmit={submit}><label className="block text-sm font-semibold text-[var(--text-muted)]">User ID<div className="relative mt-2"><UserRound className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-faint)]" size={17} /><input className="field pl-10" value={userId} onChange={(event) => setUserId(event.target.value)} placeholder={DEFAULT_USER_ID} autoComplete="username" required /></div></label><label className="block text-sm font-semibold text-[var(--text-muted)]">Password<div className="relative mt-2"><LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-faint)]" size={17} /><input className="field pl-10" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter password" autoComplete="current-password" required /></div></label>{error ? <p className="text-sm font-semibold text-rose-400" role="alert">{error}</p> : null}<button className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-3 text-sm font-bold text-slate-950 transition hover:brightness-110 disabled:cursor-wait disabled:opacity-60" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Checking...' : 'Sign in'}<ArrowRight size={17} /></button></form><p className="mt-6 text-center text-xs leading-5 text-[var(--text-faint)]">Local personal-use login. Cloud authentication will be added in a future phase.</p></section></main>
}