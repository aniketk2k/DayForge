import { BarChart3, CircleDollarSign, LayoutDashboard, Settings, Target, TrendingUp } from 'lucide-react'
import { lazy, Suspense, type ReactNode } from 'react'

const AnalyticsInsights = lazy(() => import('../components/analytics/AnalyticsInsights').then((module) => ({ default: module.AnalyticsInsights })))
const HabitAnalytics = lazy(() => import('../components/dashboard/HabitAnalytics').then((module) => ({ default: module.HabitAnalytics })))
const HabitTracker = lazy(() => import('../components/dashboard/HabitTracker').then((module) => ({ default: module.HabitTracker })))
const ExpenseOverview = lazy(() => import('../components/expenses/ExpenseOverview').then((module) => ({ default: module.ExpenseOverview })))
const ExpenseManagement = lazy(() => import('../components/expenses/ExpenseManagement').then((module) => ({ default: module.ExpenseManagement })))
const HabitManagement = lazy(() => import('../components/habits/HabitManagement').then((module) => ({ default: module.HabitManagement })))
const YearlyOverview = lazy(() => import('../components/yearly/YearlyOverview').then((module) => ({ default: module.YearlyOverview })))
const SettingsPanel = lazy(() => import('../components/settings/SettingsPanel').then((module) => ({ default: module.SettingsPanel })))

type PlaceholderPageProps = {
  page: string
  monthLabel: string
  month: Date
  onSelectMonth?: (month: Date) => void
}

const pageCopy: Record<string, { description: string; icon: typeof LayoutDashboard; accent: string }> = {
  Dashboard: { description: 'Your daily progress, habit rhythm, and spending at a glance.', icon: LayoutDashboard, accent: 'cyan' },
  Habits: { description: 'Shape a repeatable routine with clear, achievable targets.', icon: Target, accent: 'violet' },
  Expenses: { description: 'Keep your spending visible and make room for what matters.', icon: CircleDollarSign, accent: 'emerald' },
  Analytics: { description: 'Find the patterns behind your best and hardest days.', icon: BarChart3, accent: 'amber' },
  'Yearly Overview': { description: 'See the year as a story of small decisions adding up.', icon: TrendingUp, accent: 'rose' },
  Settings: { description: 'Make HabitTrack fit the way you work.', icon: Settings, accent: 'slate' },
}

export function PlaceholderPage({ page, monthLabel, month, onSelectMonth }: PlaceholderPageProps) {
  const content = pageCopy[page]
  const Icon = content.icon
  const phaseContent: ReactNode = <Suspense fallback={<LoadingState />}>{page === 'Dashboard' ? <><HabitAnalytics month={month} /><HabitTracker month={month} /><ExpenseOverview month={month} /></> : page === 'Habits' ? <HabitManagement month={month} /> : page === 'Expenses' ? <ExpenseManagement month={month} /> : page === 'Analytics' ? <><HabitAnalytics month={month} /><AnalyticsInsights month={month} /></> : page === 'Yearly Overview' && onSelectMonth ? <YearlyOverview month={month} onSelectMonth={onSelectMonth} /> : page === 'Settings' ? <SettingsPanel /> : null}</Suspense>

  return (
    <div className="animate-fade-in">
      <section className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--panel)] p-7 shadow-[var(--shadow)] sm:p-10">
        <div className="absolute -right-20 -top-20 size-64 rounded-full bg-cyan-400/5 blur-3xl" aria-hidden="true" />
        <div className="relative max-w-2xl">
          <div className={`mb-6 flex size-12 items-center justify-center rounded-2xl bg-${content.accent}-400/10 text-${content.accent}-400`}>
            <Icon size={23} />
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent)]">{monthLabel}</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--text-strong)] sm:text-4xl">{page === 'Dashboard' ? 'A clearer view of your month.' : content.description}</h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-[var(--text-muted)]">{content.description} Everything here is connected to your locally persisted workspace.</p>
        </div>
      </section>
      {phaseContent}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {['Focused workspace', 'Clear monthly rhythm', 'Built to grow with you'].map((label, index) => (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel-soft)] p-5" key={label}>
            <span className="text-xs font-bold text-[var(--text-faint)]">0{index + 1}</span>
            <p className="mt-8 text-sm font-semibold text-[var(--text-strong)]">{label}</p>
            <div className="mt-4 h-1 rounded-full bg-[var(--track)]"><div className={`h-full rounded-full bg-${content.accent}-400`} style={{ width: `${42 + index * 17}%` }} /></div>
          </div>
        ))}
      </div>
    </div>
  )
}

function LoadingState() {
  return <div className="mt-6 rounded-3xl border border-[var(--border)] bg-[var(--panel)] p-8 text-sm text-[var(--text-muted)]" role="status">Loading workspace...</div>
}