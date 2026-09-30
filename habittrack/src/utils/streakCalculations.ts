import type { HabitLog } from '../types/app'

export type HabitStreaks = {
  current: number
  longest: number
}

export function calculateHabitStreaks(habitId: string, logs: HabitLog[]): HabitStreaks {
  const dates = [...new Set(logs.filter((log) => log.habitId === habitId && log.completed).map((log) => log.date))].sort()
  if (dates.length === 0) return { current: 0, longest: 0 }

  let longest = 1
  let run = 1
  for (let index = 1; index < dates.length; index += 1) {
    const previous = new Date(`${dates[index - 1]}T12:00:00`)
    const current = new Date(`${dates[index]}T12:00:00`)
    const difference = Math.round((current.getTime() - previous.getTime()) / 86_400_000)
    run = difference === 1 ? run + 1 : 1
    longest = Math.max(longest, run)
  }

  let current = 1
  for (let index = dates.length - 1; index > 0; index -= 1) {
    const previous = new Date(`${dates[index - 1]}T12:00:00`)
    const latest = new Date(`${dates[index]}T12:00:00`)
    const difference = Math.round((latest.getTime() - previous.getTime()) / 86_400_000)
    if (difference !== 1) break
    current += 1
  }

  return { current, longest }
}