import { addMonths, startOfYear } from 'date-fns'
import type { Expense, Habit, HabitLog } from '../types/app'
import { calculateExpenseAnalytics } from './expenseCalculations'
import { calculateHabitAnalytics } from './habitCalculations'

export type YearlyMonthSummary = {
  month: Date
  label: string
  completed: number
  goal: number
  remaining: number
  percentage: number
  expenses: number
}

export function calculateYearlyOverview(habits: Habit[], logs: HabitLog[], expenses: Expense[], year: number) {
  const months = Array.from({ length: 12 }, (_, index) => addMonths(startOfYear(new Date(year, 0, 1)), index))
  const summaries: YearlyMonthSummary[] = months.map((month) => {
    const habitAnalytics = calculateHabitAnalytics(habits, logs, month)
    const expenseAnalytics = calculateExpenseAnalytics(expenses, month)
    return { month, label: month.toLocaleString('en-US', { month: 'long' }), completed: habitAnalytics.completed, goal: habitAnalytics.goal, remaining: habitAnalytics.remaining, percentage: habitAnalytics.percentage, expenses: expenseAnalytics.total }
  })
  const completed = summaries.reduce((total, summary) => total + summary.completed, 0)
  const goal = summaries.reduce((total, summary) => total + summary.goal, 0)
  return { summaries, completed, goal, remaining: Math.max(goal - completed, 0), percentage: goal === 0 ? 0 : Math.min(100, Math.round((completed / goal) * 100)), expenses: summaries.reduce((total, summary) => total + summary.expenses, 0) }
}