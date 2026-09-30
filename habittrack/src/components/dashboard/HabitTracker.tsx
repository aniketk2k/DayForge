import { format } from 'date-fns'
import { Check } from 'lucide-react'
import { useAppData } from '../../hooks/useAppData'
import { dateKey, getMonthWeeks } from '../../utils/dateUtils'

export function HabitTracker({ month }: { month: Date }) {
  const { data, toggleHabitLog } = useAppData()
  const habits = data.habits.filter((habit) => habit.active).sort((a, b) => a.order - b.order)
  const weeks = getMonthWeeks(month)
  const days = weeks.flat()

  return (
    <section className="mt-6 overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--panel)] shadow-[var(--shadow)]">
      <div className="flex flex-col gap-3 border-b border-[var(--border)] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--accent)]">Daily rhythm</p>
          <h2 className="mt-1 text-xl font-semibold text-[var(--text-strong)]">Habit tracker</h2>
        </div>
        <p className="text-xs text-[var(--text-muted)]">Click a day to mark a habit complete</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[940px] border-collapse text-left">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--panel-soft)] text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--text-faint)]">
              <th className="sticky left-0 z-20 min-w-52 border-r border-[var(--border)] bg-[var(--panel-soft)] px-5 py-3" rowSpan={2}>Habit</th>
              {weeks.map((week, index) => <th className="border-r border-[var(--border)] px-2 py-2 text-center" colSpan={week.length} key={`week-${index}`}>Week {index + 1}</th>)}
            </tr>
            <tr className="border-b border-[var(--border)] bg-[var(--panel-soft)] text-center text-[11px] font-semibold text-[var(--text-muted)]">
              {days.map((day) => <th className="min-w-9 px-1 py-2" key={dateKey(day)}><span className="block text-[var(--text-strong)]">{format(day, 'd')}</span><span className="mt-0.5 block text-[9px] uppercase text-[var(--text-faint)]">{format(day, 'EEEEE')}</span></th>)}
            </tr>
          </thead>
          <tbody>
            {habits.map((habit) => (
              <tr className="border-b border-[var(--border)] last:border-b-0" key={habit.id}>
                <th className="sticky left-0 z-10 border-r border-[var(--border)] bg-[var(--panel)] px-5 py-3 text-left" scope="row">
                  <div className="flex items-center gap-3">
                    <span className="text-lg" aria-hidden="true">{habit.icon}</span>
                    <span className="min-w-0"><span className="block truncate text-sm font-semibold text-[var(--text-strong)]">{habit.name}</span><span className="mt-0.5 block text-[11px] text-[var(--text-muted)]">Goal {habit.monthlyTarget} days</span></span>
                  </div>
                </th>
                {days.map((day) => {
                  const dayKey = dateKey(day)
                  const completed = data.habitLogs.some((log) => log.habitId === habit.id && log.date === dayKey && log.completed)
                  return <td className="px-1 py-3 text-center" key={dayKey}><button className={`habit-cell ${completed ? 'habit-cell-complete' : ''}`} style={completed ? { backgroundColor: habit.color, borderColor: habit.color } : {}} type="button" onClick={() => toggleHabitLog(habit.id, dayKey)} aria-label={`${habit.name}, ${format(day, 'MMMM d, yyyy')}, ${completed ? 'completed' : 'not completed'}`} aria-pressed={completed}>{completed ? <Check size={14} strokeWidth={3} /> : null}</button></td>
                })}
              </tr>
            ))}
          </tbody>
        </table>
        {habits.length === 0 ? <div className="p-10 text-center text-sm text-[var(--text-muted)]">No active habits yet. Add your first habit from the Habits page.</div> : null}
      </div>
    </section>
  )
}