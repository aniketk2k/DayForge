import { eachDayOfInterval, endOfMonth, endOfWeek, format, startOfMonth, startOfWeek } from 'date-fns'

export function dateKey(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}

export function getMonthDays(month: Date): Date[] {
  return eachDayOfInterval({ start: startOfMonth(month), end: endOfMonth(month) })
}

export function getMonthWeeks(month: Date): Date[][] {
  const firstDay = startOfMonth(month)
  const lastDay = endOfMonth(month)
  const weeks: Date[][] = []
  let weekStart = startOfWeek(firstDay, { weekStartsOn: 1 })

  while (weekStart <= lastDay) {
    const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 })
    weeks.push(eachDayOfInterval({ start: weekStart < firstDay ? firstDay : weekStart, end: weekEnd > lastDay ? lastDay : weekEnd }))
    weekStart = new Date(weekEnd)
    weekStart.setDate(weekStart.getDate() + 1)
  }

  return weeks
}