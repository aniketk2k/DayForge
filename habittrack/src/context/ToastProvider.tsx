import { useState, type ReactNode } from 'react'
import { CheckCircle2, Info, X, XCircle } from 'lucide-react'
import { ToastContext, type ToastItem, type ToastTone } from './toast'

const toneStyles: Record<ToastTone, { icon: typeof CheckCircle2; color: string }> = {
  success: { icon: CheckCircle2, color: 'text-emerald-400' },
  error: { icon: XCircle, color: 'text-rose-400' },
  info: { icon: Info, color: 'text-cyan-400' },
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const dismiss = (id: number) => setToasts((current) => current.filter((toast) => toast.id !== id))
  const showToast = (message: string, tone: ToastTone = 'success') => {
    const id = Date.now() + Math.random()
    setToasts((current) => [...current, { id, message, tone }])
    window.setTimeout(() => dismiss(id), 3200)
  }

  return <ToastContext.Provider value={{ showToast }}>{children}<div className="pointer-events-none fixed bottom-5 right-5 z-[70] flex w-[min(22rem,calc(100vw-2rem))] flex-col gap-3" aria-live="polite">{toasts.map((toast) => { const { icon: Icon, color } = toneStyles[toast.tone]; return <div className="pointer-events-auto flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--panel)] px-4 py-3 text-sm font-semibold text-[var(--text-strong)] shadow-2xl shadow-slate-950/30" key={toast.id} role="status"><Icon className={color} size={18} /><span className="min-w-0 flex-1">{toast.message}</span><button className="icon-button h-7 w-7" type="button" onClick={() => dismiss(toast.id)} aria-label="Dismiss notification"><X size={15} /></button></div> })}</div></ToastContext.Provider>
}