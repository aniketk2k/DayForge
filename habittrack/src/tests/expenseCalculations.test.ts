import { describe, expect, it } from 'vitest'
import type { Expense } from '../types/app'
import { calculateExpenseAnalytics, formatINR } from '../utils/expenseCalculations'

const expenses: Expense[] = [
  { id: 'one', date: '2026-09-14', amount: 500, category: 'Travel', description: 'Cab', createdAt: '' },
  { id: 'two', date: '2026-09-14', amount: 800, category: 'Food', description: 'Dinner', createdAt: '' },
  { id: 'three', date: '2026-09-22', amount: 212, category: 'Food', description: 'Movie snacks', createdAt: '' },
  { id: 'other-month', date: '2026-10-01', amount: 1000, category: 'Bills', description: 'Phone', createdAt: '' },
]

describe('expense analytics', () => {
  it('aggregates monthly totals and same-day expenses', () => {
    const result = calculateExpenseAnalytics(expenses, new Date(2026, 8, 1))
    expect(result.total).toBe(1512)
    expect(result.daily[13]).toMatchObject({ day: 14, amount: 1300 })
    expect(result.weekly[2]?.amount).toBe(1300)
    expect(result.categories).toEqual([{ category: 'Food', amount: 1012 }, { category: 'Travel', amount: 500 }])
  })

  it('formats Indian Rupee amounts', () => {
    expect(formatINR(102500)).toBe('₹1,02,500')
  })
})