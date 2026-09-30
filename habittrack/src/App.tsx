import { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { addMonths, format, startOfMonth } from 'date-fns'
import './index.css'
import { AppShell } from './components/layout/AppShell'
import { AppDataProvider } from './context/AppDataProvider'
import { ToastProvider } from './context/ToastProvider'
import { endSession, isAuthenticated, startSession } from './auth/auth'
import { PlaceholderPage } from './pages/PlaceholderPage'
import { LoginPage } from './pages/LoginPage'

type Theme = 'dark' | 'light'

function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const storedTheme = localStorage.getItem('habittrack-theme')
    return storedTheme === 'light' ? 'light' : 'dark'
  })

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('habittrack-theme', theme)
  }, [theme])

  return {
    theme,
    toggleTheme: () => setTheme((current) => (current === 'dark' ? 'light' : 'dark')),
  }
}

function App() {
  const { theme, toggleTheme } = useTheme()
  const [authenticated, setAuthenticated] = useState(isAuthenticated)
  const [selectedMonth, setSelectedMonth] = useState(() => startOfMonth(new Date(2026, 8, 1)))

  const moveMonth = (amount: number) => {
    setSelectedMonth((month) => addMonths(month, amount))
  }

  if (!authenticated) return <LoginPage onLogin={() => { startSession(); setAuthenticated(true) }} />

  return (
    <ToastProvider>
      <AppDataProvider>
        <BrowserRouter>
        <AppShell
          month={selectedMonth}
          onMonthChange={setSelectedMonth}
          onNextMonth={() => moveMonth(1)}
          onPreviousMonth={() => moveMonth(-1)}
          onToday={() => setSelectedMonth(startOfMonth(new Date()))}
          theme={theme}
          onToggleTheme={toggleTheme}
          onLogout={() => { endSession(); setAuthenticated(false) }}
        >
          <Routes>
            <Route path="/" element={<PlaceholderPage page="Dashboard" month={selectedMonth} monthLabel={format(selectedMonth, 'MMMM yyyy')} />} />
            <Route path="/habits" element={<PlaceholderPage page="Habits" month={selectedMonth} monthLabel={format(selectedMonth, 'MMMM yyyy')} />} />
            <Route path="/expenses" element={<PlaceholderPage page="Expenses" month={selectedMonth} monthLabel={format(selectedMonth, 'MMMM yyyy')} />} />
            <Route path="/analytics" element={<PlaceholderPage page="Analytics" month={selectedMonth} monthLabel={format(selectedMonth, 'MMMM yyyy')} />} />
            <Route path="/yearly-overview" element={<PlaceholderPage page="Yearly Overview" month={selectedMonth} monthLabel={format(selectedMonth, 'MMMM yyyy')} onSelectMonth={setSelectedMonth} />} />
            <Route path="/settings" element={<PlaceholderPage page="Settings" month={selectedMonth} monthLabel={format(selectedMonth, 'MMMM yyyy')} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppShell>
        </BrowserRouter>
      </AppDataProvider>
    </ToastProvider>
  )
}

export default App
