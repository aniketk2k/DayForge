// @vitest-environment jsdom

import { fireEvent, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { describe, expect, it, beforeEach } from 'vitest'
import { ConfirmDialog } from '../components/common/ConfirmDialog'
import { HabitTracker } from '../components/dashboard/HabitTracker'
import { AppDataProvider } from '../context/AppDataProvider'
import { ToastProvider } from '../context/ToastProvider'
import { HabitManagement } from '../components/habits/HabitManagement'
import { ExpenseManagement } from '../components/expenses/ExpenseManagement'
import { useAppData } from '../hooks/useAppData'

function DataHarness() {
  const { data, addHabit, deleteHabit, toggleHabitLog } = useAppData()
  const firstHabit = data.habits[0]
  return <div><output data-testid="habit-count">{data.habits.length}</output><output data-testid="log-state">{data.habitLogs.find((log) => log.habitId === firstHabit?.id && log.date === '2026-09-01')?.completed ? 'complete' : 'incomplete'}</output><button type="button" onClick={() => addHabit({ name: 'Test habit', icon: '🧪', color: '#fff', monthlyTarget: 5, description: '' })}>add</button><button type="button" onClick={() => firstHabit && deleteHabit(firstHabit.id)}>delete</button><button type="button" onClick={() => firstHabit && toggleHabitLog(firstHabit.id, '2026-09-01')}>toggle</button></div>
}

describe('component smoke tests', () => {
  beforeEach(() => localStorage.clear())

  it('confirms an action through the accessible dialog', () => {
    const onConfirm = () => undefined
    render(<ConfirmDialog title="Delete habit?" message="This cannot be undone." onCancel={() => undefined} onConfirm={onConfirm} />)
    expect(screen.getByRole('alertdialog', { name: 'Delete habit?' })).toBeInTheDocument()
    expect(screen.getByText('This cannot be undone.')).toBeInTheDocument()
  })

  it('toggles a habit cell through the persisted data provider', () => {
    render(<AppDataProvider><HabitTracker month={new Date(2026, 8, 1)} /></AppDataProvider>)
    const cell = screen.getByRole('button', { name: 'Wake up at 5:00 AM, September 1, 2026, completed' })
    expect(cell).toHaveAttribute('aria-pressed', 'true')
    fireEvent.click(cell)
    expect(screen.getByRole('button', { name: 'Wake up at 5:00 AM, September 1, 2026, not completed' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('persists habit CRUD mutations and raw completion state', () => {
    render(<AppDataProvider><DataHarness /></AppDataProvider>)
    expect(screen.getByTestId('habit-count')).toHaveTextContent('14')
    fireEvent.click(screen.getByRole('button', { name: 'add' }))
    expect(screen.getByTestId('habit-count')).toHaveTextContent('15')
    fireEvent.click(screen.getByRole('button', { name: 'toggle' }))
    expect(screen.getByTestId('log-state')).toHaveTextContent('incomplete')
    fireEvent.click(screen.getByRole('button', { name: 'delete' }))
    expect(screen.getByTestId('habit-count')).toHaveTextContent('14')
    expect(JSON.parse(localStorage.getItem('habittrack-data') ?? '{}').habits).toHaveLength(14)
  })

  it('creates a habit through the management form', () => {
    render(<ToastProvider><AppDataProvider><HabitManagement month={new Date(2026, 8, 1)} /></AppDataProvider></ToastProvider>)
    fireEvent.click(screen.getByRole('button', { name: 'Add habit' }))
    fireEvent.change(screen.getByLabelText('Habit name'), { target: { value: 'Evening walk' } })
    fireEvent.click(screen.getByRole('button', { name: 'Create habit' }))
    expect(screen.getByText('Evening walk')).toBeInTheDocument()
  })

  it('filters expenses by search text and category', () => {
    render(<ToastProvider><AppDataProvider><ExpenseManagement month={new Date(2026, 8, 1)} /></AppDataProvider></ToastProvider>)
    expect(screen.getByText('Dinner')).toBeInTheDocument()
    fireEvent.change(screen.getByLabelText('Search expense descriptions'), { target: { value: 'Dinner' } })
    expect(screen.getByText('Dinner')).toBeInTheDocument()
    expect(screen.queryByText('Breakfast and coffee')).not.toBeInTheDocument()
    fireEvent.change(screen.getByLabelText('Filter expenses by category'), { target: { value: 'Travel' } })
    expect(screen.queryByText('Dinner')).not.toBeInTheDocument()
  })
})