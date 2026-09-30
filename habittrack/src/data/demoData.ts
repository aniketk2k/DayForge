import type { AppData, Expense, Habit, HabitLog } from '../types/app'

const demoHabits: Habit[] = [
  ['Wake up at 5:00 AM', '☀️', '#56d9e8', 28],
  ['Gym Workout', '🏋️', '#9b8afb', 14],
  ['Stretching', '🧘', '#f3b65f', 20],
  ['Cold Shower', '🚿', '#5eaeff', 18],
  ['Deep Work 1', '🧠', '#e98ad4', 22],
  ['Deep Work 2', '⌛', '#f27f6d', 18],
  ['Shallow Work 1', '📋', '#9bcf6b', 20],
  ['Shallow Work 2', '🗂️', '#7fc9bb', 18],
  ['Drink 5L Water', '💧', '#68b4f8', 25],
  ['Read 10 Pages', '📖', '#f0a86b', 20],
  ['No Snoozing', '⏰', '#e88999', 22],
  ['Limit Social Media', '📵', '#b19ae9', 20],
  ['Skincare Routine', '✨', '#e4a8c8', 18],
  ['Reflection', '✍️', '#8dc5df', 16],
].map(([name, icon, color, monthlyTarget], index) => ({
  id: `demo-habit-${index + 1}`,
  name: String(name),
  icon: String(icon),
  color: String(color),
  description: '',
  monthlyTarget: Number(monthlyTarget),
  order: index,
  active: true,
  createdAt: '2026-09-01T08:00:00.000Z',
}))

function createDemoLogs(habits: Habit[]): HabitLog[] {
  return habits.flatMap((habit, habitIndex) => {
    const completedDays = Math.min(habit.monthlyTarget, 5 + (habitIndex % 7))
    return Array.from({ length: completedDays }, (_, dayIndex) => {
      const day = String(dayIndex + 1).padStart(2, '0')
      return {
        id: `demo-log-${habit.id}-${day}`,
        habitId: habit.id,
        date: `2026-09-${day}`,
        completed: true,
      }
    })
  })
}

const demoExpenses: Expense[] = [
  { id: 'demo-expense-1', date: '2026-09-04', amount: 420, category: 'Food', description: 'Breakfast and coffee', createdAt: '2026-09-04T09:10:00.000Z' },
  { id: 'demo-expense-2', date: '2026-09-14', amount: 500, category: 'Travel', description: 'Metro and cab', createdAt: '2026-09-14T18:30:00.000Z' },
  { id: 'demo-expense-3', date: '2026-09-14', amount: 800, category: 'Food', description: 'Dinner', createdAt: '2026-09-14T21:00:00.000Z' },
  { id: 'demo-expense-4', date: '2026-09-22', amount: 212, category: 'Entertainment', description: 'Movie ticket', createdAt: '2026-09-22T20:15:00.000Z' },
]

export function createDemoData(): AppData {
  const habits = demoHabits.map((habit) => ({ ...habit }))
  return {
    habits,
    habitLogs: createDemoLogs(habits),
    expenses: demoExpenses.map((expense) => ({ ...expense })),
    settings: { theme: 'dark', currency: 'INR' },
  }
}