import type { Habit, HabitLog } from '../types/app'
import { dateKey, getMonthDays, getMonthWeeks } from './dateUtils'

export type DailyProgress = {
  day: number
  date: string
  completed: number
  total: number
  percentage: number
}

export type WeeklyProgress = {
  label: string
  startDay: number
  endDay: number
  completed: number
  total: number
  percentage: number
}

export type HabitRanking = {
  habit: Habit
  completed: number
  remaining: number
  percentage: number
}

export type HabitAnalytics = {
  completed: number
  goal: number
  remaining: number
  percentage: number
  daily: DailyProgress[]
  weekly: WeeklyProgress[]
  leaderboard: HabitRanking[]
}

function completedLogKeys(logs: HabitLog[], month: Date, activeHabitIds: Set<string>): Set<string> {
  const monthPrefix = dateKey(getMonthDays(month)[0]).slice(0, 7)
  return new Set(logs.filter((log) => log.completed && activeHabitIds.has(log.habitId) && log.date.startsWith(monthPrefix)).map((log) => `${log.habitId}:${log.date}`))
}

function countCompleted(logKeys: Set<string>, habitIds: string[], days: Date[]): number {
  let completed = 0
  for (const habitId of habitIds) {
    for (const day of days) completed += logKeys.has(`${habitId}:${dateKey(day)}`) ? 1 : 0
  }
  return completed
}

export function calculateHabitAnalytics(habits: Habit[], logs: HabitLog[], month: Date): HabitAnalytics {
  const activeHabits = habits.filter((habit) => habit.active).sort((a, b) => a.order - b.order)
  const habitIds = activeHabits.map((habit) => habit.id)
  const activeHabitIds = new Set(habitIds)
  const logKeys = completedLogKeys(logs, month, activeHabitIds)
  const days = getMonthDays(month)
  const completed = countCompleted(logKeys, habitIds, days)
  const goal = activeHabits.reduce((total, habit) => total + habit.monthlyTarget, 0)

  const daily = days.map((day) => {
    const completedForDay = countCompleted(logKeys, habitIds, [day])
    const total = activeHabits.length
    return { day: day.getDate(), date: dateKey(day), completed: completedForDay, total, percentage: total === 0 ? 0 : Math.round((completedForDay / total) * 100) }
  })

  const weekly = getMonthWeeks(month).map((week) => {
    const completedForWeek = countCompleted(logKeys, habitIds, week)
    const total = activeHabits.length * week.length
    return { label: `${week[0]?.getDate()}-${week[week.length - 1]?.getDate()}`, startDay: week[0]?.getDate() ?? 0, endDay: week[week.length - 1]?.getDate() ?? 0, completed: completedForWeek, total, percentage: total === 0 ? 0 : Math.round((completedForWeek / total) * 100) }
  })

  const leaderboard = activeHabits.map((habit) => {
    const completedForHabit = countCompleted(logKeys, [habit.id], days)
    return { habit, completed: completedForHabit, remaining: Math.max(habit.monthlyTarget - completedForHabit, 0), percentage: habit.monthlyTarget === 0 ? 0 : Math.min(100, Math.round((completedForHabit / habit.monthlyTarget) * 100)) }
  }).sort((a, b) => b.percentage - a.percentage || b.completed - a.completed)

  return { completed, goal, remaining: Math.max(goal - completed, 0), percentage: goal === 0 ? 0 : Math.min(100, Math.round((completed / goal) * 100)), daily, weekly, leaderboard }
}