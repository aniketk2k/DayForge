import { describe, expect, it } from 'vitest'
import { calculateCountdown } from '../hooks/useUserTargets'

describe('target countdown calculations', () => {
  const referenceToday = new Date(2026, 9, 18) // 18 Oct 2026

  it('calculates days remaining for a future date', () => {
    const result = calculateCountdown('2026-10-28', referenceToday)
    expect(result.days).toBe(10)
    expect(result.label).toBe('10 days left')
    expect(result.isPast).toBe(false)
    expect(result.isToday).toBe(false)
  })

  it('handles single day remaining properly', () => {
    const result = calculateCountdown('2026-10-19', referenceToday)
    expect(result.days).toBe(1)
    expect(result.label).toBe('1 day left')
    expect(result.isPast).toBe(false)
    expect(result.isToday).toBe(false)
  })

  it('detects when the target date is today', () => {
    const result = calculateCountdown('2026-10-18', referenceToday)
    expect(result.days).toBe(0)
    expect(result.label).toBe('Today!')
    expect(result.isToday).toBe(true)
    expect(result.isPast).toBe(false)
  })

  it('handles past target dates gracefully', () => {
    const result = calculateCountdown('2026-10-10', referenceToday)
    expect(result.days).toBe(-8)
    expect(result.label).toBe('8 days ago')
    expect(result.isPast).toBe(true)
    expect(result.isToday).toBe(false)
  })

  it('handles invalid date strings without crashing', () => {
    const result = calculateCountdown('invalid-date', referenceToday)
    expect(result.days).toBe(0)
    expect(result.label).toBe('Invalid Date')
  })
})
