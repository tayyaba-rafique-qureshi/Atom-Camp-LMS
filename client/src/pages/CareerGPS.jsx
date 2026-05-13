import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { generateCareerGPS, getCareerRoadmap } from '../api'
import { getLearnerId } from '../auth'

const PRIORITY_STYLE = {
  high:   { color: 'var(--color-ac-red)',    bg: 'rgba(239,68,68,0.12)',   label: 'High Priority' },
  medium: { color: 'var(--color-ac-amber)',  bg: 'rgba(245,158,11,0.12)',  label: 'Medium' },
  low:    { color: 'var(--color-ac-muted)',  bg: 'rgba(139,148,158,0.12)', label: 'Low' },
}

const DEMO_GOAL = 'Become an AI Engineer'
const DEMO_SKILLS = ['Python', 'Math', 'SQL']

function SkeletonRoadmap() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="skeleton h-24 rounded-2xl" />
      ))}
    </div>
  )
}

export default function CareerGPS() {
  const navigate = useNavigate()
  const learnerId = getLearnerId()
  const [goal, setGoal] = useState('')
  const [roadmap, setRoadmap] = useState(null)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState('')
  const [demoMode, setDemoMode] = useState(false)

  useEffect(() => {
    if (!learnerId) { navigate('/login'); return }
    getCareerRoadmap(learnerId)
      .then((r) => { if (r.data.data) setRoadmap(r.data.data) })
      .catch(() => {})
      .finally(() => setFetching(false))
  }, [learnerId, navigate])

  async function handleGenerate(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await generateCareerGPS({ learnerId, goal })
      setRoadmap(res.data.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Generation failed. Check the server and try again.')
    } finally {
      setLoading(false)
    }
  }

  function fillDemo() {
    setGoal(DEMO_GOAL)
    setDemoMode(true)
  }

  if (fetching)
    return (
      <div style={{ background: 'var(--color-ac-navy)' }} className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="skeleton w-48 h-4 rounded mx-auto mb-3" />
          <div className="skeleton w-32 h-3 rounded mx-auto" />
        </div>
      </div>
    )

  const milestones = roadmap?.milestones || []

  return (
    <div style={{ background: 'var(--color-ac-navy)' }} className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div
              style={{ background: 'var(--color-ac-orange-t)', color: 'var(--color-ac-orange)' }}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
            >
              🧭
            </div>
            <div>
              <h1 style={{ color: 'var(--color-ac-text)' }} className="text-2xl font-bold">Career GPS</h1>
              <p style={{ color: 'var(--color-ac-subtext)' }} className="text-sm">
                AI-powered roadmap to your dream role
              </p>
            </div>
          </div>
        </motion.div>

        {/* Input form */}
        {!roadmap && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 style={{ color: 'var(--color-ac-text)' }} className="text-sm font-semibold">
                What's your career goal?
              </h2>
              <button
                type="button"
                onClick={fillDemo}
                style={{ color: 'var(--color-ac-orange)' }}
                className="text-xs hover:underline"
              >
                ⚡ Try demo
              </button>
            </div>

            <form onSubmit={handleGenerate} className="space-y-3">
              <input
                required
                className="input"
                placeholder="e.g. Become an AI Engineer, Data Scientist, Full Stack Developer..."
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
              />
              {demoMode && (
                <div
                  style={{ background: 'var(--color-ac-orange-t)', border: '1px solid var(--color-ac-orange)30' }}
                  className="rounded-lg px-3 py-2 text-xs"
                  style2={{ color: 'var(--color-ac-orange)' }}
                >
                  <span style={{ color: 'var(--color-ac-orange)' }}>⚡ Demo mode: </span>
                  <span style={{ color: 'var(--color-ac-muted)' }}>
                    Using goal "{DEMO_GOAL}" with skills: {DEMO_SKILLS.join(', ')}
                  </span>
                </div>
              )}
              {error && (
                <div
                  style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--color-ac-red)' }}
                  className="rounded-lg px-3 py-2 text-sm"
                >
                  {error}
                </div>
              )}
              <button type="submit" disabled={loading || !goal.trim()} className="btn-primary w-full justify-center">
                {loading ? (
                  <>
                    <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                    </svg>
                    Generating your roadmap...
                  </>
                ) : (
                  '🧭 Generate Roadmap →'
                )}
              </button>
            </form>

            {loading && (
              <div className="mt-6">
                <SkeletonRoadmap />
              </div>
            )}
          </motion.div>
        )}

        {/* Roadmap result */}
        <AnimatePresence>
          {roadmap && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* Goal header */}
              <div className="card">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p style={{ color: 'var(--color-ac-subtext)' }} className="text-xs font-medium uppercase tracking-wide mb-1">
                      Your Goal
                    </p>
                    <h2 style={{ color: 'var(--color-ac-text)' }} className="text-lg font-bold mb-2">
                      {roadmap.goal}
                    </h2>
                    {roadmap.summary && (
                      <p style={{ color: 'var(--color-ac-muted)' }} className="text-sm leading-relaxed">
                        {roadmap.summary}
                      </p>
                    )}
                  </div>
                  <div className="text-center shrink-0">
                    <div
                      style={{ background: 'var(--color-ac-orange-t)', color: 'var(--color-ac-orange)' }}
                      className="rounded-xl px-4 py-3"
                    >
                      <p className="text-2xl font-bold">{roadmap.timeline_weeks}</p>
                      <p className="text-xs">weeks</p>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setRoadmap(null)}
                  style={{ color: 'var(--color-ac-subtext)' }}
                  className="text-xs mt-4 hover:text-orange-400 transition-colors"
                >
                  ← Generate new roadmap
                </button>
              </div>

              {/* Milestones timeline */}
              {milestones.length > 0 && (
                <div className="card">
                  <p style={{ color: 'var(--color-ac-subtext)' }} className="text-xs font-medium uppercase tracking-wide mb-5">
                    Learning Milestones
                  </p>
                  <div className="space-y-0">
                    {milestones.map((m, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="flex gap-4"
                      >
                        {/* Timeline */}
                        <div className="flex flex-col items-center">
                          <div
                            style={{ background: 'var(--color-ac-orange)', color: '#fff' }}
                            className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 z-10"
                          >
                            W{m.week}
                          </div>
                          {i < milestones.length - 1 && (
                            <div style={{ background: 'var(--color-ac-border)' }} className="w-px flex-1 my-1" />
                          )}
                        </div>
                        {/* Content */}
                        <div className="pb-5 flex-1">
                          <p style={{ color: 'var(--color-ac-text)' }} className="text-sm font-semibold mb-2">
                            {m.title}
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {m.skills?.map((s, j) => (
                              <span key={j} className="chip">{s}</span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skill gaps */}
              {roadmap.gaps?.length > 0 && (
                <div className="card">
                  <p style={{ color: 'var(--color-ac-subtext)' }} className="text-xs font-medium uppercase tracking-wide mb-3">
                    Skill Gaps to Close
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {roadmap.gaps.map((g, i) => (
                      <motion.span
                        key={i}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: i * 0.05 }}
                        style={{ background: 'rgba(239,68,68,0.12)', color: 'var(--color-ac-red)', border: '1px solid rgba(239,68,68,0.25)' }}
                        className="text-xs px-3 py-1.5 rounded-full font-medium"
                      >
                        ⚡ {g}
                      </motion.span>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended courses */}
              {roadmap.atomcamp_courses?.length > 0 && (
                <div className="card">
                  <p style={{ color: 'var(--color-ac-subtext)' }} className="text-xs font-medium uppercase tracking-wide mb-3">
                    Recommended atomcamp Courses
                  </p>
                  <div className="space-y-2">
                    {roadmap.atomcamp_courses.map((c, i) => {
                      const p = PRIORITY_STYLE[c.priority] || PRIORITY_STYLE.low
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.06 }}
                          style={{ background: p.bg, border: `1px solid ${p.color}25` }}
                          className="rounded-xl p-4 flex items-start justify-between gap-3"
                        >
                          <div>
                            <p style={{ color: 'var(--color-ac-text)' }} className="text-sm font-semibold mb-1">
                              {c.name}
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {c.covers?.map((cv, j) => (
                                <span key={j} className="chip text-xs">{cv}</span>
                              ))}
                            </div>
                          </div>
                          <span
                            style={{ background: `${p.color}20`, color: p.color }}
                            className="text-xs px-2.5 py-1 rounded-full font-semibold shrink-0 capitalize"
                          >
                            {c.priority}
                          </span>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
