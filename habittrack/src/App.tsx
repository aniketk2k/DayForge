import { useEffect, useState } from 'react'
import { addMonths, format, startOfMonth } from 'date-fns'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './index.css'
import { endSession, isAuthenticated, startSession } from './auth/auth'
import { AppShell } from './components/layout/AppShell'
import { AppDataProvider } from './context/AppDataProvider'
import { ToastProvider } from './context/ToastProvider'
import { useAppData } from './hooks/useAppData'
import { LoginPage } from './pages/LoginPage'
import { PlaceholderPage } from './pages/PlaceholderPage'
import { WelcomePage } from './pages/WelcomePage'

type Theme = 'dark' | 'light'

function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => localStorage.getItem('habittrack-theme') === 'light' ? 'light' : 'dark')
  useEffect(() => { document.documentElement.dataset.theme = theme; localStorage.setItem('habittrack-theme', theme) }, [theme])
  return { theme, toggleTheme: () => setTheme((current) => current === 'dark' ? 'light' : 'dark') }
}

function App() {
  const { theme, toggleTheme } = useTheme()
  const [authenticated, setAuthenticated] = useState(isAuthenticated)

  if (!authenticated) return <LoginPage onLogin={() => { startSession(); setAuthenticated(true) }} />

  return <ToastProvider><AppDataProvider><BrowserRouter><Workspace theme={theme} onToggleTheme={toggleTheme} onLogout={() => { endSession(); setAuthenticated(false) }} /></BrowserRouter></AppDataProvider></ToastProvider>
}

function Workspace({ theme, onToggleTheme, onLogout }: { theme: Theme; onToggleTheme: () => void; onLogout: () => void }) {
  const { isFirstRun, chooseFirstRun } = useAppData()
  const [selectedMonth, setSelectedMonth] = useState(() => startOfMonth(new Date(2026, 8, 1)))

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      if (target?.matches('input, textarea, select, button')) return
      if (!event.altKey) return
      if (event.key === 'ArrowLeft') setSelectedMonth((month) => addMonths(month, -1))
      if (event.key === 'ArrowRight') setSelectedMonth((month) => addMonths(month, 1))
      if (event.key.toLowerCase() === 't') setSelectedMonth(startOfMonth(new Date()))
    }
    window.addEventListener('keydown', handleShortcut)
    return () => window.removeEventListener('keydown', handleShortcut)
  }, [])

  if (isFirstRun) return <WelcomePage onChoose={chooseFirstRun} />

  const monthLabel = format(selectedMonth, 'MMMM yyyy')
  const moveMonth = (amount: number) => setSelectedMonth((month) => addMonths(month, amount))
  return <AppShell month={selectedMonth} onMonthChange={setSelectedMonth} onNextMonth={() => moveMonth(1)} onPreviousMonth={() => moveMonth(-1)} onToday={() => setSelectedMonth(startOfMonth(new Date()))} theme={theme} onToggleTheme={onToggleTheme} onLogout={onLogout}><Routes><Route path="/" element={<PlaceholderPage page="Dashboard" month={selectedMonth} monthLabel={monthLabel} />} /><Route path="/habits" element={<PlaceholderPage page="Habits" month={selectedMonth} monthLabel={monthLabel} />} /><Route path="/expenses" element={<PlaceholderPage page="Expenses" month={selectedMonth} monthLabel={monthLabel} />} /><Route path="/analytics" element={<PlaceholderPage page="Analytics" month={selectedMonth} monthLabel={monthLabel} />} /><Route path="/yearly-overview" element={<PlaceholderPage page="Yearly Overview" month={selectedMonth} monthLabel={monthLabel} onSelectMonth={setSelectedMonth} />} /><Route path="/settings" element={<PlaceholderPage page="Settings" month={selectedMonth} monthLabel={monthLabel} />} /><Route path="*" element={<Navigate to="/" replace />} /></Routes></AppShell>
}

export default App