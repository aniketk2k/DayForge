import { useState, type ReactNode } from 'react'
import { format } from 'date-fns'
import { BarChart3, CheckCircle2, ChevronDown, Hourglass, LineChart, Pencil, Percent, Target } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useAppData } from '../../hooks/useAppData'
import { useToast } from '../../hooks/useToast'
import { calculateCountdown, useUserTargets, type UserTarget } from '../../hooks/useUserTargets'
import { calculateHabitAnalytics, type HabitAnalytics as HabitAnalyticsData, type HabitRanking } from '../../utils/habitCalculations'
import { TargetModal } from './TargetModal'

type SortMode = 'percentage' | 'completed' | 'remaining' | 'goal'
type AnalyticsSection = 'all' | 'kpis' | 'charts' | 'side'
const chartTooltipStyle = { background: '#102238', border: '1px solid #2b4662', borderRadius: 12, color: '#f8fafc' }
const axisTick = { fill: 'var(--text-muted)', fontSize: 10 }

export function HabitAnalytics({ month, section = 'all' }: { month: Date; section?: AnalyticsSection }) {
  const { data } = useAppData()
  const analytics = calculateHabitAnalytics(data.habits, data.habitLogs, month)
  const showKpis = section === 'all' || section === 'kpis'
  const showCharts = section === 'all' || section === 'charts'
  const showSide = section === 'all' || section === 'side'
  return <div className={section === 'all' ? 'mt-4 space-y-4' : 'space-y-4'}>{showKpis ? <KpiCards analytics={analytics} /> : null}{showCharts ? <ChartSections analytics={analytics} month={month} /> : null}{showSide ? <SideSections analytics={analytics} /> : null}</div>
}

