import { Flame, Medal, TrendingDown, TrendingUp } from 'lucide-react'
import type { ReactNode } from 'react'
import { useAppData } from '../../hooks/useAppData'
import { calculateExpenseAnalytics, formatINR } from '../../utils/expenseCalculations'
import { calculateHabitAnalytics } from '../../utils/habitCalculations'
import { calculateHabitStreaks } from '../../utils/streakCalculations'

export function AnalyticsInsights({ month }: { month: Date }) {
  const { data } = useAppData()
  const habitAnalytics = calculateHabitAnalytics(data.habits, data.habitLogs, month)
  const expenseAnalytics = calculateExpenseAnalytics(data.expenses, month)
  const streaks = data.habits
    .filter((habit) => habit.active)
    .map((habit) => ({ habit, streak: calculateHabitStreaks(habit.id, data.habitLogs) }))
    .sort((a, b) => b.streak.longest - a.streak.longest)
  const highestDay = expenseAnalytics.daily.reduce((highest, day) => day.amount > highest.amount ? day : highest, { day: 0, date: '', amount: 0 })
  const bestHabit = habitAnalytics.leaderboard[0]
  const worstHabit = habitAnalytics.leaderboard.at(-1)

  return (
    <div className="mt-6 space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <InsightCard label="Longest streak" value={`${streaks[0]?.streak.longest ?? 0} days`} detail={streaks[0]?.habit.name ?? 'No active habits'} icon={<Flame className="text-orange-400" size={18} />} />
        <InsightCard label="Best habit" value={`${bestHabit?.percentage ?? 0}%`} detail={bestHabit?.habit.name ?? 'No active habits'} icon={<TrendingUp className="text-emerald-400" size={18} />} />
        <InsightCard label="Needs attention" value={`${worstHabit?.percentage ?? 0}%`} detail={worstHabit?.habit.name ?? 'No active habits'} icon={<TrendingDown className="text-rose-400" size={18} />} />
        <InsightCard label="Highest spend" value={formatINR(highestDay.amount)} detail={highestDay.day ? `September ${highestDay.day}` : 'No expenses'} icon={<Medal className="text-amber-400" size={18} />} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-3xl border border-[var(--border)] bg-[var(--panel)] p-5 shadow-[var(--shadow)] sm:p-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-orange-400">Consistency</p>
          <h2 className="mt-1 text-lg font-semibold text-[var(--text-strong)]">Habit streaks</h2>
          <div className="mt-4 divide-y divide-[var(--border)]">
            {streaks.map(({ habit, streak }) => (
              <div className="flex items-center gap-3 py-3" key={habit.id}>
                <span className="text-lg" aria-hidden="true">{habit.icon}</span>
                <span className="min-w-0 flex-1 truncate text-sm font-semibold text-[var(--text-strong)]">{habit.name}</span>
                <span className="text-xs text-[var(--text-muted)]">Current <strong className="text-[var(--text-strong)]">{streak.current}d</strong></span>
                <span className="text-xs text-orange-400">Best <strong>{streak.longest}d</strong></span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-[var(--border)] bg-[var(--panel)] p-5 shadow-[var(--shadow)] sm:p-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-400">Spending insights</p>
          <h2 className="mt-1 text-lg font-semibold text-[var(--text-strong)]">Where your money goes</h2>
          <div className="mt-4 space-y-3">
            {expenseAnalytics.categories.map((item) => (
              <div key={item.category}>
                <div className="flex items-center justify-between text-sm"><span className="font-semibold text-[var(--text-strong)]">{item.category}</span><span className="text-[var(--text-muted)]">{formatINR(item.amount)}</span></div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--track)]"><div className="h-full rounded-full bg-emerald-400" style={{ width: `${expenseAnalytics.total ? (item.amount / expenseAnalytics.total) * 100 : 0}%` }} /></div>
              </div>
            ))}
            {expenseAnalytics.categories.length === 0 ? <p className="text-sm text-[var(--text-muted)]">No spending recorded for this month.</p> : null}
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3 border-t border-[var(--border)] pt-4"><div><p className="text-xs text-[var(--text-muted)]">Monthly total</p><p className="mt-1 text-lg font-semibold text-[var(--text-strong)]">{formatINR(expenseAnalytics.total)}</p></div><div><p className="text-xs text-[var(--text-muted)]">Daily average</p><p className="mt-1 text-lg font-semibold text-[var(--text-strong)]">{formatINR(expenseAnalytics.daily.length ? expenseAnalytics.total / expenseAnalytics.daily.length : 0)}</p></div></div>
        </section>
      </div>
    </div>
  )
}

function InsightCard({ label, value, detail, icon }: { label: string; value: string; detail: string; icon: ReactNode }) {
  return <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel-soft)] p-5"><div className="flex items-center justify-between"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-faint)]">{label}</p>{icon}</div><p className="mt-4 text-2xl font-semibold text-[var(--text-strong)]">{value}</p><p className="mt-1 text-xs text-[var(--text-muted)]">{detail}</p></div>
}