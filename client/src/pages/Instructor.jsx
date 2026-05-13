import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getAllLearners, analyzeBurnout } from '../api'

const BURNOUT_STYLE = {
  healthy:  { color: 'var(--color-ac-green)',  bg: 'rgba(34,197,94,0.12)',  label: 'Healthy' },
  at_risk:  { color: 'var(--color-ac-amber)',  bg: 'rgba(245,158,11,0.12)', label: 'At Risk' },
  critical: { color: 'var(--color-ac-red)',    bg: 'rgba(239,68,68,0.12)',  label: 'Critical' },
}

function LearnerCard({ learner, onRefresh }) {
  const [refreshing, setRefreshing] = useState(false)
  const b = BURNOUT_STYLE[learner.burnoutLabel] || BURNOUT_STYLE.healthy

  async function handleRefresh() {
    setRefreshing(true)
    try { await onRefresh(learner._id) } finally { setRefreshing(false) }
  }

  return (
    <div className="card">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            style={{ background: 'var(--color-ac-orange-t)', color: 'var(--color-ac-orange)' }}
            className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
          >
            {learner.name?.charAt(0)?.toUpperCase()}
          </div>
          <div>
            <p style={{ color: 'var(--color-ac-text)' }} className="text-sm font-semibold">{learner.name}</p>
            <p style={{ color: 'var(--color-ac-subtext)' }} className="text-xs">{learner.email}</p>
          </div>
        </div>
        <span
          style={{ background: b.bg, color: b.color }}
          className="text-xs px-2.5 py-1 rounded-full font-semibold capitalize"
        >
          {b.label}
        </span>
      </div>

      {/* Burnout bar */}
      <div className="mb-3">
        <div className="flex justify-between mb-1.5">
          <span style={{ color: 'var(--color-ac-subtext)' }} className="text-xs">Burnout risk</span>
          <span style={{ color: b.color }} className="text-xs font-bold">{learner.burnoutScore}/100</span>
        </div>
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${learner.burnoutScore}%`, background: b.color }}
          />
        </div>
      </div>

      {/* Stats */}
      <div
        style={{ background: 'var(--color-ac-dark)', border: '1px solid var(--color-ac-border)' }}
        className="rounded-xl p-3 grid grid-cols-2 gap-2 mb-3"
      >
        <div>
          <p style={{ color: 'var(--color-ac-subtext)' }} className="text-xs">Attendance</p>
          <p style={{ color: 'var(--color-ac-text)' }} className="text-sm font-semibold">{learner.attendanceRate}%</p>
        </div>
        <div>
          <p style={{ color: 'var(--color-ac-subtext)' }} className="text-xs">Learning style</p>
          <p style={{ color: 'var(--color-ac-text)' }} className="text-sm font-semibold capitalize">{learner.learningStyle}</p>
        </div>
        <div>
          <p style={{ color: 'var(--color-ac-subtext)' }} className="text-xs">Study hours/wk</p>
          <p style={{ color: 'var(--color-ac-text)' }} className="text-sm font-semibold">{learner.weeklyStudyHours}h</p>
        </div>
        <div>
          <p style={{ color: 'var(--color-ac-subtext)' }} className="text-xs">Goal</p>
          <p style={{ color: 'var(--color-ac-text)' }} className="text-xs font-medium truncate">{learner.goal || '—'}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={handleRefresh}
        disabled={refreshing}
        style={{ color: 'var(--color-ac-subtext)' }}
        className="text-xs hover:text-orange-400 transition-colors disabled:opacity-40"
      >
        {refreshing ? '⏳ Analyzing...' : '↻ Refresh burnout analysis'}
      </button>
    </div>
  )
}

export default function Instructor() {
  const [learners, setLearners] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    getAllLearners()
      .then((r) => setLearners(r.data.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  async function refreshBurnout(id) {
    await analyzeBurnout(id)
    const res = await getAllLearners()
    setLearners(res.data.data)
  }

  const atRisk = learners.filter((l) => ['at_risk', 'critical'].includes(l.burnoutLabel))
  const critical = learners.filter((l) => l.burnoutLabel === 'critical')

  const filtered = filter === 'all' ? learners
    : filter === 'at_risk' ? atRisk
    : critical

  if (loading)
    return (
      <div style={{ background: 'var(--color-ac-navy)' }} className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="skeleton w-48 h-4 rounded mx-auto mb-3" />
          <div className="skeleton w-32 h-3 rounded mx-auto" />
        </div>
      </div>
    )

  return (
    <div style={{ background: 'var(--color-ac-navy)' }} className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 style={{ color: 'var(--color-ac-text)' }} className="text-2xl font-bold mb-1">
            Instructor Dashboard
          </h1>
          <p style={{ color: 'var(--color-ac-subtext)' }} className="text-sm">
            {learners.length} learners · {atRisk.length} need attention
          </p>
        </motion.div>

        {/* Alert banner */}
        {critical.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}
            className="rounded-2xl p-4 mb-6"
          >
            <p style={{ color: 'var(--color-ac-red)' }} className="text-sm font-semibold mb-2">
              🚨 {critical.length} learner{critical.length > 1 ? 's' : ''} at critical burnout risk
            </p>
            <div className="flex flex-wrap gap-2">
              {critical.map((l) => (
                <span
                  key={l._id}
                  style={{ background: 'rgba(239,68,68,0.15)', color: 'var(--color-ac-red)', border: '1px solid rgba(239,68,68,0.3)' }}
                  className="text-xs px-3 py-1.5 rounded-full font-medium"
                >
                  {l.name} · {l.burnoutScore}%
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Total learners', value: learners.length, color: 'var(--color-ac-orange)' },
            { label: 'At risk', value: atRisk.length, color: 'var(--color-ac-amber)' },
            { label: 'Critical', value: critical.length, color: 'var(--color-ac-red)' },
          ].map((s) => (
            <div key={s.label} className="card-sm text-center">
              <p style={{ color: s.color }} className="text-2xl font-bold">{s.value}</p>
              <p style={{ color: 'var(--color-ac-subtext)' }} className="text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-5">
          {[
            { id: 'all', label: `All (${learners.length})` },
            { id: 'at_risk', label: `At Risk (${atRisk.length})` },
            { id: 'critical', label: `Critical (${critical.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              style={{
                background: filter === tab.id ? 'var(--color-ac-orange-t)' : 'var(--color-ac-surface)',
                color: filter === tab.id ? 'var(--color-ac-orange)' : 'var(--color-ac-muted)',
                border: `1px solid ${filter === tab.id ? 'var(--color-ac-orange)' : 'var(--color-ac-border)'}`,
              }}
              className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all"
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Learner grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((l, i) => (
            <motion.div
              key={l._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <LearnerCard learner={l} onRefresh={refreshBurnout} />
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div
            style={{ background: 'var(--color-ac-surface)', border: '1px solid var(--color-ac-border)' }}
            className="rounded-2xl p-12 text-center"
          >
            <span className="text-4xl block mb-3">✅</span>
            <p style={{ color: 'var(--color-ac-text)' }} className="text-sm font-semibold">
              {filter === 'all' ? 'No learners yet' : 'No learners in this category'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
