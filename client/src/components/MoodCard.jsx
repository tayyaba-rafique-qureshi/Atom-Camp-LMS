import { motion } from 'framer-motion'

const MOOD = {
  motivated:   { emoji: '🚀', color: 'var(--color-ac-green)',  bg: 'rgba(34,197,94,0.12)',  label: 'Motivated' },
  anxious:     { emoji: '😰', color: 'var(--color-ac-amber)',  bg: 'rgba(245,158,11,0.12)', label: 'Anxious' },
  overwhelmed: { emoji: '😓', color: 'var(--color-ac-red)',    bg: 'rgba(239,68,68,0.12)',  label: 'Overwhelmed' },
  disengaged:  { emoji: '😶', color: 'var(--color-ac-muted)',  bg: 'rgba(139,148,158,0.12)',label: 'Disengaged' },
  neutral:     { emoji: '😐', color: 'var(--color-ac-blue)',   bg: 'rgba(59,130,246,0.12)', label: 'Neutral' },
}

export default function MoodCard({ checkIns = [] }) {
  if (!checkIns.length)
    return (
      <div className="card h-full flex flex-col justify-center items-center text-center py-8">
        <span className="text-4xl mb-3">💬</span>
        <p style={{ color: 'var(--color-ac-text)' }} className="text-sm font-semibold mb-1">No check-ins yet</p>
        <p style={{ color: 'var(--color-ac-subtext)' }} className="text-xs">
          Complete your first weekly check-in to see mood insights here.
        </p>
      </div>
    )

  const latest = checkIns[0]
  const m = MOOD[latest.mood] || MOOD.neutral

  return (
    <div className="card h-full">
      <p style={{ color: 'var(--color-ac-subtext)' }} className="text-xs font-medium uppercase tracking-wide mb-4">
        Latest Mood
      </p>

      {/* Latest mood card */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        style={{ background: m.bg, border: `1px solid ${m.color}30` }}
        className="rounded-xl p-4 mb-4"
      >
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{m.emoji}</span>
          <div>
            <p style={{ color: m.color }} className="font-semibold text-sm">{m.label}</p>
            <p style={{ color: 'var(--color-ac-subtext)' }} className="text-xs">Week {latest.week}</p>
          </div>
          {latest.flagInstructor && (
            <span className="badge badge-amber ml-auto">⚑ Flagged</span>
          )}
        </div>
        <p style={{ color: 'var(--color-ac-muted)' }} className="text-xs leading-relaxed">
          {latest.aiFeedback}
        </p>
      </motion.div>

      {/* Engagement score */}
      <div className="mb-4">
        <div className="flex justify-between mb-1.5">
          <span style={{ color: 'var(--color-ac-subtext)' }} className="text-xs">Engagement score</span>
          <span style={{ color: 'var(--color-ac-text)' }} className="text-xs font-bold">{latest.engagementScore}%</span>
        </div>
        <div className="progress-track">
          <motion.div
            className="progress-fill"
            style={{
              background: latest.engagementScore >= 70 ? 'var(--color-ac-green)' : latest.engagementScore >= 40 ? 'var(--color-ac-amber)' : 'var(--color-ac-red)',
            }}
            initial={{ width: 0 }}
            animate={{ width: `${latest.engagementScore}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* History */}
      {checkIns.length > 1 && (
        <div style={{ borderTop: '1px solid var(--color-ac-border)' }} className="pt-3">
          <p style={{ color: 'var(--color-ac-subtext)' }} className="text-xs mb-2">History</p>
          <div className="flex flex-wrap gap-1.5">
            {checkIns.slice(1, 6).map((c, i) => {
              const s = MOOD[c.mood] || MOOD.neutral
              return (
                <span
                  key={i}
                  style={{ background: s.bg, color: s.color, border: `1px solid ${s.color}30` }}
                  className="text-xs px-2 py-1 rounded-full"
                >
                  {s.emoji} Wk {c.week}
                </span>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
