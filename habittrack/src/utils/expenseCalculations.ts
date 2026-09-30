import type { Expense } from '../types/app'
import { dateKey, getMonthDays, getMonthWeeks } from './dateUtils'

export type DailyExpense = { day: number; date: string; amount: number }
export type WeeklyExpense = { label: string; amount: number }
export type CategoryExpense = { category: string; amount: number }

export type ExpenseAnalytics = {
  monthExpenses: Expense[]
  total: number
  daily: DailyExpense[]
  weekly: WeeklyExpense[]
  categories: CategoryExpense[]
}

function isInMonth(date: string, month: Date): boolean {
  return date.startsWith(dateKey(getMonthDays(month)[0]).slice(0, 7))
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)
}

export function calculateExpenseAnalytics(expenses: Expense[], month: Date): ExpenseAnalytics {
  const monthExpenses = expenses.filter((expense) => isInMonth(expense.date, month))
  const total = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  const daily = getMonthDays(month).map((day) => {
    const date = dateKey(day)
    return { day: day.getDate(), date, amount: monthExpenses.filter((expense) => expense.date === date).reduce((sum, expense) => sum + expense.amount, 0) }
  })
  const weekly = getMonthWeeks(month).map((week) => {
    const dates = new Set(week.map(dateKey))
    return { label: `${week[0]?.getDate()}-${week[week.length - 1]?.getDate()}`, amount: monthExpenses.filter((expense) => dates.has(expense.date)).reduce((sum, expense) => sum + expense.amount, 0) }
  })
  const categories = [...monthExpenses.reduce((totals, expense) => totals.set(expense.category, (totals.get(expense.category) ?? 0) + expense.amount), new Map<string, number>())].map(([category, amount]) => ({ category, amount })).sort((a, b) => b.amount - a.amount)
  return { monthExpenses, total, daily, weekly, categories }
}