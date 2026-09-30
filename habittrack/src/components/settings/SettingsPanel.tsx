import { format } from 'date-fns'
import { Download, FileUp, RotateCcw } from 'lucide-react'
import { useState, type ChangeEvent } from 'react'
import { useAppData } from '../../hooks/useAppData'

export function SettingsPanel() {
  const { data, resetDemoData, replaceData } = useAppData()
  const [message, setMessage] = useState('')

  const exportData = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `habittrack-backup-${format(new Date(), 'yyyy-MM-dd')}.json`
    link.click()
    URL.revokeObjectURL(url)
    setMessage('Backup exported successfully.')
  }

  const importData = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const valid = replaceData(JSON.parse(String(reader.result)))
        setMessage(valid ? 'Backup restored successfully.' : 'This backup is not a valid HabitTrack file.')
      } catch {
        setMessage('That file could not be read as JSON.')
      }
      event.target.value = ''
    }
    reader.readAsText(file)
  }

  return <section className="mt-6 space-y-4"><div className="rounded-3xl border border-[var(--border)] bg-[var(--panel)] p-5 shadow-[var(--shadow)] sm:p-6"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--accent)]">Data portability</p><h2 className="mt-1 text-xl font-semibold text-[var(--text-strong)]">Backups and local data</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">Export your raw habits, completion logs, expenses, and settings as JSON. Imports are validated before replacing this workspace.</p><div className="mt-5 flex flex-wrap gap-3"><button className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-bold text-slate-950" type="button" onClick={exportData}><Download size={17} /> Export data</button><label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[var(--border-strong)] px-4 py-2.5 text-sm font-semibold text-[var(--text-strong)]"><FileUp size={17} /> Import data<input className="sr-only" type="file" accept="application/json,.json" onChange={importData} /></label><button className="inline-flex items-center gap-2 rounded-xl border border-rose-400/30 px-4 py-2.5 text-sm font-semibold text-rose-400" type="button" onClick={() => { if (window.confirm('Reset all local data to the demo workspace?')) { resetDemoData(); setMessage('Demo data restored.') } }}><RotateCcw size={17} /> Reset demo data</button></div>{message ? <p className="mt-4 text-sm font-semibold text-[var(--accent)]" role="status">{message}</p> : null}</div><div className="grid gap-4 sm:grid-cols-2"><div className="rounded-2xl border border-[var(--border)] bg-[var(--panel-soft)] p-5"><p className="text-xs uppercase tracking-[0.12em] text-[var(--text-faint)]">Theme</p><p className="mt-3 text-sm font-semibold text-[var(--text-strong)]">Use the header toggle to switch dark and light mode.</p></div><div className="rounded-2xl border border-[var(--border)] bg-[var(--panel-soft)] p-5"><p className="text-xs uppercase tracking-[0.12em] text-[var(--text-faint)]">Currency</p><p className="mt-3 text-sm font-semibold text-[var(--text-strong)]">Indian Rupee (INR)</p></div></div></section>
}