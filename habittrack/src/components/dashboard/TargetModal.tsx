import { useState } from 'react'
import { addDays, endOfMonth, format } from 'date-fns'
import { Calendar, CalendarClock, Sparkles, X } from 'lucide-react'
import { calculateCountdown, type UserTarget } from '../../hooks/useUserTargets'

type TargetModalProps = {
  target: UserTarget
  onClose: () => void
  onSave: (targetId: string, updates: { title: string; targetDate: string }) => void
}

export function TargetModal({ target, onClose, onSave }: TargetModalProps) {
  const [title, setTitle] = useState(target.title)
  const [targetDate, setTargetDate] = useState(target.targetDate)

  const countdown = calculateCountdown(targetDate)

  const handlePreset = (presetDays: number) => {
    const nextDate = addDays(new Date(), presetDays)
    setTargetDate(format(nextDate, 'yyyy-MM-dd'))
  }

  const handleEndOfMonth = () => {
    const nextDate = endOfMonth(new Date())
    setTargetDate(format(nextDate, 'yyyy-MM-dd'))
  }

  const handleWinterArc = () => {
    const currentYear = new Date().getFullYear()
    setTargetDate(`${currentYear}-12-31`)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !targetDate) return
    onSave(target.id, {
      title: title.trim(),
      targetDate,
    })
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        className="w-full max-w-md rounded-3xl border border-[var(--border)] bg-[var(--panel)] p-6 shadow-2xl space-y-5"
        role="dialog"
        aria-modal="true"
        aria-labelledby="target-modal-title"
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-blue-500/15 text-blue-400">
              <CalendarClock size={20} />
            </span>
            <div>
              <h2 className="text-lg font-bold text-[var(--text-strong)]" id="target-modal-title">
                Set Countdown Target
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                Choose a title and target date for your countdown
              </p>
            </div>
          </div>
          <button
            className="icon-button"
            type="button"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="target-name" className="block text-xs font-semibold text-[var(--text-muted)] mb-1.5">
              Target Name
            </label>
            <input
              id="target-name"
              type="text"
              className="field w-full"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Winter Arc 2026, Marathon, Exam"
              required
              autoFocus
            />
          </div>

          <div>
            <label htmlFor="target-date" className="block text-xs font-semibold text-[var(--text-muted)] mb-1.5">
              Target Date
            </label>
            <div className="relative">
              <input
                id="target-date"
                type="date"
                className="field w-full cursor-pointer"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div>
            <p className="text-[11px] font-semibold text-[var(--text-muted)] mb-2 flex items-center gap-1">
              <Sparkles size={12} className="text-[var(--accent)]" /> Quick Presets
            </p>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => handlePreset(30)}
                className="rounded-lg border border-[var(--border)] bg-[var(--panel-soft)] px-2.5 py-1 text-xs text-[var(--text-strong)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition"
              >
                +30 Days
              </button>
              <button
                type="button"
                onClick={() => handlePreset(60)}
                className="rounded-lg border border-[var(--border)] bg-[var(--panel-soft)] px-2.5 py-1 text-xs text-[var(--text-strong)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition"
              >
                +60 Days
              </button>
              <button
                type="button"
                onClick={() => handlePreset(90)}
                className="rounded-lg border border-[var(--border)] bg-[var(--panel-soft)] px-2.5 py-1 text-xs text-[var(--text-strong)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition"
              >
                +90 Days
              </button>
              <button
                type="button"
                onClick={handleWinterArc}
                className="rounded-lg border border-[var(--border)] bg-[var(--panel-soft)] px-2.5 py-1 text-xs text-[var(--text-strong)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition"
              >
                Winter Arc (Dec 31)
              </button>
              <button
                type="button"
                onClick={handleEndOfMonth}
                className="rounded-lg border border-[var(--border)] bg-[var(--panel-soft)] px-2.5 py-1 text-xs text-[var(--text-strong)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition"
              >
                End of Month
              </button>
            </div>
          </div>

          {/* Live Preview Box */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--panel-soft)] p-3 text-xs flex items-center justify-between">
            <span className="text-[var(--text-muted)] flex items-center gap-1.5">
              <Calendar size={14} className="text-blue-400" />
              <span>Target: <strong className="text-[var(--text-strong)]">{countdown.formattedDate || 'None'}</strong></span>
            </span>
            <span className="font-bold text-blue-400 text-sm">
              {countdown.isToday ? 'Today! 🎯' : countdown.isPast ? countdown.label : `${countdown.days} days left`}
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="box-button"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-bold text-slate-950 transition hover:opacity-95"
            >
              Save Target
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}
