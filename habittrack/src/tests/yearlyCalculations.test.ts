import { describe, expect, it } from 'vitest'
import type { Expense, Habit, HabitLog } from '../types/app'
import { calculateYearlyOverview } from '../utils/yearlyCalculations'

const habit: Habit = { id: 'habit', name: 'Habit', icon: '✨', color: '#fff', monthlyTarget: 2, order: 0, active: true, createdAt: '' }
const logs: HabitLog[] = [{ id: 'jan', habitId: 'habit', date: '2028-01-01', completed: true }, { id: 'feb', habitId: 'habit', date: '2028-02-29', completed: true }]
const expenses: Expense[] = [{ id: 'expense', date: '2028-02-29', amount: 1250, category: 'Food', description: 'Dinner', createdAt: '' }]

describe('yearly overview calculations', () => {
  it('returns all months and includes leap-day records in the right month', () => {
    const result = calculateYearlyOverview([habit], logs, expenses, 2028)
    expect(result.summaries).toHaveLength(12)
    expect(result.summaries[1]).toMatchObject({ label: 'February', completed: 1, expenses: 1250 })
    expect(result.completed).toBe(2)
  })
})