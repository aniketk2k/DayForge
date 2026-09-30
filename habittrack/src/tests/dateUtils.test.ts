import { describe, expect, it } from 'vitest'
import { getMonthDays, getMonthWeeks } from '../utils/dateUtils'

describe('calendar utilities', () => {
  it('generates the correct number of days for regular, short, and leap months', () => {
    expect(getMonthDays(new Date(2026, 8, 1))).toHaveLength(30)
    expect(getMonthDays(new Date(2027, 1, 1))).toHaveLength(28)
    expect(getMonthDays(new Date(2028, 1, 1))).toHaveLength(29)
    expect(getMonthDays(new Date(2026, 11, 1))).toHaveLength(31)
  })

  it('groups September 2026 into a partial first week and four full weeks', () => {
    const weeks = getMonthWeeks(new Date(2026, 8, 1))
    expect(weeks.map((week) => week.length)).toEqual([6, 7, 7, 7, 3])
    expect(weeks[0]?.[0].getDate()).toBe(1)
    expect(weeks[4]?.[2].getDate()).toBe(30)
  })
})