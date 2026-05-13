import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getAllLearners } from '../api'

const LEARNING_STYLES = ['visual', 'auditory', 'reading', 'kinesthetic']
const STYLE_ICONS = { visual: '👁️', auditory: '👂', reading: '📖', kinesthetic: '🤲' }

export default function AdminDashboard() {
  const [learners, setLearners] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllLearners()
      .then((r) => setLearners(r.data.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const burnout = {
    healthy:  learners.filter((l) => l.burnoutLabel === 'healthy').length,
    at_risk:  learners.filter((l) => l.burnoutLabel === 'at_risk').length,
    critical: learners.filter((l) => l.burnoutLabel === 'critical').length,
  }

  const styles = LEARNING_STYLES.map((s) => ({
    style: s,
    count: learners.filter((l) => l.learningStyle === s).length,
    pct: learners.length ? Math.round((learners.filter((l) => l.learningStyle === s).length / learners.length) * 100) : 0,
  }))

  const avgBurnout = learners.length
    ? Math.round(learners.reduce((s, l) => s + (l.burnoutScore || 0), 0) / learners.length)
    : 0

  if (loading)
    return (
      <div style={{ background: 'var(--color-ac-navy)' }} className="min-h-screen flex items-center justify-center">
        <div className="skeleton w-48 h-4 rounded" />
      </div>
    )

  return (
    <div style={{ background: 'var(--color-ac-navy)' }} className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 style={{ color: 'var(--color-ac-text)' }} className="text-2xl font-bold mb-1">Admin Dashboard</h1>
          <p style={{ color: 'var(--color-ac-subtext)' }} className="text-sm">Platform overview</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Total learners', value: learners.length, color: 'var(--color-ac-orange)' },
            { label: 'Healthy', value: burnout.healthy, color: 'var(--color-ac-green)' },
            { label: 'At risk', value: burnout.at_risk, color: 'var(--color-ac-amber)' },
            { label: 'Critical', value: burnout.critical, color: 'var(--color-ac-red)' },
          ].map((s) => (
            <div key={s.label} className="card-sm text-center">
              <p style={{ color: s.color }} className="text-2xl font-bold">{s.value}</p>
              <p style={{ color: 'var(--color-ac-subtext)' }} className="text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Learning styles */}
          <div className="card">
            <p style={{ color: 'var(--color-ac-subtext)' }} className="text-xs font-medium uppercase tracking-wide mb-4">
              Learning Style Breakdown
            </p>
            <div className="space-y-4">
              {styles.map((s) => (
                <div key={s.style}>
                  <div className="flex justify-between mb-1.5">
                    <span style={{ color: 'var(--color-ac-muted)' }} className="text-xs capitalize">
                      {STYLE_ICONS[s.style]} {s.style}
                    </span>
                    <span style={{ color: 'var(--color-ac-text)' }} className="text-xs font-semibold">
                      {s.count} ({s.pct}%)
                    </span>
                  </div>
                  <div className="progress-track">
                    <motion.div
                      className="progress-fill"
                      style={{ background: 'var(--color-ac-orange)' }}
                      initial={{ width: 0 }}
                      animate={{ width: `${s.pct}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{ borderTop: '1px solid var(--color-ac-border)' }}
              className="mt-4 pt-4 flex items-center justify-between"
            >
              <span style={{ color: 'var(--color-ac-subtext)' }} className="text-xs">Avg burnout score</span>
              <span
                style={{ color: avgBurnout >= 70 ? 'var(--color-ac-red)' : avgBurnout >= 40 ? 'var(--color-ac-amber)' : 'var(--color-ac-green)' }}
                className="text-sm font-bold"
              >
                {avgBurnout}/100
              </span>
            </div>
          </div>

          {/* Learner list */}
          <div className="card">
            <p style={{ color: 'var(--color-ac-subtext)' }} className="text-xs font-medium uppercase tracking-wide mb-4">
              All Learners
            </p>
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {learners.map((l) => {
                const bColor = l.burnoutLabel === 'critical' ? 'var(--color-ac-red)'
                  : l.burnoutLabel === 'at_risk' ? 'var(--color-ac-amber)'
                  : 'var(--color-ac-green)'
                return (
                  <div
                    key={l._id}
                    style={{ background: 'var(--color-ac-dark)', border: '1px solid var(--color-ac-border)' }}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5"
                  >
                    <div
                      style={{ background: 'var(--color-ac-orange-t)', color: 'var(--color-ac-orange)' }}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                    >
                      {l.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p style={{ color: 'var(--color-ac-text)' }} className="text-xs font-medium truncate">{l.name}</p>
                      <p style={{ color: 'var(--color-ac-subtext)' }} className="text-xs truncate">{l.email}</p>
                    </div>
                    <span
                      style={{ background: `${bColor}15`, color: bColor }}
                      className="text-xs px-2 py-0.5 rounded-full capitalize shrink-0 font-medium"
                    >
                      {l.burnoutLabel?.replace('_', ' ') || 'healthy'}
                    </span>
                  </div>
                )
              })}
              {learners.length === 0 && (
                <p style={{ color: 'var(--color-ac-subtext)' }} className="text-xs text-center py-8">
                  No learners registered yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
