import { createContext } from 'react'

export type ToastTone = 'success' | 'error' | 'info'
export type ToastItem = { id: number; message: string; tone: ToastTone }
export type ToastContextValue = { showToast: (message: string, tone?: ToastTone) => void }

export const ToastContext = createContext<ToastContextValue | null>(null)