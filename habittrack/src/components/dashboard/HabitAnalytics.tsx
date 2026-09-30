import { useState } from 'react'
import type { ReactNode } from 'react'
import { ArrowDown, CheckCircle2, Crown, Gauge, Target } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useAppData } from '../../hooks/useAppData'
import { calculateHabitAnalytics, type HabitRanking } from '../../utils/habitCalculations'

type SortMode = 'percentage' | 'completed' | 'remaining' | 'goal'

const chartTooltipStyle = { background: '#102238', border: '1px solid #2b4662', borderRadius: 12, color: '#f8fafc' }

function Panel({ title, eyebrow, children, className = '' }: { title: string; eyebrow: string; children: ReactNode; className?: string }) {
  return <section className={`rounded-3xl border border-[var(--border)] bg-[var(--panel)] p-5 shadow-[var(--shadow)] sm:p-6 ${className}`}><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--accent)]">{eyebrow}</p><h2 className="mt-1 text-lg font-semibold text-[var(--text-strong)]">{title}</h2>{children}</section>
}

function rankingForSort(items: HabitRanking[], mode: SortMode) {
  return [...items].sort((a, b) => {
    if (mode === 'completed') return b.completed - a.completed
    if (mode === 'remaining') return a.remaining - b.remaining
    if (mode === 'goal') return b.habit.monthlyTarget - a.habit.monthlyTarget
    return b.percentage - a.percentage || b.completed - a.completed
  }).slice(0, 10)
}

