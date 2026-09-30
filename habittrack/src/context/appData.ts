import { createContext } from 'react'
import type { AppData, Expense, Habit } from '../types/app'

export type AppDataContextValue = {
  data: AppData
  resetDemoData: () => void
  addHabit: (habit: Pick<Habit, 'name' | 'icon' | 'color' | 'monthlyTarget' | 'description'>) => void
  updateHabit: (habitId: string, updates: Partial<Pick<Habit, 'name' | 'icon' | 'color' | 'monthlyTarget' | 'description'>>) => void
  deleteHabit: (habitId: string) => void
  toggleHabitArchive: (habitId: string) => void
  reorderHabits: (fromIndex: number, toIndex: number) => void
  toggleHabitLog: (habitId: string, date: string) => void
  addExpense: (expense: Pick<Expense, 'date' | 'amount' | 'category' | 'description'>) => void
  updateExpense: (expenseId: string, updates: Partial<Pick<Expense, 'date' | 'amount' | 'category' | 'description'>>) => void
  deleteExpense: (expenseId: string) => void
  replaceData: (value: unknown) => boolean
}

export const AppDataContext = createContext<AppDataContextValue | null>(null)