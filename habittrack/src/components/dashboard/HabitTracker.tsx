import { format, isToday } from 'date-fns'
import { Check, ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useAppData } from '../../hooks/useAppData'
import { dateKey, getMonthWeeks } from '../../utils/dateUtils'

export function HabitTracker({ month, onPreviousMonth, onNextMonth, onToday }: { month: Date; onPreviousMonth?: () => void; onNextMonth?: () => void; onToday?: () => void }) {
  const { data, toggleHabitLog } = useAppData()
  const habits = data.habits.filter((habit) => habit.active).sort((a, b) => a.order - b.order)
  const weeks = getMonthWeeks(month)
  const days = weeks.flat()

  return (
    <section className="card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
        <h2 className="text-xl font-bold text-[var(--text-strong)]">Habit Tracker</h2>
        <div className="flex items-center gap-2">
          <NavLink className="btn-primary" to="/habits"><Plus size={14} /> Add Habit</NavLink>
          {onToday ? <button className="box-button !h-9" type="button" onClick={onToday}>Today</button> : null}
          {onPreviousMonth ? <button className="box-button !h-9" type="button" onClick={onPreviousMonth} aria-label="Previous period"><ChevronLeft size={15} /></button> : null}
          {onNextMonth ? <button className="box-button !h-9" type="button" onClick={onNextMonth} aria-label="Next period"><ChevronRight size={15} /></button> : null}
        </div>
      </div>
      <div className="overflow-x-auto px-4 pb-4">
        <table className="matrix w-full min-w-[820px] border-separate border-spacing-0 overflow-hidden rounded-lg text-left">
          <thead>
            <tr className="bg-[var(--panel-soft)] text-xs font-semibold text-[var(--text-strong)]">
              <th className="sticky left-0 z-20 w-6 bg-[var(--panel-soft)] px-1 py-2 text-center" rowSpan={3}>#</th>
              <th className="sticky left-6 z-20 min-w-36 bg-[var(--panel-soft)] px-2 py-2" rowSpan={3}>Habit</th>
              <th className="px-2 py-2 text-center" rowSpan={3}>Goal</th>
              {weeks.map((week, index) => (
                <th className="px-2 py-1.5 text-center font-semibold" colSpan={week.length} key={`week-${index}`}>
                  Week {index + 1}
                  <span className="block text-[10px] font-normal text-[var(--text-muted)]">{week[0].getDate()} - {week[week.length - 1].getDate()}</span>
                </th>
              ))}
              <th className="min-w-24 px-2 py-2 text-center" rowSpan={3}>Progress</th>
              <th className="min-w-20 px-2 py-2 text-center" rowSpan={3}>Completed</th>
            </tr>
            <tr className="bg-[var(--panel-soft)] text-center text-[9px] font-medium text-[var(--text-muted)]">
              {days.map((day) => {
                const isCurrent = isToday(day)
                return (
                  <th className={`px-0 py-1 ${isCurrent ? 'text-[var(--accent)] font-bold' : ''}`} key={`dow-${dateKey(day)}`}>
                    {format(day, 'EEE')}
                  </th>
                )
              })}
            </tr>
            <tr className="bg-[var(--panel-soft)] text-center text-[10px] font-semibold text-[var(--text-strong)]">
              {days.map((day) => {
                const isCurrent = isToday(day)
                return (
                  <th className="min-w-5 px-0 py-1" key={dateKey(day)}>
                    {isCurrent ? (
                      <span className="inline-flex size-5 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--accent-contrast)] text-[10px] font-bold shadow-sm" title="Today">
                        {format(day, 'd')}
                      </span>
                    ) : (
                      format(day, 'd')
                    )}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {habits.map((habit, habitIndex) => {
              const completed = days.filter((day) => data.habitLogs.some((log) => log.habitId === habit.id && log.date === dateKey(day) && log.completed)).length
              const progress = Math.min(100, Math.round((completed / habit.monthlyTarget) * 100))
              return (
                <tr key={habit.id}>
                  <td className="sticky left-0 z-10 bg-[var(--panel)] px-1 py-1.5 text-center text-xs text-[var(--text-muted)]">{habitIndex + 1}</td>
                  <th className="sticky left-6 z-10 bg-[var(--panel)] px-2 py-1.5 text-left" scope="row">
                    <span className="flex items-center gap-2.5 text-xs font-medium text-[var(--text-strong)]">
                      <span className="text-base" aria-hidden="true">{habit.icon}</span>
                      <span className="truncate">{habit.name}</span>
                    </span>
                  </th>
                  <td className="px-2 py-1.5 text-center text-xs text-[var(--text-strong)]">{habit.monthlyTarget}</td>
                  {days.map((day) => {
                    const dayKey = dateKey(day)
                    const isCurrent = isToday(day)
                    const done = data.habitLogs.some((log) => log.habitId === habit.id && log.date === dayKey && log.completed)
                    return (
                      <td className={`px-0 py-1.5 text-center ${isCurrent ? 'today-column' : ''}`} key={dayKey}>
                        <button className={`habit-cell ${done ? 'habit-cell-complete' : ''}`} style={done ? { backgroundColor: habit.color, borderColor: habit.color } : {}} type="button" onClick={() => toggleHabitLog(habit.id, dayKey)} aria-label={`${habit.name}, ${format(day, 'MMMM d, yyyy')}, ${done ? 'completed' : 'not completed'}`} aria-pressed={done}>
                          {done ? <Check size={11} strokeWidth={3.5} /> : null}
                        </button>
                      </td>
                    )
                  })}
                  <td className="px-2 py-1.5">
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--track)]"><div className="h-full rounded-full" style={{ width: `${progress}%`, backgroundColor: habit.color }} /></div>
                      <span className="w-8 text-right text-[10px] text-[var(--text-strong)]">{progress}%</span>
                    </div>
                  </td>
                  <td className="px-2 py-1.5 text-center text-[11px] text-[var(--text-muted)]">{completed}/{habit.monthlyTarget}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {habits.length === 0 ? <div className="p-10 text-center text-sm text-[var(--text-muted)]">No active habits yet. Add your first habit from the Habits page.</div> : null}
      </div>
    </section>
  )
}