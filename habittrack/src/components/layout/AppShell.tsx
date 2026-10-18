import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { format, isValid, parse, startOfMonth } from 'date-fns'
import { NavLink } from 'react-router-dom'
import {
  BarChart3,
  Calendar,
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
  PanelLeftClose,
  PanelLeftOpen,
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
  { label: 'Analytics', to: '/analytics', icon: BarChart3, hasSubmenu: true },
  { label: 'Yearly Overview', to: '/yearly-overview', icon: CalendarDays },
  { label: 'Settings', to: '/settings', icon: Settings },
]

const MIN_SIDEBAR_WIDTH = 140
const MAX_SIDEBAR_WIDTH = 380
const COLLAPSED_SIDEBAR_WIDTH = 68
const DEFAULT_SIDEBAR_WIDTH = 224

function Sidebar({
  onClose,
  theme,
  onToggleTheme,
  width,
  isCollapsed,
  onToggleCollapse,
  onStartResize,
  isDragging,
}: {
  onClose?: () => void
  theme: Theme
  onToggleTheme: () => void
  width: number
  isCollapsed: boolean
  onToggleCollapse?: () => void
  onStartResize?: (e: React.MouseEvent) => void
  isDragging?: boolean
}) {
  return (
    <aside
      className="relative flex h-full flex-col border-r border-[var(--border)] bg-[var(--sidebar)] transition-[width] duration-150 ease-out"
      style={{ width: `${width}px` }}
    >
      {/* Resizer line and quick toggle handle (desktop only) */}
      {onStartResize ? (
        <div
          className={`resizer-line group ${isDragging ? 'is-dragging' : ''}`}
          onMouseDown={onStartResize}
          title="Drag to resize sidebar width"
        >
          {onToggleCollapse ? (
            <button
              type="button"
              className="absolute -right-3 top-20 flex size-6 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--panel)] text-[var(--text-muted)] opacity-70 shadow-md transition hover:scale-110 hover:border-[var(--accent)] hover:text-[var(--text-strong)] hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation()
                onToggleCollapse()
              }}
              title={isCollapsed ? 'Expand sidebar' : 'Collapse to icons'}
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse to icons'}
            >
              {isCollapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
            </button>
          ) : null}
        </div>
      ) : null}

      {/* Header / Logo */}
      <div className={`flex items-center px-3 py-5 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        <NavLink
          className={`flex items-center gap-2.5 ${isCollapsed ? 'justify-center' : ''}`}
          to="/"
          onClick={onClose}
          title="HabitTrack"
        >
          <Leaf className="shrink-0 text-[var(--accent)]" size={26} fill="currentColor" strokeWidth={1.5} />
          {!isCollapsed ? (
            <span className="truncate text-xl font-bold tracking-tight text-[var(--text-strong)]">
              HabitTrack
            </span>
          ) : null}
        </NavLink>
        {onClose ? (
          <button className="icon-button md:hidden" type="button" onClick={onClose} aria-label="Close navigation">
            <X size={18} />
          </button>
        ) : null}
      </div>

      {/* Navigation Links */}
      <nav className={`mt-4 flex flex-col gap-1 px-2 ${isCollapsed ? 'items-center' : ''}`} aria-label="Primary navigation">
        {navigation.map(({ label, to, icon: Icon, hasSubmenu }) => (
          <NavLink
            className={({ isActive }) =>
              `nav-link ${isActive ? 'nav-link-active' : ''} ${
                isCollapsed ? 'size-11 justify-center !p-0' : 'w-full px-3 py-2.5'
              }`
            }
            end={to === '/'}
            key={to}
            to={to}
            onClick={onClose}
            title={label}
          >
            <Icon size={19} className="shrink-0" strokeWidth={1.8} />
            {!isCollapsed ? (
              <>
                <span className="truncate">{label}</span>
                {hasSubmenu ? <ChevronDown size={14} className="ml-auto text-[var(--text-muted)] opacity-70" /> : null}
              </>
            ) : (
              <span className="sr-only">{label}</span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="flex-1" />

      {/* Quote card (expanded only) */}
      {!isCollapsed ? (
        <div className="relative mx-3 mb-4 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--panel-soft)] p-3.5">
          <p className="text-xs italic leading-relaxed text-[var(--text-muted)]">
            “Better habits<br />A better you.”
          </p>
          <svg className="mt-4 h-12 w-full text-[var(--border-strong)]" viewBox="0 0 200 60" fill="currentColor" aria-hidden="true">
            <path d="M0 60 L45 22 L65 40 L105 6 L150 44 L170 30 L200 60 Z" opacity="0.55" />
          </svg>
        </div>
      ) : null}

      {/* Theme Toggle Button */}
      <div className="p-2">
        <button
          className={`flex items-center rounded-xl border border-[var(--border)] bg-[var(--panel-soft)] text-xs font-medium text-[var(--text-strong)] transition hover:border-[var(--accent)] ${
            isCollapsed ? 'size-11 justify-center' : 'w-full gap-2 px-3 py-2.5'
          }`}
          type="button"
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          <Sun size={16} className={`shrink-0 ${theme === 'light' ? 'text-[var(--accent)]' : 'text-[var(--text-faint)]'}`} />
          <Moon size={16} className={`shrink-0 ${theme === 'dark' ? 'text-[var(--accent)]' : 'text-[var(--text-faint)]'}`} />
          {!isCollapsed ? <span className="ml-auto">{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span> : null}
        </button>
      </div>
    </aside>
  )
}

export function AppShell({
  children,
  month,
  onMonthChange,
  onNextMonth,
  onPreviousMonth,
  onToday,
  theme,
  onToggleTheme,
  onLogout,
}: AppShellProps) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [sidebarWidth, setSidebarWidth] = useState<number>(() => {
    const saved = localStorage.getItem('habittrack-sidebar-width')
    return saved ? Number(saved) : DEFAULT_SIDEBAR_WIDTH
  })
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    return localStorage.getItem('habittrack-sidebar-collapsed') === 'true'
  })
  const [isDragging, setIsDragging] = useState(false)
  const dragStartX = useRef(0)
  const dragStartWidth = useRef(sidebarWidth)

  const effectiveWidth = isCollapsed ? COLLAPSED_SIDEBAR_WIDTH : sidebarWidth

  const handleToggleCollapse = useCallback(() => {
    setIsCollapsed((prev) => {
      const next = !prev
      localStorage.setItem('habittrack-sidebar-collapsed', String(next))
      return next
    })
  }, [])

  const handleStartResize = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    dragStartX.current = e.clientX
    dragStartWidth.current = effectiveWidth
  }

  useEffect(() => {
    if (!isDragging) return
    const handleMouseMove = (e: MouseEvent) => {
      const delta = e.clientX - dragStartX.current
      const newWidth = dragStartWidth.current + delta
      if (newWidth < 115) {
        setIsCollapsed(true)
        localStorage.setItem('habittrack-sidebar-collapsed', 'true')
      } else {
        const clamped = Math.max(MIN_SIDEBAR_WIDTH, Math.min(MAX_SIDEBAR_WIDTH, newWidth))
        setIsCollapsed(false)
        setSidebarWidth(clamped)
        localStorage.setItem('habittrack-sidebar-collapsed', 'false')
        localStorage.setItem('habittrack-sidebar-width', String(clamped))
      }
    }
    const handleMouseUp = () => {
      setIsDragging(false)
    }
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging])

  const [todayDate] = useState(() => new Date())
  const todayFormatted = useMemo(() => format(todayDate, 'EEEE, d MMMM yyyy'), [todayDate])
  const todayShort = useMemo(() => format(todayDate, 'EEE, d MMM yyyy'), [todayDate])

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text)]">
      {/* Desktop Persistent Sidebar with Resizing */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:z-30">
        <Sidebar
          theme={theme}
          onToggleTheme={onToggleTheme}
          width={effectiveWidth}
          isCollapsed={isCollapsed}
          onToggleCollapse={handleToggleCollapse}
          onStartResize={handleStartResize}
          isDragging={isDragging}
        />
      </div>

      {/* Mobile Drawer Sidebar */}
      {isMobileNavOpen ? (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <button
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
            type="button"
            onClick={() => setIsMobileNavOpen(false)}
            aria-label="Close navigation overlay"
          />
          <div className="relative h-full shadow-2xl shadow-slate-950/50">
            <Sidebar
              theme={theme}
              onToggleTheme={onToggleTheme}
              width={DEFAULT_SIDEBAR_WIDTH}
              isCollapsed={false}
              onClose={() => setIsMobileNavOpen(false)}
            />
          </div>
        </div>
      ) : null}

      {/* Main Content Area */}
      <div
        className="transition-[padding] duration-150 ease-out"
        style={{ paddingLeft: typeof window !== 'undefined' && window.innerWidth >= 768 ? `${effectiveWidth}px` : 0 }}
      >
        <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--background)]/90 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
            <h1 className="sr-only">HabitTrack dashboard</h1>

            {/* Left Controls: Sidebar toggle, Month Picker */}
            <div className="flex min-w-0 items-center gap-2">
              <span className="md:hidden">
                <button
                  className="box-button"
                  type="button"
                  onClick={() => setIsMobileNavOpen(true)}
                  aria-label="Open navigation"
                >
                  <Menu size={18} />
                </button>
              </span>
              <button
                className="box-button hidden md:inline-flex"
                type="button"
                onClick={handleToggleCollapse}
                title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar to icons'}
                aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar to icons'}
              >
                {isCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
              </button>
              <button className="box-button" type="button" onClick={onPreviousMonth} aria-label="Previous month">
                <ChevronLeft size={16} />
              </button>
              <MonthPicker month={month} onChange={onMonthChange} />
              <button className="box-button" type="button" onClick={onNextMonth} aria-label="Next month">
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Center/Right: Today's Date Indicator & Action Buttons */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Feature 1: Prominent display of Today's Date */}
              <button
                type="button"
                onClick={onToday}
                className="hidden md:flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--panel)] px-3 py-1.5 text-xs text-[var(--text-strong)] transition hover:border-[var(--accent)] shadow-sm"
                title={`Jump to today (${todayFormatted})`}
              >
                <Calendar className="text-[var(--accent)] shrink-0" size={14} />
                <span className="text-[var(--text-muted)]">Today:</span>
                <span className="font-semibold">{todayShort}</span>
              </button>

              <button className="box-button" type="button" onClick={onToday} title="Go to current month">
                <Search size={14} className="hidden sm:block" />
                Today
              </button>

              <button
                className="box-button hidden sm:inline-flex"
                type="button"
                onClick={onToggleTheme}
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {theme === 'dark' ? <CalendarDays size={16} /> : <Sun size={16} />}
              </button>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  className="flex items-center gap-2 rounded-xl px-2 py-1 text-sm font-medium text-[var(--text-strong)] transition hover:bg-[var(--panel-soft)]"
                  type="button"
                  onClick={() => setMenuOpen((open) => !open)}
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                >
                  <span className="flex size-8 items-center justify-center rounded-full bg-[var(--accent)] text-xs font-bold text-[var(--accent-contrast)]">
                    A
                  </span>
                  <span className="hidden sm:inline">Aniket</span>
                  <ChevronDown size={14} />
                </button>
                {menuOpen ? (
                  <div className="card absolute right-0 mt-2 w-44 p-1 z-50 shadow-xl" role="menu">
                    <div className="px-3 py-2 border-b border-[var(--border)] text-xs text-[var(--text-muted)]">
                      Signed in as <strong className="block text-[var(--text-strong)]">Aniket</strong>
                    </div>
                    <button
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--text-strong)] hover:bg-[var(--panel-soft)] mt-1"
                      type="button"
                      role="menuitem"
                      onClick={onLogout}
                      aria-label="Sign out"
                    >
                      <LogOut size={15} /> Sign out
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </header>

        {/* Full-width container utilizing the red area without giant empty gaps */}
        <main className="w-full px-4 pb-8 pt-3 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  )
}

function MonthPicker({ month, onChange }: { month: Date; onChange: (month: Date) => void }) {
  const handleChange = (value: string) => {
    const parsedMonth = parse(value, 'yyyy-MM', new Date())
    if (isValid(parsedMonth)) onChange(startOfMonth(parsedMonth))
  }

  return (
    <label className="month-picker box-button">
      <span className="sr-only">Choose month and year</span>
      <input
        aria-label="Choose month and year"
        type="month"
        value={format(month, 'yyyy-MM')}
        onChange={(event) => handleChange(event.target.value)}
      />
    </label>
  )
}