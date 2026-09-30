import { useEffect, useState, type ReactNode } from 'react'
import { createDemoData } from '../data/demoData'
import type { AppData, Expense, Habit } from '../types/app'
import { AppDataContext } from './appData'

const STORAGE_KEY = 'habittrack-data'

function isAppData(value: unknown): value is AppData {
  if (!value || typeof value !== 'object') return false
  const candidate = value as Partial<AppData>
  return Array.isArray(candidate.habits)
    && Array.isArray(candidate.habitLogs)
    && Array.isArray(candidate.expenses)
    && Boolean(candidate.settings)
}

function loadInitialData(): AppData {
  const storedData = localStorage.getItem(STORAGE_KEY)
  if (!storedData) return createDemoData()

  try {
    const parsedData: unknown = JSON.parse(storedData)
    return isAppData(parsedData) ? parsedData : createDemoData()
  } catch {
    return createDemoData()
  }
}

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(loadInitialData)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }, [data])

  const resetDemoData = () => setData(createDemoData())

  const addHabit = (habit: Pick<Habit, 'name' | 'icon' | 'color' | 'monthlyTarget' | 'description'>) => {
    setData((current) => ({
      ...current,
      habits: [...current.habits, {
        ...habit,
        id: `habit-${Date.now()}`,
        order: current.habits.length,
        active: true,
        createdAt: new Date().toISOString(),
      }],
    }))
  }

  const updateHabit = (habitId: string, updates: Partial<Pick<Habit, 'name' | 'icon' | 'color' | 'monthlyTarget' | 'description'>>) => {
    setData((current) => ({ ...current, habits: current.habits.map((habit) => habit.id === habitId ? { ...habit, ...updates } : habit) }))
  }

  const deleteHabit = (habitId: string) => {
    setData((current) => ({
      ...current,
      habits: current.habits.filter((habit) => habit.id !== habitId),
      habitLogs: current.habitLogs.filter((log) => log.habitId !== habitId),
    }))
  }

  const toggleHabitArchive = (habitId: string) => {
    setData((current) => ({ ...current, habits: current.habits.map((habit) => habit.id === habitId ? { ...habit, active: !habit.active } : habit) }))
  }

  const reorderHabits = (fromIndex: number, toIndex: number) => {
    setData((current) => {
      const habits = [...current.habits]
      const [movedHabit] = habits.splice(fromIndex, 1)
      if (!movedHabit) return current
      habits.splice(toIndex, 0, movedHabit)
      return { ...current, habits: habits.map((habit, index) => ({ ...habit, order: index })) }
    })
  }

  const toggleHabitLog = (habitId: string, date: string) => {
    setData((current) => {
      const existingLog = current.habitLogs.find((log) => log.habitId === habitId && log.date === date)
      if (existingLog) {
        return { ...current, habitLogs: current.habitLogs.map((log) => log.id === existingLog.id ? { ...log, completed: !log.completed } : log) }
      }
      return { ...current, habitLogs: [...current.habitLogs, { id: `log-${habitId}-${date}`, habitId, date, completed: true }] }
    })
  }

  const addExpense = (expense: Pick<Expense, 'date' | 'amount' | 'category' | 'description'>) => {
    setData((current) => ({ ...current, expenses: [...current.expenses, { ...expense, id: `expense-${Date.now()}`, createdAt: new Date().toISOString() }] }))
  }

  const updateExpense = (expenseId: string, updates: Partial<Pick<Expense, 'date' | 'amount' | 'category' | 'description'>>) => {
    setData((current) => ({ ...current, expenses: current.expenses.map((expense) => expense.id === expenseId ? { ...expense, ...updates } : expense) }))
  }

  const deleteExpense = (expenseId: string) => {
    setData((current) => ({ ...current, expenses: current.expenses.filter((expense) => expense.id !== expenseId) }))
  }

  const replaceData = (value: unknown) => {
    if (!isAppData(value)) return false
    setData(value)
    return true
  }

  return <AppDataContext.Provider value={{ data, resetDemoData, addHabit, updateHabit, deleteHabit, toggleHabitArchive, reorderHabits, toggleHabitLog, addExpense, updateExpense, deleteExpense, replaceData }}>{children}</AppDataContext.Provider>
}