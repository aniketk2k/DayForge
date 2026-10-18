import { useState, type ReactNode } from 'react'
import { format, isValid, parse, startOfMonth } from 'date-fns'
import { NavLink } from 'react-router-dom'
import {
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Home,
  Leaf,
  LogOut,
  Menu,
  Moon,
  Search,
  Settings,
  Sun,
  Wallet,
  X,
} from 'lucide-react'

type Theme = 'dark' | 'light'

type AppShellProps = {
  children: ReactNode
  month: Date
  onMonthChange: (month: Date) => void
  onNextMonth: () => void
  onPreviousMonth: () => void
  onToday: () => void
  theme: Theme
  onToggleTheme: () => void
  onLogout: () => void
}

const navigation = [
  { label: 'Dashboard', to: '/', icon: Home },
  { label: 'Habits', to: '/habits', icon: CheckCircle2 },
  { label: 'Expenses', to: '/expenses', icon: Wallet },
  { label: 'Analytics', to: '/analytics', icon: BarChart3 },
  { label: 'Yearly Overview', to: '/yearly-overview', icon: CalendarDays },
  { label: 'Settings', to: '/settings', icon: Settings },
]

function Sidebar({ onClose, theme, onToggleTheme }: { onClose?: () => void; theme: Theme; onToggleTheme: () => void }) {
  return (
    <aside className="flex h-full w-56 flex-col border-r border-[var(--border)] bg-[var(--sidebar)] px-3 py-5">
      <div className="flex items-center justify-between px-2">
        <NavLink className="flex items-center gap-2.5" to="/" onClick={onClose}>
          <Leaf className="text-[var(--accent)]" size={28} fill="currentColor" strokeWidth={1.5} />
          <span className="text-xl font-bold tracking-tight text-[var(--text-strong)]">HabitTrack</span>
        </NavLink>
        {onClose ? (
          <button className="icon-button md:hidden" type="button" onClick={onClose} aria-label="Close navigation">
            <X size={18} />
          </button>
        ) : null}
      </div>

      <nav className="mt-8 flex flex-col gap-1" aria-label="Primary navigation">
        {navigation.map(({ label, to, icon: Icon }) => (
          <NavLink className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`} end={to === '/'} key={to} to={to} onClick={onClose}>
            <Icon size={18} strokeWidth={1.8} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="flex-1" />

      <div className="relative mb-4 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--panel-soft)] p-4">
        <p className="text-sm italic leading-relaxed text-[var(--text-muted)]">“Better habits<br />A better you.”</p>
        <svg className="mt-6 h-16 w-full text-[var(--border-strong)]" viewBox="0 0 200 60" fill="currentColor" aria-hidden="true">
          <path d="M0 60 L45 22 L65 40 L105 6 L150 44 L170 30 L200 60 Z" opacity="0.55" />
        </svg>
      </div>

      <button className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--panel-soft)] px-3 py-2.5 text-xs font-medium text-[var(--text-strong)]" type="button" onClick={onToggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
        <Sun size={16} className={theme === 'light' ? 'text-[var(--accent)]' : 'text-[var(--text-faint)]'} />
        <Moon size={16} className={theme === 'dark' ? 'text-[var(--accent)]' : 'text-[var(--text-faint)]'} />
        <span className="ml-auto">{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
      </button>
    </aside>
  )
}

export function AppShell({ children, month, onMonthChange, onNextMonth, onPreviousMonth, onToday, theme, onToggleTheme, onLogout }: AppShellProps) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text)]">
      <div className="hidden md:fixed md:inset-y-0 md:flex">
        <Sidebar theme={theme} onToggleTheme={onToggleTheme} />
      </div>
      {isMobileNavOpen ? (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <button className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" type="button" onClick={() => setIsMobileNavOpen(false)} aria-label="Close navigation overlay" />
          <div className="relative h-full shadow-2xl shadow-slate-950/50">
            <Sidebar theme={theme} onToggleTheme={onToggleTheme} onClose={() => setIsMobileNavOpen(false)} />
          </div>
        </div>
      ) : null}

      <div className="md:pl-56">
        <header className="sticky top-0 z-30 bg-[var(--background)]/90 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5">
            <h1 className="sr-only">HabitTrack dashboard</h1>
            <div className="flex min-w-0 items-center gap-2">
              <span className="md:hidden"><button className="box-button" type="button" onClick={() => setIsMobileNavOpen(true)} aria-label="Open navigation">
                <Menu size={18} />
              </button></span>
              <button className="box-button" type="button" onClick={onPreviousMonth} aria-label="Previous month"><ChevronLeft size={16} /></button>
              <MonthPicker month={month} onChange={onMonthChange} />
              <button className="box-button" type="button" onClick={onNextMonth} aria-label="Next month"><ChevronRight size={16} /></button>
            </div>
            <div className="flex items-center gap-2">
              <button className="box-button" type="button" onClick={onToday}><Search size={14} className="hidden sm:block" />Today</button>
              <button className="box-button hidden sm:inline-flex" type="button" onClick={onToggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
                {theme === 'dark' ? <CalendarDays size={16} /> : <Sun size={16} />}
              </button>
              <div className="relative">
                <button className="flex items-center gap-2 rounded-xl px-2 py-1 text-sm font-medium text-[var(--text-strong)]" type="button" onClick={() => setMenuOpen((open) => !open)} aria-haspopup="menu" aria-expanded={menuOpen}>
                  <span className="flex size-8 items-center justify-center rounded-full bg-[var(--accent)] text-xs font-bold text-[var(--accent-contrast)]">A</span>
                  <span className="hidden sm:inline">Aniket</span>
                  <ChevronDown size={14} />
                </button>
                {menuOpen ? (
                  <div className="card absolute right-0 mt-2 w-40 p-1" role="menu">
                    <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--text-strong)] hover:bg-[var(--panel-soft)]" type="button" role="menuitem" onClick={onLogout} aria-label="Sign out">
                      <LogOut size={15} /> Sign out
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-[1700px] px-4 pb-8 pt-1 sm:px-5">{children}</main>
      </div>
    </div>
  )
}

function MonthPicker({ month, onChange }: { month: Date; onChange: (month: Date) => void }) {
  const handleChange = (value: string) => {
    const parsedMonth = parse(value, 'yyyy-MM', new Date())
    if (isValid(parsedMonth)) onChange(startOfMonth(parsedMonth))
  }

  return <label className="month-picker box-button"><span className="sr-only">Choose month and year</span><input aria-label="Choose month and year" type="month" value={format(month, 'yyyy-MM')} onChange={(event) => handleChange(event.target.value)} /></label>
}