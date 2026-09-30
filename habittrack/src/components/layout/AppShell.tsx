import { useState, type ReactNode } from 'react'
import { format } from 'date-fns'
import { NavLink, useLocation } from 'react-router-dom'
import {
  BarChart3,
  Bell,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  LayoutDashboard,
  Menu,
  Moon,
  Settings,
  Sparkles,
  Sun,
  Target,
  X,
} from 'lucide-react'
import { useAppData } from '../../hooks/useAppData'
import { calculateHabitAnalytics } from '../../utils/habitCalculations'

type Theme = 'dark' | 'light'

type AppShellProps = {
  children: ReactNode
  month: Date
  monthLabel: string
  onNextMonth: () => void
  onPreviousMonth: () => void
  onToday: () => void
  theme: Theme
  onToggleTheme: () => void
}

const navigation = [
  { label: 'Dashboard', to: '/', icon: LayoutDashboard },
  { label: 'Habits', to: '/habits', icon: Target },
  { label: 'Expenses', to: '/expenses', icon: CircleDollarSign },
  { label: 'Analytics', to: '/analytics', icon: BarChart3 },
  { label: 'Yearly Overview', to: '/yearly-overview', icon: CalendarDays },
  { label: 'Settings', to: '/settings', icon: Settings },
]

function Sidebar({ month, onClose }: { month: Date; onClose?: () => void }) {
  const { data } = useAppData()
  const analytics = calculateHabitAnalytics(data.habits, data.habitLogs, month)

  return (
    <aside className="flex h-full w-72 flex-col border-r border-[var(--border)] bg-[var(--sidebar)] px-4 py-5">
      <div className="flex items-center justify-between px-3">
        <NavLink className="flex items-center gap-3" to="/" onClick={onClose}>
          <span className="flex size-10 items-center justify-center rounded-xl bg-[var(--accent)] text-slate-950 shadow-lg shadow-cyan-500/20">
            <Sparkles size={19} strokeWidth={2.5} />
          </span>
          <span>
            <span className="block text-sm font-bold tracking-wide text-[var(--text-strong)]">HabitTrack</span>
            <span className="block text-xs text-[var(--text-muted)]">Your daily rhythm</span>
          </span>
        </NavLink>
        {onClose ? (
          <button className="icon-button md:hidden" type="button" onClick={onClose} aria-label="Close navigation">
            <X size={18} />
          </button>
        ) : null}
      </div>

      <div className="mt-10 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-faint)]">Workspace</div>
      <nav className="mt-3 flex flex-1 flex-col gap-1" aria-label="Primary navigation">
        {navigation.map(({ label, to, icon: Icon }) => (
          <NavLink
            className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}
            end={to === '/'}
            key={to}
            to={to}
            onClick={onClose}
          >
            <Icon size={18} strokeWidth={1.8} />
            {label}
          </NavLink>
        ))}
      </nav>

      <NavLink className="group block rounded-2xl border border-[var(--border)] bg-[var(--panel-soft)] p-4 transition hover:border-[var(--accent-border)]" to="/" onClick={onClose} aria-label={`Open ${format(month, 'MMMM yyyy')} monthly focus`}>
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-semibold text-[var(--text-muted)]">Monthly focus</span>
          <Target className="text-[var(--accent)] transition group-hover:scale-110" size={16} />
        </div>
        <div className="flex items-end justify-between gap-3">
          <p className="text-sm font-semibold text-[var(--text-strong)]">{format(month, 'MMMM')} rhythm</p>
          <span className="text-xs font-bold text-[var(--accent)]">{analytics.percentage}%</span>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--track)]" aria-label={`${analytics.percentage}% monthly progress`} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={analytics.percentage}>
          <div className="h-full rounded-full bg-[var(--accent)] transition-all" style={{ width: `${analytics.percentage}%` }} />
        </div>
        <p className="mt-2 text-[11px] text-[var(--text-muted)]">{analytics.completed} of {analytics.goal} goal days complete</p>
      </NavLink>

      <div className="mt-5 flex items-center gap-3 border-t border-[var(--border)] px-3 pt-5">
        <div className="flex size-9 items-center justify-center rounded-full bg-emerald-400/15 text-xs font-bold text-emerald-400">JD</div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-[var(--text-strong)]">Jordan Doe</p>
          <p className="truncate text-xs text-[var(--text-muted)]">Personal workspace</p>
        </div>
        <button className="icon-button" type="button" aria-label="Open profile menu">
          <Settings size={16} />
        </button>
      </div>
    </aside>
  )
}