export function HabitAnalytics({ month }: { month: Date }) {
  const { data } = useAppData()
  const [sortMode, setSortMode] = useState<SortMode>('percentage')
  const analytics = calculateHabitAnalytics(data.habits, data.habitLogs, month)
  const leaderboard = rankingForSort(analytics.leaderboard, sortMode)
  const left = analytics.remaining

  return <div className="mt-6 space-y-6">
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {[
        { label: 'Completed', value: analytics.completed, detail: `of ${analytics.goal} goal days`, icon: CheckCircle2, tone: 'text-cyan-400' },
        { label: 'Goal', value: analytics.goal, detail: 'total target days', icon: Target, tone: 'text-violet-400' },
        { label: 'Left', value: left, detail: 'days remaining', icon: ArrowDown, tone: 'text-amber-400' },
        { label: 'Overall progress', value: `${analytics.percentage}%`, detail: 'monthly completion', icon: Gauge, tone: 'text-emerald-400' },
      ].map(({ label, value, detail, icon: Icon, tone }) => <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel-soft)] p-5" key={label}><div className="flex items-center justify-between"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-faint)]">{label}</p><Icon className={tone} size={18} /></div><p className="mt-5 text-2xl font-semibold text-[var(--text-strong)]">{value}</p><p className="mt-1 text-xs text-[var(--text-muted)]">{detail}</p>{label === 'Overall progress' ? <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[var(--track)]"><div className="h-full rounded-full bg-emerald-400" style={{ width: `${analytics.percentage}%` }} /></div> : null}</div>)}
    </div>

    <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
      <Panel eyebrow="Momentum" title="Daily progress" className="min-w-0">
        <div className="mt-5 h-64 w-full"><ResponsiveContainer width="100%" height="100%"><BarChart data={analytics.daily} margin={{ top: 5, right: 5, bottom: 0, left: -22 }}><CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" /><XAxis dataKey="day" tick={{ fill: '#91a4b9', fontSize: 11 }} tickLine={false} axisLine={false} /><YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} tick={{ fill: '#91a4b9', fontSize: 11 }} tickLine={false} axisLine={false} /><Tooltip contentStyle={chartTooltipStyle} formatter={(value) => [`${value}%`, 'Progress']} labelFormatter={(label) => `September ${label}`} /><Bar dataKey="percentage" fill="#58d6e8" radius={[5, 5, 0, 0]} maxBarSize={18} /></BarChart></ResponsiveContainer></div>
      </Panel>
      <Panel eyebrow="At a glance" title="Overall progress" className="min-w-0">
        <div className="relative mt-2 h-64"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={[{ name: 'Completed', value: analytics.percentage }, { name: 'Left', value: 100 - analytics.percentage }]} dataKey="value" innerRadius={68} outerRadius={88} paddingAngle={3} stroke="none"><Cell fill="#58d6e8" /><Cell fill="var(--track)" /></Pie><Tooltip contentStyle={chartTooltipStyle} formatter={(value) => [`${value}%`, 'Share']} /></PieChart></ResponsiveContainer><div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"><span className="text-3xl font-semibold text-[var(--text-strong)]">{analytics.percentage}%</span><span className="mt-1 text-xs text-[var(--text-muted)]">completed</span></div></div>
        <div className="grid grid-cols-3 border-t border-[var(--border)] pt-4 text-center"><div><p className="text-lg font-semibold text-[var(--text-strong)]">{analytics.completed}</p><p className="text-[10px] uppercase tracking-wide text-[var(--text-faint)]">Done</p></div><div><p className="text-lg font-semibold text-[var(--text-strong)]">{left}</p><p className="text-[10px] uppercase tracking-wide text-[var(--text-faint)]">Left</p></div><div><p className="text-lg font-semibold text-[var(--text-strong)]">{analytics.goal}</p><p className="text-[10px] uppercase tracking-wide text-[var(--text-faint)]">Goal</p></div></div>
      </Panel>
    </div>

    <Panel eyebrow="Consistency" title="Weekly progress">
      <div className="mt-5 grid gap-3 md:grid-cols-3 xl:grid-cols-5">{analytics.weekly.map((week, index) => <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel-soft)] p-4" key={week.label}><div className="flex items-center justify-between"><p className="text-sm font-semibold text-[var(--text-strong)]">Week {index + 1}</p><span className="text-xs font-bold text-[var(--accent)]">{week.percentage}%</span></div><p className="mt-1 text-xs text-[var(--text-muted)]">{week.label} September</p><p className="mt-5 text-sm text-[var(--text-muted)]"><span className="font-semibold text-[var(--text-strong)]">{week.completed}</span> / {week.total} completed</p><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--track)]"><div className="h-full rounded-full bg-[var(--accent)]" style={{ width: `${week.percentage}%` }} /></div></div>)}</div>
    </Panel>

    <Panel eyebrow="Leaderboard" title="Top habits"><div className="mt-4 flex justify-end"><label className="flex items-center gap-2 text-xs text-[var(--text-muted)]">Sort by<select className="rounded-lg border border-[var(--border)] bg-[var(--panel-soft)] px-2 py-1.5 text-xs font-semibold text-[var(--text-strong)] outline-none" value={sortMode} onChange={(event) => setSortMode(event.target.value as SortMode)}><option value="percentage">Completion %</option><option value="completed">Completed days</option><option value="remaining">Remaining</option><option value="goal">Goal</option></select></label></div><div className="mt-3 divide-y divide-[var(--border)]">{leaderboard.map((item, index) => <div className="flex items-center gap-3 py-3" key={item.habit.id}><span className="w-5 text-center text-xs font-bold text-[var(--text-faint)]">{index === 0 ? <Crown className="mx-auto text-amber-400" size={16} /> : index + 1}</span><span className="flex size-8 items-center justify-center rounded-lg bg-[var(--panel-soft)] text-base">{item.habit.icon}</span><span className="min-w-28 flex-1 truncate text-sm font-semibold text-[var(--text-strong)]">{item.habit.name}</span><div className="hidden w-40 items-center gap-3 sm:flex"><div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--track)]"><div className="h-full rounded-full" style={{ width: `${item.percentage}%`, backgroundColor: item.habit.color }} /></div></div><span className="w-12 text-right text-sm font-bold text-[var(--text-strong)]">{item.percentage}%</span></div>)}</div></Panel>
  </div>
}