import { useState, type ReactNode } from 'react'
import {
  BarChart3,
  CircleDollarSign,
  Eye,
  EyeOff,
  LayoutDashboard,
  Settings,
  SlidersHorizontal,
  Target,
  TrendingUp,
} from 'lucide-react'
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

type DashboardSections = {
  kpis: boolean
  tracker: boolean
  charts: boolean
  side: boolean
  expenses: boolean
}

const pageCopy: Record<string, { description: string; icon: typeof LayoutDashboard; accent: string }> = {
  Dashboard: { description: 'Your daily progress, habit rhythm, and spending at a glance.', icon: LayoutDashboard, accent: 'cyan' },
  Habits: { description: 'Shape a repeatable routine with clear, achievable targets.', icon: Target, accent: 'violet' },
  Expenses: { description: 'Keep your spending visible and make room for what matters.', icon: CircleDollarSign, accent: 'emerald' },
  Analytics: { description: 'Find the patterns behind your best and hardest days.', icon: BarChart3, accent: 'amber' },
  'Yearly Overview': { description: 'See the year as a story of small decisions adding up.', icon: TrendingUp, accent: 'rose' },
  Settings: { description: 'Make HabitTrack fit the way you work.', icon: Settings, accent: 'slate' },
}

function DashboardView({ month }: { month: Date }) {
  const [isDashboardHidden, setIsDashboardHidden] = useState<boolean>(() => {
    return localStorage.getItem('habittrack-dashboard-hidden') === 'true'
  })
  const [sections, setSections] = useState<DashboardSections>(() => {
    const saved = localStorage.getItem('habittrack-dashboard-sections')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        // default
      }
    }
    return { kpis: true, tracker: true, charts: true, side: true, expenses: true }
  })
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false)

  const toggleSection = (key: keyof DashboardSections) => {
    setSections((prev) => {
      const updated = { ...prev, [key]: !prev[key] }
      localStorage.setItem('habittrack-dashboard-sections', JSON.stringify(updated))
      return updated
    })
  }

  const toggleDashboardHide = () => {
    setIsDashboardHidden((prev) => {
      const next = !prev
      localStorage.setItem('habittrack-dashboard-hidden', String(next))
      return next
    })
  }

  return (
    <div className="space-y-3">
      {/* Control bar: Hide/Show Dashboard & Customize view options */}
      <div className="flex items-center justify-between gap-2 pb-0.5">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleDashboardHide}
            className="box-button !h-8 !px-2.5 text-xs font-medium"
            title={isDashboardHidden ? 'Show Dashboard' : 'Hide Dashboard'}
          >
            {isDashboardHidden ? <Eye size={14} className="text-[var(--accent)]" /> : <EyeOff size={14} />}
            <span>{isDashboardHidden ? 'Show Dashboard' : 'Hide Dashboard'}</span>
          </button>

          {!isDashboardHidden ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsCustomizeOpen((prev) => !prev)}
                className="box-button !h-8 !px-2.5 text-xs font-medium"
                title="Include/exclude sections in dashboard"
                aria-expanded={isCustomizeOpen}
              >
                <SlidersHorizontal size={14} />
                <span>Customize View</span>
              </button>
              {isCustomizeOpen ? (
                <div className="card absolute left-0 mt-2 w-60 p-2.5 z-40 shadow-xl space-y-1.5">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] px-1">
                    Include in Dashboard
                  </p>
                  <label className="flex items-center gap-2 text-xs text-[var(--text-strong)] cursor-pointer hover:bg-[var(--panel-soft)] p-1.5 rounded">
                    <input
                      type="checkbox"
                      checked={sections.kpis}
                      onChange={() => toggleSection('kpis')}
                      className="accent-[var(--accent)] rounded"
                    />
                    <span>KPI Summary Cards</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs text-[var(--text-strong)] cursor-pointer hover:bg-[var(--panel-soft)] p-1.5 rounded">
                    <input
                      type="checkbox"
                      checked={sections.tracker}
                      onChange={() => toggleSection('tracker')}
                      className="accent-[var(--accent)] rounded"
                    />
                    <span>Habit Tracker Matrix</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs text-[var(--text-strong)] cursor-pointer hover:bg-[var(--panel-soft)] p-1.5 rounded">
                    <input
                      type="checkbox"
                      checked={sections.charts}
                      onChange={() => toggleSection('charts')}
                      className="accent-[var(--accent)] rounded"
                    />
                    <span>Momentum & Weekly Charts</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs text-[var(--text-strong)] cursor-pointer hover:bg-[var(--panel-soft)] p-1.5 rounded">
                    <input
                      type="checkbox"
                      checked={sections.side}
                      onChange={() => toggleSection('side')}
                      className="accent-[var(--accent)] rounded"
                    />
                    <span>Top Habits & Overall Goal</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs text-[var(--text-strong)] cursor-pointer hover:bg-[var(--panel-soft)] p-1.5 rounded">
                    <input
                      type="checkbox"
                      checked={sections.expenses}
                      onChange={() => toggleSection('expenses')}
                      className="accent-[var(--accent)] rounded"
                    />
                    <span>Monthly Expense Overview</span>
                  </label>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      {/* Hidden state banner */}
      {isDashboardHidden ? (
        <div className="card p-12 text-center flex flex-col items-center justify-center animate-fade-in">
          <div className="size-14 rounded-2xl bg-[var(--accent)]/15 text-[var(--accent)] flex items-center justify-center mb-4">
            <EyeOff size={28} />
          </div>
          <h2 className="text-xl font-bold text-[var(--text-strong)]">Dashboard is hidden</h2>
          <p className="text-sm text-[var(--text-muted)] mt-1.5 max-w-sm">
            You've chosen to hide the dashboard view. Click below whenever you want to bring it back.
          </p>
          <button className="btn-primary mt-6 !px-5 !py-2.5" onClick={toggleDashboardHide}>
            <Eye size={16} /> Show Dashboard
          </button>
        </div>
      ) : (
        <>
          {sections.kpis ? <HabitAnalytics month={month} section="kpis" /> : null}

          {sections.tracker || sections.charts || sections.side ? (
            <div
              className={`mt-4 grid gap-4 ${
                sections.side
                  ? 'xl:grid-cols-[minmax(0,1fr)_22rem] 2xl:grid-cols-[minmax(0,1fr)_25rem]'
                  : 'grid-cols-1'
              }`}
            >
              {sections.tracker || sections.charts ? (
                <div className="min-w-0 space-y-4">
                  {sections.tracker ? <HabitTracker month={month} /> : null}
                  {sections.charts ? <HabitAnalytics month={month} section="charts" /> : null}
                </div>
              ) : null}
              {sections.side ? <HabitAnalytics month={month} section="side" /> : null}
            </div>
          ) : null}

          {sections.expenses ? <ExpenseOverview month={month} /> : null}
        </>
      )}
    </div>
  )
}