export function AppShell({ children, month, monthLabel, onNextMonth, onPreviousMonth, onToday, theme, onToggleTheme }: AppShellProps) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const location = useLocation()
  const activePage = navigation.find((item) => item.to === location.pathname)?.label ?? 'Dashboard'

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text)]">
      <div className="hidden md:fixed md:inset-y-0 md:flex">
        <Sidebar month={month} />
      </div>
      {isMobileNavOpen ? (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <button className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" type="button" onClick={() => setIsMobileNavOpen(false)} aria-label="Close navigation overlay" />
          <div className="relative h-full shadow-2xl shadow-slate-950/50">
            <Sidebar month={month} onClose={() => setIsMobileNavOpen(false)} />
          </div>
        </div>
      ) : null}

      <div className="md:pl-72">
        <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--background)]/90 backdrop-blur-xl">
          <div className="flex min-h-20 items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:px-10">
            <div className="flex min-w-0 items-center gap-3">
              <button className="icon-button md:hidden" type="button" onClick={() => setIsMobileNavOpen(true)} aria-label="Open navigation">
                <Menu size={20} />
              </button>
              <div className="min-w-0">
                <p className="hidden text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-faint)] sm:block">Workspace / {activePage}</p>
                <h1 className="truncate text-lg font-semibold text-[var(--text-strong)] sm:mt-1 sm:text-xl">{activePage}</h1>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden items-center rounded-xl border border-[var(--border)] bg-[var(--panel)] p-1 sm:flex">
                <button className="date-button" type="button" onClick={onPreviousMonth} aria-label="Previous month"><ChevronLeft size={16} /></button>
                <button className="flex min-w-32 items-center justify-center gap-2 px-2 text-sm font-semibold text-[var(--text-strong)]" type="button" aria-label="Choose month">
                  <CalendarDays size={15} className="text-[var(--accent)]" />
                  {monthLabel}
                </button>
                <button className="date-button" type="button" onClick={onNextMonth} aria-label="Next month"><ChevronRight size={16} /></button>
              </div>
              <button className="hidden rounded-xl border border-[var(--border)] px-3 py-2 text-xs font-semibold text-[var(--text-muted)] transition hover:border-[var(--accent-border)] hover:text-[var(--text-strong)] sm:block" type="button" onClick={onToday}>Today</button>
              <button className="icon-button" type="button" aria-label="Notifications"><Bell size={18} /></button>
              <button className="icon-button" type="button" onClick={onToggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <div className="hidden size-9 items-center justify-center rounded-full bg-emerald-400/15 text-xs font-bold text-emerald-400 sm:flex">JD</div>
            </div>
          </div>
          <div className="flex items-center gap-2 px-5 pb-4 sm:hidden">
            <button className="date-button border border-[var(--border)]" type="button" onClick={onPreviousMonth} aria-label="Previous month"><ChevronLeft size={16} /></button>
            <div className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--panel)] py-2 text-sm font-semibold text-[var(--text-strong)]"><CalendarDays size={15} className="text-[var(--accent)]" />{monthLabel}</div>
            <button className="date-button border border-[var(--border)]" type="button" onClick={onNextMonth} aria-label="Next month"><ChevronRight size={16} /></button>
            <button className="rounded-xl border border-[var(--border)] px-3 py-2 text-xs font-semibold text-[var(--text-muted)]" type="button" onClick={onToday}>Today</button>
          </div>
        </header>
        <main className="mx-auto max-w-[1600px] px-5 py-7 sm:px-8 lg:px-10 lg:py-9">{children}</main>
      </div>
    </div>
  )
}