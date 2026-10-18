import { useState, type ReactNode } from 'react'
import { format } from 'date-fns'
import { ArrowDown, CheckCircle2, Gauge, Target } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useAppData } from '../../hooks/useAppData'
import { calculateHabitAnalytics, type HabitAnalytics as HabitAnalyticsData, type HabitRanking } from '../../utils/habitCalculations'

type SortMode = 'percentage' | 'completed' | 'remaining' | 'goal'
type AnalyticsSection = 'all' | 'kpis' | 'charts' | 'side'
const chartTooltipStyle = { background: '#102238', border: '1px solid #2b4662', borderRadius: 12, color: '#f8fafc' }

export function HabitAnalytics({ month, section = 'all' }: { month: Date; section?: AnalyticsSection }) {
  const { data } = useAppData()
  const analytics = calculateHabitAnalytics(data.habits, data.habitLogs, month)
  const showKpis = section === 'all' || section === 'kpis'
  const showCharts = section === 'all' || section === 'charts'
  const showSide = section === 'all' || section === 'side'
  return <div className={section === 'all' ? 'mt-6 space-y-6' : 'space-y-6'}>{showKpis ? <KpiCards analytics={analytics} /> : null}{showCharts ? <ChartSections analytics={analytics} month={month} /> : null}{showSide ? <SideSections analytics={analytics} /> : null}</div>
}

function KpiCards({ analytics }: { analytics: HabitAnalyticsData }) {
  const cards = [{ label: 'Completed', value: analytics.completed, detail: `of ${analytics.goal} goal days`, icon: CheckCircle2, tone: 'text-emerald-400' }, { label: 'Goal', value: analytics.goal, detail: 'total target days', icon: Target, tone: 'text-blue-400' }, { label: 'Left', value: analytics.remaining, detail: 'days remaining', icon: ArrowDown, tone: 'text-orange-400' }, { label: 'Overall Progress', value: `${analytics.percentage}%`, detail: 'monthly completion', icon: Gauge, tone: 'text-violet-400' }]
  return <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{cards.map(({ label, value, detail, icon: Icon, tone }) => <div className="rounded-xl border border-[var(--border)] bg-[var(--panel)] p-4 shadow-[var(--shadow)]" key={label}><div className="flex items-center gap-3"><span className={`flex size-11 items-center justify-center rounded-xl bg-current/10 ${tone}`}><Icon size={22} /></span><div><p className="text-xs font-medium text-[var(--text-muted)]">{label}</p><p className="mt-1 text-2xl font-bold leading-none text-[var(--text-strong)]">{value}</p></div></div><div className="mt-3 flex items-center justify-between text-xs text-[var(--text-muted)]"><span>{detail}</span>{label === 'Completed' ? <strong className="text-emerald-400">{analytics.percentage}%</strong> : null}</div>{label === 'Overall Progress' ? <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--track)]"><div className="h-full rounded-full bg-violet-500" style={{ width: `${analytics.percentage}%` }} /></div> : null}</div>)}</div>
}

function ChartSections({ analytics, month }: { analytics: HabitAnalyticsData; month: Date }) {
  return <div className="space-y-4"><div className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]"><Panel eyebrow="Momentum" title={`Daily Progress (${format(month, 'MMMM yyyy')})`}><div className="mt-4 h-56"><ResponsiveContainer width="100%" height="100%"><BarChart data={analytics.daily} margin={{ top: 5, right: 5, bottom: 0, left: -22 }}><CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="4 4" /><XAxis dataKey="day" tick={{ fill: '#91a4b9', fontSize: 10 }} tickLine={false} axisLine={false} /><YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} tick={{ fill: '#91a4b9', fontSize: 10 }} tickLine={false} axisLine={false} /><Tooltip contentStyle={chartTooltipStyle} formatter={(value) => [`${value}%`, 'Progress']} labelFormatter={(label) => `${format(month, 'MMMM')} ${label}`} /><Bar dataKey="percentage" fill="#2586f7" radius={[3, 3, 0, 0]} maxBarSize={14} /></BarChart></ResponsiveContainer></div></Panel><Panel eyebrow="Consistency" title="Weekly Progress"><WeeklyCards analytics={analytics} month={month} /></Panel></div></div>
}

