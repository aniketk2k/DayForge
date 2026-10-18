import { BarChart3, CircleDollarSign, LayoutDashboard, Settings, Target, TrendingUp } from 'lucide-react'
import type { ReactNode } from 'react'
import { HabitAnalytics } from '../components/dashboard/HabitAnalytics'
import { HabitTracker } from '../components/dashboard/HabitTracker'
import { ExpenseOverview } from '../components/expenses/ExpenseOverview'
import { AnalyticsInsights } from '../components/analytics/AnalyticsInsights'
import { ExpenseManagement } from '../components/expenses/ExpenseManagement'
import { HabitManagement } from '../components/habits/HabitManagement'
import { YearlyOverview } from '../components/yearly/YearlyOverview'
import { SettingsPanel } from '../components/settings/SettingsPanel'

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
  const phaseContent: ReactNode = page === 'Dashboard' ? <><HabitAnalytics month={month} section="kpis" /><div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_21rem]"><div className="min-w-0 space-y-4"><HabitTracker month={month} /><HabitAnalytics month={month} section="charts" /></div><HabitAnalytics month={month} section="side" /></div><ExpenseOverview month={month} /></> : page === 'Habits' ? <HabitManagement month={month} /> : page === 'Expenses' ? <ExpenseManagement month={month} /> : page === 'Analytics' ? <><HabitAnalytics month={month} /><AnalyticsInsights month={month} /></> : page === 'Yearly Overview' && onSelectMonth ? <YearlyOverview month={month} onSelectMonth={onSelectMonth} /> : page === 'Settings' ? <SettingsPanel /> : null

  return (
    <div className="animate-fade-in">
      {page !== 'Dashboard' ? <section className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--panel)] p-7 shadow-[var(--shadow)] sm:p-10"><div className={`mb-6 flex size-12 items-center justify-center rounded-2xl bg-${content.accent}-400/10 text-${content.accent}-400`}><Icon size={23} /></div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent)]">{monthLabel}</p><h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--text-strong)] sm:text-4xl">{content.description}</h2><p className="mt-4 max-w-xl text-base leading-7 text-[var(--text-muted)]">Everything here is connected to your locally persisted workspace.</p></section> : null}
      {phaseContent}
    </div>
  )
}
