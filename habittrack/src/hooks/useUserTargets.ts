import { useEffect, useState } from 'react'
import { format } from 'date-fns'

export type UserTarget = {
  id: string
  title: string
  targetDate: string // YYYY-MM-DD
}

export type TargetCountdown = {
  days: number
  label: string
  formattedDate: string
  isPast: boolean
  isToday: boolean
}

const STORAGE_KEY = 'habittrack-user-targets'

const DEFAULT_TARGETS: UserTarget[] = [
  {
    id: 'target-1',
    title: 'Winter Arc 2026',
    targetDate: '2026-12-31',
  },
  {
    id: 'target-2',
    title: 'Phase 1 Sprint',
    targetDate: '2026-11-30',
  },
]

export function calculateCountdown(targetDateStr: string, today: Date = new Date()): TargetCountdown {
  try {
    const [year, month, day] = targetDateStr.split('-').map(Number)
    if (!year || !month || !day) {
      return { days: 0, label: 'Invalid Date', formattedDate: '', isPast: false, isToday: false }
    }
    const target = new Date(year, month - 1, day)
    const current = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const diffMs = target.getTime() - current.getTime()
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))

    const formattedDate = format(target, 'd MMM yyyy')

    if (diffDays === 0) {
      return { days: 0, label: 'Today!', formattedDate, isPast: false, isToday: true }
    }
    if (diffDays > 0) {
      return {
        days: diffDays,
        label: `${diffDays} ${diffDays === 1 ? 'day' : 'days'} left`,
        formattedDate,
        isPast: false,
        isToday: false,
      }
    }
    const pastDays = Math.abs(diffDays)
    return {
      days: diffDays,
      label: `${pastDays} ${pastDays === 1 ? 'day' : 'days'} ago`,
      formattedDate,
      isPast: true,
      isToday: false,
    }
  } catch {
    return { days: 0, label: 'Set Date', formattedDate: '', isPast: false, isToday: false }
  }
}

export function useUserTargets() {
  const [targets, setTargets] = useState<UserTarget[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length >= 2) {
          return parsed as UserTarget[]
        }
      }
    } catch {
      // Fallback
    }
    return DEFAULT_TARGETS
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(targets))
    } catch {
      // Ignore quota errors
    }
  }, [targets])

  const updateTarget = (targetId: string, updates: Partial<Omit<UserTarget, 'id'>>) => {
    setTargets((current) =>
      current.map((t) => (t.id === targetId ? { ...t, ...updates } : t))
    )
  }

  const target1 = targets.find((t) => t.id === 'target-1') ?? DEFAULT_TARGETS[0]!
  const target2 = targets.find((t) => t.id === 'target-2') ?? DEFAULT_TARGETS[1]!

  return {
    targets,
    target1,
    target2,
    updateTarget,
  }
}
