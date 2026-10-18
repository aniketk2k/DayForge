import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import { ChevronRight, CircleDollarSign, Plus, Receipt, Wallet } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useAppData } from '../../hooks/useAppData'
import { useToast } from '../../hooks/useToast'
import { dateKey } from '../../utils/dateUtils'
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

export function ExpenseCharts({ month }: { month: Date }) {
  const { data } = useAppData()
  const analytics = calculateExpenseAnalytics(data.expenses, month)

  return (
    <div className="grid gap-4 xl:grid-cols-[1.3fr_1fr]">
      <section className="card min-w-0 p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-lg bg-blue-500/15 text-blue-500">
            <CircleDollarSign size={18} />
          </span>
          <h2 className="text-base font-bold text-[var(--text-strong)]">Daily Expenses ({format(month, 'MMMM yyyy')})</h2>
        </div>
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
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-lg bg-violet-500/15 text-violet-500">
            <Receipt size={18} />
          </span>
          <h2 className="text-base font-bold text-[var(--text-strong)]">Weekly Expense Summary</h2>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
          {analytics.weekly.map((week, index) => (
            <div className={`rounded-lg border p-2.5 text-center ${weekTones[index % weekTones.length]}`} key={week.label}>
              <p className="text-[11px] font-medium text-[var(--text-strong)]">Week {index + 1}</p>
              <p className="mt-1.5 text-sm font-bold text-[var(--text-strong)]">{formatINR(week.amount)}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export function TodayExpenseCard() {
  const { addExpense } = useAppData()
  const { showToast } = useToast()
  const [amount, setAmount] = useState<number | ''>('')
  const [category, setCategory] = useState<string>('Food')
  const [description, setDescription] = useState<string>('')

  const [todayDate] = useState(() => new Date())
  const todayStr = useMemo(() => format(todayDate, 'EEE, d MMM yyyy'), [todayDate])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const num = Number(amount)
    if (!num || num <= 0) {
      showToast('Please enter a valid amount', 'error')
      return
    }
    addExpense({
      amount: num,
      category,
      description: description.trim() || category,
      date: dateKey(todayDate),
    })
    setAmount('')
    setDescription('')
    showToast('Expense added successfully!')
  }

  return (
    <div className="card p-4 sm:p-5">
      <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
        <div className="flex items-center gap-2.5">
          <span className="flex size-7 items-center justify-center rounded-lg bg-rose-500/15 text-rose-400">
            <Receipt size={15} />
          </span>
          <h2 className="text-sm font-bold text-[var(--text-strong)]">Today's Expense</h2>
        </div>
        <span className="text-xs text-[var(--text-muted)]">{todayStr}</span>
      </div>

      <form onSubmit={handleSubmit} className="mt-3.5 space-y-3">
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="block text-[11px] font-medium text-[var(--text-muted)] mb-1">Amount (₹)</label>
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-[var(--text-muted)]">₹</span>
              <input
                type="number"
                min="1"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--panel-soft)] py-1.5 pl-6 pr-2 text-xs font-semibold text-[var(--text-strong)] outline-none focus:border-[var(--accent)]"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-medium text-[var(--text-muted)] mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--panel-soft)] py-1.5 px-2 text-xs font-medium text-[var(--text-strong)] outline-none focus:border-[var(--accent)]"
            >
              <option value="Food">🍕 Food</option>
              <option value="Travel">🚗 Travel</option>
              <option value="Shopping">🛍️ Shopping</option>
              <option value="Bills">💡 Bills</option>
              <option value="Entertainment">🍿 Entertainment</option>
              <option value="Health">🏥 Health</option>
              <option value="Education">📚 Education</option>
              <option value="Other">✨ Other</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-medium text-[var(--text-muted)] mb-1">Description (optional)</label>
          <input
            type="text"
            placeholder="e.g., Dinner, Groceries, Cab"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--panel-soft)] py-1.5 px-2.5 text-xs text-[var(--text-strong)] outline-none placeholder:text-[var(--text-faint)] focus:border-[var(--accent)]"
          />
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 py-2 text-xs font-bold text-white transition shadow-sm active:scale-[0.99]"
        >
          <Plus size={14} strokeWidth={2.5} />
          <span>Add Expense</span>
        </button>
      </form>
    </div>
  )
}

export function TodaySummaryCard() {
  const { data } = useAppData()
  const [todayDate] = useState(() => new Date())
  const todayKey = useMemo(() => dateKey(todayDate), [todayDate])

  const todayExpenses = useMemo(() => {
    return data.expenses.filter((e) => e.date === todayKey)
  }, [data.expenses, todayKey])

  const total = useMemo(() => {
    return todayExpenses.reduce((sum, e) => sum + e.amount, 0)
  }, [todayExpenses])

  const count = todayExpenses.length

  return (
    <NavLink
      to="/expenses"
      className="card flex items-center gap-3 p-3.5 transition hover:border-[var(--accent)] group"
    >
      <span className="flex size-9 items-center justify-center rounded-lg bg-blue-500/15 text-blue-400 shrink-0">
        <Receipt size={17} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-[var(--text-muted)]">Today's Summary</p>
        <p className="text-lg font-bold text-[var(--text-strong)] leading-tight">{formatINR(total)}</p>
        <p className="text-[11px] text-[var(--text-muted)]">{count} expense{count === 1 ? '' : 's'}</p>
      </div>
      <ChevronRight size={16} className="text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-transform group-hover:translate-x-0.5" />
    </NavLink>
  )
}

export function TotalExpensesCard({ month }: { month: Date }) {
  const { data } = useAppData()
  const analytics = calculateExpenseAnalytics(data.expenses, month)

  return (
    <section className="card flex flex-col p-4 sm:p-5">
      <div className="flex items-center gap-3">
        <span className="flex size-9 items-center justify-center rounded-lg bg-violet-500/15 text-violet-500">
          <Wallet size={18} />
        </span>
        <h2 className="text-base font-bold text-[var(--text-strong)]">Total Expenses</h2>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center py-4 text-center">
        <p className="text-3xl font-bold text-[var(--text-strong)]">{formatINR(analytics.total)}</p>
        <p className="mt-1.5 text-xs text-[var(--text-muted)]">in {format(month, 'MMMM yyyy')}</p>
      </div>
    </section>
  )
}

export function ExpenseOverview({ month }: { month: Date }) {
  return (
    <div className="space-y-4">
      <ExpenseCharts month={month} />
    </div>
  )
}