export function PlaceholderPage({ page, monthLabel, month, onSelectMonth }: PlaceholderPageProps) {
  const content = pageCopy[page]
  const Icon = content.icon
  const phaseContent: ReactNode =
    page === 'Dashboard' ? (
      <DashboardView month={month} />
    ) : page === 'Habits' ? (
      <HabitManagement month={month} />
    ) : page === 'Expenses' ? (
      <ExpenseManagement month={month} />
    ) : page === 'Analytics' ? (
      <>
        <HabitAnalytics month={month} />
        <AnalyticsInsights month={month} />
      </>
    ) : page === 'Yearly Overview' && onSelectMonth ? (
      <YearlyOverview month={month} onSelectMonth={onSelectMonth} />
    ) : page === 'Settings' ? (
      <SettingsPanel />
    ) : null

  return (
    <div className="animate-fade-in w-full">
      {page !== 'Dashboard' ? (
        <section className="relative mb-6 overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--panel)] p-7 shadow-[var(--shadow)] sm:p-10">
          <div className={`mb-6 flex size-12 items-center justify-center rounded-2xl bg-${content.accent}-400/10 text-${content.accent}-400`}>
            <Icon size={23} />
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent)]">{monthLabel}</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--text-strong)] sm:text-4xl">{content.description}</h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-[var(--text-muted)]">Everything here is connected to your locally persisted workspace.</p>
        </section>
      ) : null}
      {phaseContent}
    </div>
  )
}