function WeeklyCards({ analytics, month }: { analytics: HabitAnalyticsData; month: Date }) {
  return <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">{analytics.weekly.map((week, index) => <div className="rounded-lg border border-[var(--border)] bg-[var(--panel-soft)] p-3 text-center" key={week.label}><p className="text-xs font-semibold text-[var(--text-strong)]">Week {index + 1}</p><p className="mt-1 text-[10px] text-[var(--text-muted)]">{week.label} {format(month, 'MMM')}</p><p className="mt-3 text-sm font-bold text-[var(--text-strong)]">{week.completed} / {week.total}</p><div className="mt-2 h-1.5 rounded-full bg-[var(--track)]"><div className="h-full rounded-full bg-emerald-400" style={{ width: `${week.percentage}%` }} /></div><p className="mt-1 text-[10px] font-bold text-[var(--accent)]">{week.percentage}%</p></div>)}</div>
}

function SideSections({ analytics }: { analytics: HabitAnalyticsData }) {
  return <div className="space-y-4"><Panel eyebrow="Leaderboard" title="Top 10 Habits"><Leaderboard items={analytics.leaderboard} /></Panel><Panel eyebrow="At a glance" title="Overall Habit Progress"><div className="relative h-48"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={[{ name: 'Completed', value: analytics.percentage }, { name: 'Left', value: 100 - analytics.percentage }]} dataKey="value" innerRadius={52} outerRadius={70} paddingAngle={3} stroke="none"><Cell fill="#19c98b" /><Cell fill="var(--track)" /></Pie></PieChart></ResponsiveContainer><div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"><span className="text-2xl font-bold text-[var(--text-strong)]">{analytics.percentage}%</span><span className="text-[10px] text-[var(--text-muted)]">Completed</span></div></div><div className="grid grid-cols-3 border-t border-[var(--border)] pt-3 text-center text-[10px]"><div><strong className="block text-sm text-[var(--text-strong)]">{analytics.completed}</strong>Done</div><div><strong className="block text-sm text-[var(--text-strong)]">{analytics.remaining}</strong>Left</div><div><strong className="block text-sm text-[var(--text-strong)]">{analytics.goal}</strong>Goal</div></div></Panel></div>
}

function Leaderboard({ items }: { items: HabitRanking[] }) {
  const [sortMode, setSortMode] = useState<SortMode>('percentage')
  const sorted = [...items].sort((a, b) => sortMode === 'completed' ? b.completed - a.completed : sortMode === 'remaining' ? a.remaining - b.remaining : sortMode === 'goal' ? b.habit.monthlyTarget - a.habit.monthlyTarget : b.percentage - a.percentage || b.completed - a.completed).slice(0, 10)
  return <><div className="flex justify-end"><select className="rounded-lg border border-[var(--border)] bg-[var(--panel-soft)] px-2 py-1.5 text-xs text-[var(--text-strong)]" value={sortMode} onChange={(event) => setSortMode(event.target.value as SortMode)} aria-label="Sort top habits"><option value="percentage">By Completion %</option><option value="completed">Completed days</option><option value="remaining">Remaining</option><option value="goal">Goal</option></select></div><div className="mt-2 divide-y divide-[var(--border)]">{sorted.map((item, index) => <div className="flex items-center gap-2 py-2" key={item.habit.id}><span className="flex size-5 items-center justify-center rounded bg-[var(--track)] text-[10px] font-bold text-[var(--text-strong)]">{index + 1}</span><span className="text-sm">{item.habit.icon}</span><span className="min-w-0 flex-1 truncate text-xs font-semibold text-[var(--text-strong)]">{item.habit.name}</span><div className="hidden w-16 rounded-full bg-[var(--track)] sm:block"><div className="h-1.5 rounded-full" style={{ width: `${item.percentage}%`, backgroundColor: item.habit.color }} /></div><span className="w-8 text-right text-[11px] font-bold text-[var(--text-muted)]">{item.percentage}%</span></div>)}</div></>
}

function Panel({ title, eyebrow, children }: { title: string; eyebrow: string; children: ReactNode }) {
  return <section className="rounded-xl border border-[var(--border)] bg-[var(--panel)] p-4 shadow-[var(--shadow)] sm:p-5"><p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[var(--accent)]">{eyebrow}</p><h2 className="mt-1 text-lg font-bold text-[var(--text-strong)]">{title}</h2>{children}</section>
}