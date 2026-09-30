import { describe, expect, it } from 'vitest'
import type { HabitLog } from '../types/app'
import { calculateHabitStreaks } from '../utils/streakCalculations'

const logs: HabitLog[] = [
  { id: '1', habitId: 'habit', date: '2026-09-01', completed: true },
  { id: '2', habitId: 'habit', date: '2026-09-02', completed: true },
  { id: '3', habitId: 'habit', date: '2026-09-03', completed: true },
  { id: '4', habitId: 'habit', date: '2026-09-05', completed: true },
  { id: '5', habitId: 'habit', date: '2026-09-06', completed: true },
  { id: '6', habitId: 'other', date: '2026-09-01', completed: true },
]

describe('habit streak calculations', () => {
  it('finds the current and longest consecutive runs', () => {
    expect(calculateHabitStreaks('habit', logs)).toEqual({ current: 2, longest: 3 })
  })

  it('ignores incomplete logs and returns zero for no completions', () => {
    expect(calculateHabitStreaks('missing', logs)).toEqual({ current: 0, longest: 0 })
    expect(calculateHabitStreaks('habit', [...logs, { id: '7', habitId: 'habit', date: '2026-09-07', completed: false }])).toEqual({ current: 2, longest: 3 })
  })
})