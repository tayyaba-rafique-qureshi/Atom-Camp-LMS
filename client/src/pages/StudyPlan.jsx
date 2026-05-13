import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { generateStudyPlan, getStudyPlan, getLearner } from '../api'
import { getLearnerId } from '../auth'

const ACTIVITY = {
  review:      { color: 'var(--color-ac-blue)',   bg: 'rgba(59,130,246,0.12)',  label: 'Review',      icon: '📖' },
  practice:    { color: 'var(--color-ac-green)',  bg: 'rgba(34,197,94,0.12)',   label: 'Practice',    icon: '💪' },
  new_concept: { color: 'var(--color-ac-purple)', bg: 'rgba(168,85,247,0.12)',  label: 'New Concept', icon: '💡' },
  rest:        { color: 'var(--color-ac-muted)',  bg: 'rgba(139,148,158,0.12)', label: 'Rest Day',    icon: '😴' },
}

const DAYS_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

function DayCard({ day, index }) {
  const a = ACTIVITY[day.activity_type] || ACTIVITY.rest
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      style={{ background: a.bg, border: `1px solid ${a.color}25` }}
      className="rounded-2xl p-5"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{a.icon}</span>
          <div>
            <p style={{ color: 'var(--color-ac-subtext)' }} className="text-xs font-semibold uppercase tracking-wide">
              {day.day}
            </p>
            <span
              style={{ background: `${a.color}20`, color: a.color }}
              className="text-xs px-2 py-0.5 rounded-full font-medium"
            >
              {a.label}
            </span>
          </div>
        </div>
        <div
          style={{ background: 'var(--color-ac-surface)', border: '1px solid var(--color-ac-border)' }}
          className="rounded-lg px-3 py-1.5 text-center"
        >
          <p style={{ color: 'var(--color-ac-text)' }} className="text-sm font-bold">{day.duration_minutes}</p>
          <p style={{ color: 'var(--color-ac-subtext)' }} className="text-xs">min</p>
        </div>
      </div>
      <p style={{ color: 'var(--color-ac-text)' }} className="text-sm font-semibold mb-1">{day.topic}</p>
      {day.reason && (
        <p style={{ color: 'var(--color-ac-muted)' }} className="text-xs leading-relaxed">{day.reason}</p>
      )}
    </motion.div>
  )
}

export default function StudyPlan() {
  const navigate = useNavigate()
  const learnerId = getLearnerId()
  const [plan, setPlan] = useState(null)
  const [learner, setLearner] = useState(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')
  const [week, setWeek] = useState(1)

  useEffect(() => {
    if (!learnerId) { navigate('/login'); return }
    Promise.all([getStudyPlan(learnerId), getLearner(learnerId)])
      .then(([p, l]) => {
        if (p.data.data) setPlan(p.data.data)
        setLearner(l.data.data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [learnerId, navigate])

  async function handleGenerate() {
    setGenerating(true)
    setError('')
    try {
      const res = await generateStudyPlan({ learnerId, week })
      setPlan(res.data.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Generation failed. Try again.')
    } finally {
      setGenerating(false)
    }
  }

  const burnoutScore = learner?.burnoutScore ?? 0
  const burnoutLabel = learner?.burnoutLabel ?? 'healthy'
  const burnoutColor = burnoutScore >= 70 ? 'var(--color-ac-red)' : burnoutScore >= 40 ? 'var(--color-ac-amber)' : 'var(--color-ac-green)'

  const sortedDays = plan?.days
    ? [...plan.days].sort((a, b) => DAYS_ORDER.indexOf(a.day) - DAYS_ORDER.indexOf(b.day))
    : []

  return (
    <div style={{ background: 'var(--color-ac-navy)' }} className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div
              style={{ background: 'rgba(168,85,247,0.15)', color: 'var(--color-ac-purple)' }}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
            >
              📅
            </div>
            <div>
              <h1 style={{ color: 'var(--color-ac-text)' }} className="text-2xl font-bold">AI Study Planner</h1>
              <p style={{ color: 'var(--color-ac-subtext)' }} className="text-sm">
                Adaptive weekly schedule based on your skill gaps and wellbeing
              </p>
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="space-y-4">
            <div className="skeleton h-24 rounded-2xl" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1,2,3,4,5].map(i => <div key={i} className="skeleton h-40 rounded-2xl" />)}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Context cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="card-sm">
                <p style={{ color: 'var(--color-ac-subtext)' }} className="text-xs mb-1">Study hours/week</p>
                <p style={{ color: 'var(--color-ac-orange)' }} className="text-xl font-bold">{learner?.weeklyStudyHours ?? '—'}h</p>
              </div>
              <div className="card-sm">
                <p style={{ color: 'var(--color-ac-subtext)' }} className="text-xs mb-1">Burnout risk</p>
                <p style={{ color: burnoutColor }} className="text-xl font-bold capitalize">{burnoutLabel?.replace('_', ' ')}</p>
              </div>
              <div className="card-sm">
                <p style={{ color: 'var(--color-ac-subtext)' }} className="text-xs mb-1">Risk score</p>
                <p style={{ color: burnoutColor }} className="text-xl font-bold">{burnoutScore}/100</p>
              </div>
              <div className="card-sm">
                <p style={{ color: 'var(--color-ac-subtext)' }} className="text-xs mb-1">Plan week</p>
                <div className="flex items-center gap-2">
                  <input
                    type="number" min="1" max="52"
                    className="input py-1 px-2 text-sm w-16"
                    value={week}
                    onChange={(e) => setWeek(Number(e.target.value))}
                  />
                </div>
              </div>
            </div>

            {/* Generate button */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleGenerate}
                disabled={generating}
                className="btn-primary"
              >
                {generating ? (
                  <>
                    <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                    </svg>
                    Generating plan...
                  </>
                ) : (
                  `${plan ? '↻ Regenerate' : '✨ Generate'} Week ${week} Plan`
                )}
              </button>
              {plan && (
                <span style={{ color: 'var(--color-ac-subtext)' }} className="text-xs">
                  {plan.total_hours}h total · {sortedDays.length} days
                </span>
              )}
            </div>

            {error && (
              <div
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--color-ac-red)' }}
                className="rounded-xl px-4 py-3 text-sm"
              >
                {error}
              </div>
            )}

            {/* Plan */}
            <AnimatePresence>
              {plan && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  {/* Week summary */}
                  <div className="card">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">📋</span>
                      <div>
                        <p style={{ color: 'var(--color-ac-subtext)' }} className="text-xs font-medium uppercase tracking-wide mb-1">
                          Week {week} Summary
                        </p>
                        <p style={{ color: 'var(--color-ac-text)' }} className="text-sm leading-relaxed">
                          {plan.week_summary}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Activity type legend */}
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(ACTIVITY).map(([key, a]) => (
                      <div key={key} className="flex items-center gap-1.5">
                        <span className="text-sm">{a.icon}</span>
                        <span style={{ color: a.color }} className="text-xs font-medium">{a.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Day cards grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sortedDays.map((d, i) => (
                      <DayCard key={i} day={d} index={i} />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!plan && !generating && (
              <div
                style={{ background: 'var(--color-ac-surface)', border: '2px dashed var(--color-ac-border)' }}
                className="rounded-2xl p-12 text-center"
              >
                <span className="text-5xl block mb-4">📅</span>
                <p style={{ color: 'var(--color-ac-text)' }} className="text-sm font-semibold mb-2">
                  No study plan yet
                </p>
                <p style={{ color: 'var(--color-ac-subtext)' }} className="text-xs">
                  Click "Generate Plan" to create your AI-powered weekly schedule
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
