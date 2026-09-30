import { describe, expect, it } from 'vitest'
import type { Habit, HabitLog } from '../types/app'
import { calculateHabitAnalytics } from '../utils/habitCalculations'

const habits: Habit[] = [
  { id: 'one', name: 'One', icon: '1', color: '#fff', monthlyTarget: 2, order: 0, active: true, createdAt: '' },
  { id: 'two', name: 'Two', icon: '2', color: '#fff', monthlyTarget: 4, order: 1, active: true, createdAt: '' },
  { id: 'archived', name: 'Archived', icon: '3', color: '#fff', monthlyTarget: 30, order: 2, active: false, createdAt: '' },
]

const logs: HabitLog[] = [
  { id: '1', habitId: 'one', date: '2026-09-01', completed: true },
  { id: '2', habitId: 'one', date: '2026-09-02', completed: true },
  { id: '3', habitId: 'two', date: '2026-09-01', completed: true },
  { id: '4', habitId: 'two', date: '2026-09-02', completed: false },
  { id: '5', habitId: 'archived', date: '2026-09-01', completed: true },
]

describe('habit analytics', () => {
  it('calculates active goals, completion, remaining, and capped progress', () => {
    const result = calculateHabitAnalytics(habits, logs, new Date(2026, 8, 1))
    expect(result.completed).toBe(3)
    expect(result.goal).toBe(6)
    expect(result.remaining).toBe(3)
    expect(result.percentage).toBe(50)
  })

  it('calculates daily and weekly totals from actual calendar days', () => {
    const result = calculateHabitAnalytics(habits, logs, new Date(2026, 8, 1))
    expect(result.daily[0]).toMatchObject({ day: 1, completed: 2, total: 2, percentage: 100 })
    expect(result.weekly[0]).toMatchObject({ label: '1-6', completed: 3, total: 12, percentage: 25 })
  })

  it('sorts the leaderboard by capped completion percentage', () => {
    const result = calculateHabitAnalytics(habits, logs, new Date(2026, 8, 1))
    expect(result.leaderboard.map((item) => item.habit.id)).toEqual(['one', 'two'])
    expect(result.leaderboard[0]?.remaining).toBe(0)
  })
})