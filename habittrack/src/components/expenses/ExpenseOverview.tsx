import { format } from 'date-fns'
import { CircleDollarSign, Receipt, Wallet } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useAppData } from '../../hooks/useAppData'
import { calculateExpenseAnalytics, formatINR } from '../../utils/expenseCalculations'

const chartTooltipStyle = { background: '#102238', border: '1px solid #2b4662', borderRadius: 12, color: '#f8fafc' }
const axisTick = { fill: 'var(--text-muted)', fontSize: 10 }
const weekTones = [
  'bg-violet-500/15 text-violet-500 border-violet-500/30',
  'bg-orange-500/15 text-orange-500 border-orange-500/30',
  'bg-emerald-500/15 text-emerald-500 border-emerald-500/30',
  'bg-sky-500/15 text-sky-500 border-sky-500/30',
  'bg-blue-500/15 text-blue-500 border-blue-500/30',
]

export function ExpenseOverview({ month }: { month: Date }) {
  const { data } = useAppData()
  const analytics = calculateExpenseAnalytics(data.expenses, month)

  return (
    <div className="mt-4 grid gap-4 xl:grid-cols-[1.45fr_1.2fr_0.6fr]">
      <section className="card min-w-0 p-4 sm:p-5">
        <div className="flex items-center gap-3"><span className="flex size-9 items-center justify-center rounded-lg bg-blue-500/15 text-blue-500"><CircleDollarSign size={18} /></span><h2 className="text-base font-bold text-[var(--text-strong)]">Daily Expenses ({format(month, 'MMMM yyyy')})</h2></div>
        <div className="mt-3 h-44">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analytics.daily} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis dataKey="day" tick={axisTick} tickLine={false} axisLine={false} interval={0} />
              <YAxis tick={axisTick} tickLine={false} axisLine={false} width={45} tickCount={3} />
              <Tooltip contentStyle={chartTooltipStyle} formatter={(value) => [formatINR(Number(value)), 'Spent']} labelFormatter={(label) => `${format(month, 'MMMM')} ${label}`} />
              <Bar dataKey="amount" fill="#7c5cf0" radius={[2, 2, 0, 0]} maxBarSize={9} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
      <section className="card p-4 sm:p-5">
        <div className="flex items-center gap-3"><span className="flex size-9 items-center justify-center rounded-lg bg-violet-500/15 text-violet-500"><Receipt size={18} /></span><h2 className="text-base font-bold text-[var(--text-strong)]">Weekly Expense Summary</h2></div>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
          {analytics.weekly.map((week, index) => (
            <div className={`rounded-lg border p-3 text-center ${weekTones[index % weekTones.length]}`} key={week.label}>
              <p className="text-xs">Week {index + 1}</p>
              <p className="mt-2 text-lg font-bold text-[var(--text-strong)]">{formatINR(week.amount)}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="card flex flex-col p-4 sm:p-5">
        <div className="flex items-center gap-3"><span className="flex size-9 items-center justify-center rounded-lg bg-violet-500/15 text-violet-500"><Wallet size={18} /></span><h2 className="text-base font-bold text-[var(--text-strong)]">Total Expenses</h2></div>
        <div className="flex flex-1 flex-col items-center justify-center py-3 text-center">
          <p className="text-4xl font-bold text-[var(--text-strong)]">{formatINR(analytics.total)}</p>
          <p className="mt-2 text-sm text-[var(--text-muted)]">in {format(month, 'MMMM yyyy')}</p>
        </div>
      </section>
    </div>
  )
}