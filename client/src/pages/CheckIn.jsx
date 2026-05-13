import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { submitCheckIn } from '../api'
import { getLearnerId } from '../auth'

const EMOJIS = {
  motivated:   { emoji: '🚀', color: 'var(--color-ac-green)',  bg: 'rgba(34,197,94,0.12)',  label: 'Motivated' },
  anxious:     { emoji: '😰', color: 'var(--color-ac-amber)',  bg: 'rgba(245,158,11,0.12)', label: 'Anxious' },
  overwhelmed: { emoji: '😓', color: 'var(--color-ac-red)',    bg: 'rgba(239,68,68,0.12)',  label: 'Overwhelmed' },
  disengaged:  { emoji: '😶', color: 'var(--color-ac-muted)',  bg: 'rgba(139,148,158,0.12)',label: 'Disengaged' },
  neutral:     { emoji: '😐', color: 'var(--color-ac-blue)',   bg: 'rgba(59,130,246,0.12)', label: 'Neutral' },
}

const DEMO_TEXT = "I'm struggling to keep up with the pace. The last few sessions felt overwhelming and I'm not sure I'm retaining everything."

export default function CheckIn() {
  const navigate = useNavigate()
  const learnerId = getLearnerId()
  const [text, setText] = useState('')
  const [week, setWeek] = useState(1)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!learnerId) { navigate('/login'); return }
    setLoading(true)
    setError('')
    try {
      const res = await submitCheckIn({ learnerId, week, text })
      setResult(res.data.data.aiResult)
    } catch (err) {
      setError(err.response?.data?.error || 'Check-in failed. Check the server and try again.')
    } finally {
      setLoading(false)
    }
  }

  if (result) {
    const m = EMOJIS[result.mood] || EMOJIS.neutral
    return (
      <div style={{ background: 'var(--color-ac-navy)' }} className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card w-full max-w-md text-center"
        >
          {/* Mood display */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
            className="text-6xl mb-4"
          >
            {m.emoji}
          </motion.div>

          <h2 style={{ color: m.color }} className="text-2xl font-bold capitalize mb-1">
            {m.label}
          </h2>
          <p style={{ color: 'var(--color-ac-subtext)' }} className="text-sm mb-6">
            Week {week} check-in analyzed
          </p>

          {/* Engagement score */}
          <div className="mb-5">
            <div className="flex justify-between mb-2">
              <span style={{ color: 'var(--color-ac-subtext)' }} className="text-xs">Engagement score</span>
              <span style={{ color: 'var(--color-ac-text)' }} className="text-xs font-bold">{result.engagement_score}%</span>
            </div>
            <div className="progress-track">
              <motion.div
                className="progress-fill"
                style={{
                  background: result.engagement_score >= 70 ? 'var(--color-ac-green)' : result.engagement_score >= 40 ? 'var(--color-ac-amber)' : 'var(--color-ac-red)',
                }}
                initial={{ width: 0 }}
                animate={{ width: `${result.engagement_score}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
              />
            </div>
          </div>

          {/* Feedback */}
          <div
            style={{ background: m.bg, border: `1px solid ${m.color}30` }}
            className="rounded-xl p-4 mb-4 text-left"
          >
            <p style={{ color: 'var(--color-ac-muted)' }} className="text-sm leading-relaxed">
              {result.feedback}
            </p>
          </div>

          {/* Instructor flag */}
          {result.flag_instructor && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)', color: 'var(--color-ac-amber)' }}
              className="rounded-xl p-3 text-xs mb-4 text-left"
            >
              <p className="font-semibold mb-0.5">⚑ Instructor notified</p>
              <p style={{ color: 'var(--color-ac-muted)' }}>
                Your instructor has been flagged to check in with you this week.
              </p>
            </motion.div>
          )}

          <button
            type="button"
            onClick={() => navigate('/dashboard/learner')}
            className="btn-primary w-full justify-center"
          >
            Back to dashboard →
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div style={{ background: 'var(--color-ac-navy)' }} className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div
            style={{ background: 'rgba(59,130,246,0.15)', color: 'var(--color-ac-blue)' }}
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4"
          >
            💬
          </div>
          <h1 style={{ color: 'var(--color-ac-text)' }} className="text-2xl font-bold mb-1">Weekly Check-in</h1>
          <p style={{ color: 'var(--color-ac-subtext)' }} className="text-sm">
            How are you feeling about your learning this week?
          </p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Week number</label>
              <input
                type="number" min="1" max="52"
                className="input"
                value={week}
                onChange={(e) => setWeek(Number(e.target.value))}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="label" style={{ marginBottom: 0 }}>How are you feeling?</label>
                <button
                  type="button"
                  onClick={() => setText(DEMO_TEXT)}
                  style={{ color: 'var(--color-ac-orange)' }}
                  className="text-xs hover:underline"
                >
                  ⚡ Demo text
                </button>
              </div>
              <textarea
                rows={5}
                required
                className="input resize-none mt-1"
                placeholder="e.g. I found recursion really confusing this week. Feeling a bit overwhelmed..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                maxLength={500}
              />
              <p style={{ color: 'var(--color-ac-subtext)' }} className="text-xs text-right mt-1">
                {text.length}/500
              </p>
            </div>

            {error && (
              <div
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--color-ac-red)' }}
                className="rounded-lg px-3 py-2 text-sm"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !text.trim()}
              className="btn-primary w-full justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  </svg>
                  Analyzing your check-in...
                </>
              ) : (
                'Submit check-in →'
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
