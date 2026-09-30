export type Theme = 'dark' | 'light'

export type Habit = {
  id: string
  name: string
  icon: string
  color: string
  description?: string
  monthlyTarget: number
  order: number
  active: boolean
  createdAt: string
}

export type HabitLog = {
  id: string
  habitId: string
  date: string
  completed: boolean
}

export type Expense = {
  id: string
  date: string
  amount: number
  category: string
  description: string
  createdAt: string
}

export type Settings = {
  theme: Theme
  currency: 'INR'
}

export type AppData = {
  habits: Habit[]
  habitLogs: HabitLog[]
  expenses: Expense[]
  settings: Settings
}