function KpiCards({ analytics }: { analytics: HabitAnalyticsData }) {
  const { target1, target2, updateTarget } = useUserTargets()
  const { showToast } = useToast()
  const [editingTarget, setEditingTarget] = useState<UserTarget | null>(null)

  const countdown1 = calculateCountdown(target1.targetDate)
  const countdown2 = calculateCountdown(target2.targetDate)

  const handleSaveTarget = (targetId: string, updates: { title: string; targetDate: string }) => {
    updateTarget(targetId, updates)
    showToast(`"${updates.title}" target updated!`, 'success')
  }

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {/* Card 1: Completed Habits */}
        <div className="card flex items-center gap-4 p-4">
          <span className="tile-icon bg-emerald-500/15 text-emerald-400">
            <CheckCircle2 size={26} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <p className="text-xs text-[var(--text-muted)]">Completed</p>
              <strong className="text-sm font-bold text-emerald-400">{analytics.percentage}%</strong>
            </div>
            <p className="mt-0.5 text-3xl font-bold leading-tight text-[var(--text-strong)]">{analytics.completed}</p>
            <div className="mt-1 flex items-end justify-between text-xs text-[var(--text-muted)]">
              <span>of {analytics.goal} target days</span>
              <span className="text-[11px] text-[var(--text-muted)]">{analytics.remaining} left</span>
            </div>
          </div>
        </div>

        {/* Card 2: User Target 1 (Countdown) */}
        <div
          className="card group flex items-center gap-4 p-4 cursor-pointer transition-all hover:border-blue-500/40 hover:shadow-lg"
          onClick={() => setEditingTarget(target1)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              setEditingTarget(target1)
            }
          }}
          title={`Click to edit ${target1.title} and target date`}
        >
          <span className="tile-icon bg-blue-500/15 text-blue-400">
            <Target size={26} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-[var(--text-muted)] truncate group-hover:text-blue-400 transition-colors">
                {target1.title}
              </p>
              <span className="rounded p-1 text-[var(--text-muted)] group-hover:bg-blue-500/20 group-hover:text-blue-400 transition">
                <Pencil size={11} />
              </span>
            </div>
            <div className="mt-0.5 flex items-baseline gap-1.5">
              <span className="text-3xl font-bold leading-tight text-[var(--text-strong)]">
                {countdown1.isToday ? 'Today!' : countdown1.isPast ? `${Math.abs(countdown1.days)}d` : countdown1.days}
              </span>
              <span className="text-xs font-semibold text-[var(--text-muted)]">
                {countdown1.isToday ? '🎯' : countdown1.isPast ? 'ago' : countdown1.days === 1 ? 'day left' : 'days left'}
              </span>
            </div>
            <div className="mt-1 flex items-center justify-between text-xs text-[var(--text-muted)]">
              <span className="truncate">Target: {countdown1.formattedDate}</span>
              <span className="text-[10px] font-semibold text-blue-400 group-hover:underline">Edit</span>
            </div>
          </div>
        </div>

        {/* Card 3: User Target 2 (Countdown) */}
        <div
          className="card group flex items-center gap-4 p-4 cursor-pointer transition-all hover:border-orange-500/40 hover:shadow-lg"
          onClick={() => setEditingTarget(target2)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              setEditingTarget(target2)
            }
          }}
          title={`Click to edit ${target2.title} and target date`}
        >
          <span className="tile-icon bg-orange-500/15 text-orange-400">
            <Hourglass size={26} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-[var(--text-muted)] truncate group-hover:text-orange-400 transition-colors">
                {target2.title}
              </p>
              <span className="rounded p-1 text-[var(--text-muted)] group-hover:bg-orange-500/20 group-hover:text-orange-400 transition">
                <Pencil size={11} />
              </span>
            </div>
            <div className="mt-0.5 flex items-baseline gap-1.5">
              <span className="text-3xl font-bold leading-tight text-[var(--text-strong)]">
                {countdown2.isToday ? 'Today!' : countdown2.isPast ? `${Math.abs(countdown2.days)}d` : countdown2.days}
              </span>
              <span className="text-xs font-semibold text-[var(--text-muted)]">
                {countdown2.isToday ? '🎯' : countdown2.isPast ? 'ago' : countdown2.days === 1 ? 'day left' : 'days left'}
              </span>
            </div>
            <div className="mt-1 flex items-center justify-between text-xs text-[var(--text-muted)]">
              <span className="truncate">Target: {countdown2.formattedDate}</span>
              <span className="text-[10px] font-semibold text-orange-400 group-hover:underline">Edit</span>
            </div>
          </div>
        </div>

        {/* Card 4: Overall Progress */}
        <div className="card flex items-center gap-4 p-4">
          <span className="tile-icon bg-violet-500/15 text-violet-500">
            <Percent size={26} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-[var(--text-muted)]">Overall Progress</p>
            <p className="mt-0.5 text-3xl font-bold leading-tight text-[var(--text-strong)]">{analytics.percentage}%</p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--track)]">
              <div
                className="h-full rounded-full bg-violet-500 transition-all duration-300"
                style={{ width: `${analytics.percentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {editingTarget ? (
        <TargetModal
          target={editingTarget}
          onClose={() => setEditingTarget(null)}
          onSave={handleSaveTarget}
        />
      ) : null}
    </>
  )
}

function ChartSections({ analytics, month }: { analytics: HabitAnalyticsData; month: Date }) {
  return (
    <div className="grid gap-4 xl:grid-cols-[1.3fr_1fr]">
      <Panel icon={<BarChart3 size={18} />} iconClass="bg-emerald-500/15 text-emerald-400" title={`Daily Progress (${format(month, 'MMMM yyyy')})`}>
        <div className="mt-3 h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analytics.daily} margin={{ top: 5, right: 5, bottom: 0, left: -18 }}>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis dataKey="day" tick={axisTick} tickLine={false} axisLine={false} interval={0} />
              <YAxis domain={[0, (max: number) => Math.max(60, Math.ceil(max / 20) * 20)]} tickCount={4} tickFormatter={(value) => `${value}%`} tick={axisTick} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={chartTooltipStyle} formatter={(value) => [`${value}%`, 'Progress']} labelFormatter={(label) => `${format(month, 'MMMM')} ${label}`} />
              <Bar dataKey="percentage" fill="#2f7cf6" radius={[2, 2, 0, 0]} maxBarSize={9} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Panel>
      <Panel icon={<LineChart size={18} />} iconClass="bg-violet-500/15 text-violet-400" title="Weekly Progress">
        <WeeklyCards analytics={analytics} />
      </Panel>
    </div>
  )
}

function WeeklyCards({ analytics }: { analytics: HabitAnalyticsData }) {
  return (
    <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl border border-[var(--border)] bg-[var(--panel-soft)] p-2 sm:grid-cols-5">
      {analytics.weekly.map((week, index) => (
        <div className="p-2 text-center" key={week.label}>
          <p className="text-xs font-medium text-[var(--text-strong)]">Week {index + 1}</p>
          <p className="mt-1 text-[10px] text-[var(--text-muted)]">{week.startDay} - {week.endDay}</p>
          <p className="mt-3 text-sm font-bold text-[var(--text-strong)]">{week.completed} / {week.total}</p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--track)]"><div className="h-full rounded-full bg-emerald-400" style={{ width: `${week.percentage}%` }} /></div>
          <p className="mt-1.5 text-[11px] text-[var(--text-muted)]">{week.percentage}%</p>
        </div>
      ))}
    </div>
  )
}

function SideSections({ analytics }: { analytics: HabitAnalyticsData }) {
  const legend = [
    { label: 'Completed', value: analytics.completed, color: '#19c98b' },
    { label: 'Left', value: analytics.remaining, color: '#5b6f88' },
    { label: 'Goal', value: analytics.goal, color: 'transparent' },
  ]
  return (
    <div className="space-y-4">
      <section className="card p-5"><Leaderboard items={analytics.leaderboard} /></section>
      <section className="card p-5">
        <h2 className="text-lg font-bold text-[var(--text-strong)]">Overall Habit Progress</h2>
        <div className="mt-3 flex items-center gap-4">
          <div className="relative h-40 w-40 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={[{ name: 'Completed', value: analytics.percentage }, { name: 'Left', value: 100 - analytics.percentage }]} dataKey="value" innerRadius={52} outerRadius={68} paddingAngle={2} startAngle={90} endAngle={-270} stroke="none">
                  <Cell fill="#19c98b" /><Cell fill="var(--track)" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"><span className="text-2xl font-bold text-[var(--text-strong)]">{analytics.percentage}%</span><span className="text-xs text-[var(--text-muted)]">Completed</span></div>
          </div>
          <ul className="flex-1 space-y-3 text-xs text-[var(--text-muted)]">
            {legend.map((item) => (
              <li className="flex items-center gap-2" key={item.label}><span className="size-2.5 rounded-full" style={{ background: item.color, border: item.color === 'transparent' ? '1px solid var(--border-strong)' : 'none' }} /><span>{item.label}</span><strong className="ml-auto text-[var(--text-strong)]">{item.value}</strong></li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}

function Leaderboard({ items }: { items: HabitRanking[] }) {
  const [sortMode, setSortMode] = useState<SortMode>('percentage')
  const sorted = [...items].sort((a, b) => sortMode === 'completed' ? b.completed - a.completed : sortMode === 'remaining' ? a.remaining - b.remaining : sortMode === 'goal' ? b.habit.monthlyTarget - a.habit.monthlyTarget : b.percentage - a.percentage || b.completed - a.completed).slice(0, 10)
  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-[var(--text-strong)]">Top 10 Habits</h2>
        <div className="relative">
          <select className="appearance-none rounded-lg border border-[var(--border-strong)] bg-[var(--panel-soft)] py-1.5 pl-2.5 pr-7 text-xs text-[var(--text-strong)]" value={sortMode} onChange={(event) => setSortMode(event.target.value as SortMode)} aria-label="Sort top habits">
            <option value="percentage">By Completion %</option><option value="completed">Completed days</option><option value="remaining">Remaining</option><option value="goal">Goal</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-2 text-[var(--text-muted)]" size={13} />
        </div>
      </div>
      <div className="mt-3 space-y-2.5">
        {sorted.map((item, index) => (
          <div className="flex items-center gap-2.5" key={item.habit.id}>
            <span className="w-5 text-center text-xs text-[var(--text-muted)]">{index + 1}</span>
            <span className="text-sm" aria-hidden="true">{item.habit.icon}</span>
            <span className="min-w-0 flex-1 truncate text-xs font-medium text-[var(--text-strong)]">{item.habit.name}</span>
            <div className="hidden w-20 overflow-hidden rounded-full bg-[var(--track)] sm:block"><div className="h-2 rounded-full" style={{ width: `${Math.max(item.percentage, 4)}%`, backgroundColor: item.habit.color }} /></div>
            <span className="w-9 text-right text-xs text-[var(--text-strong)]">{item.percentage}%</span>
          </div>
        ))}
      </div>
    </>
  )
}

function Panel({ title, icon, iconClass, children }: { title: string; icon: ReactNode; iconClass: string; children: ReactNode }) {
  return (
    <section className="card p-4 sm:p-5">
      <div className="flex items-center gap-3"><span className={`flex size-9 items-center justify-center rounded-lg ${iconClass}`}>{icon}</span><h2 className="text-base font-bold text-[var(--text-strong)]">{title}</h2></div>
      {children}
    </section>
  )
}