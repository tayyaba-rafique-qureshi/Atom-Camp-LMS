import { useState } from 'react'
import { motion } from 'framer-motion'
import { analyzeBurnout } from '../api'

const LEVELS = {
  healthy:  { color: 'var(--color-ac-green)',  bg: 'rgba(34,197,94,0.12)',  label: 'Healthy',  icon: '✅' },
  at_risk:  { color: 'var(--color-ac-amber)',  bg: 'rgba(245,158,11,0.12)', label: 'At Risk',  icon: '⚠️' },
  critical: { color: 'var(--color-ac-red)',    bg: 'rgba(239,68,68,0.12)',  label: 'Critical', icon: '🚨' },
}

function GaugeArc({ score }) {
  // SVG semi-circle gauge
  const r = 54
  const cx = 70
  const cy = 70
  const circumference = Math.PI * r
  const offset = circumference - (score / 100) * circumference
  const color = score >= 70 ? '#ef4444' : score >= 40 ? '#f59e0b' : '#22c55e'

  return (
    <svg width="140" height="80" viewBox="0 0 140 80" className="mx-auto">
      {/* Track */}
      <path
        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none"
        stroke="var(--color-ac-border)"
        strokeWidth="10"
        strokeLinecap="round"
      />
      {/* Fill */}
      <path
        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none"
        stroke={color}
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 0.8s ease, stroke 0.4s' }}
      />
      {/* Score text */}
      <text x={cx} y={cy - 4} textAnchor="middle" fill={color} fontSize="22" fontWeight="700">
        {score}
      </text>
      <text x={cx} y={cy + 14} textAnchor="middle" fill="var(--color-ac-subtext)" fontSize="10">
        / 100
      </text>
    </svg>
  )
}

export default function BurnoutMeter({ learnerId, initialScore = 0, initialLabel = 'healthy' }) {
  const [score, setScore] = useState(initialScore)
  const [label, setLabel] = useState(initialLabel)
  const [explanation, setExplanation] = useState('')
  const [suggestion, setSuggestion] = useState('')
  const [topSignal, setTopSignal] = useState('')
  const [loading, setLoading] = useState(false)
  const level = LEVELS[label] || LEVELS.healthy

  async function refresh() {
    if (!learnerId) return
    setLoading(true)
    try {
      const res = await analyzeBurnout(learnerId)
      const d = res.data.data
      setScore(d.risk_score)
      setLabel(d.label)
      setExplanation(d.explanation)
      setSuggestion(d.suggested_action)
      setTopSignal(d.top_signal)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p style={{ color: 'var(--color-ac-subtext)' }} className="text-xs font-medium uppercase tracking-wide">
            Burnout Risk
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-base">{level.icon}</span>
            <span
              style={{ color: level.color }}
              className="text-sm font-semibold"
            >
              {level.label}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={refresh}
          disabled={loading}
          style={{ color: 'var(--color-ac-subtext)', border: '1px solid var(--color-ac-border)' }}
          className="text-xs px-3 py-1.5 rounded-lg hover:text-white transition-colors disabled:opacity-40"
        >
          {loading ? '⏳ Analyzing...' : '↻ Refresh'}
        </button>
      </div>

      {/* Gauge */}
      <GaugeArc score={score} />

      {/* Risk zones legend */}
      <div className="flex justify-between text-xs mt-2 mb-4 px-2">
        <span style={{ color: 'var(--color-ac-green)' }}>0–39 Healthy</span>
        <span style={{ color: 'var(--color-ac-amber)' }}>40–69 At Risk</span>
        <span style={{ color: 'var(--color-ac-red)' }}>70+ Critical</span>
      </div>

      {/* Details */}
      {topSignal && (
        <div
          style={{ background: 'var(--color-ac-dark)', border: '1px solid var(--color-ac-border)' }}
          className="rounded-xl p-3 space-y-2"
        >
          <p style={{ color: 'var(--color-ac-muted)' }} className="text-xs">
            <span className="font-semibold" style={{ color: 'var(--color-ac-text)' }}>Top signal: </span>
            {topSignal}
          </p>
          {explanation && (
            <p style={{ color: 'var(--color-ac-muted)' }} className="text-xs leading-relaxed">{explanation}</p>
          )}
          {suggestion && (
            <div
              style={{ background: level.bg, borderLeft: `3px solid ${level.color}` }}
              className="rounded-r-lg pl-3 py-2"
            >
              <p style={{ color: level.color }} className="text-xs font-medium">Suggested action</p>
              <p style={{ color: 'var(--color-ac-muted)' }} className="text-xs mt-0.5">{suggestion}</p>
            </div>
          )}
        </div>
      )}

      {!topSignal && (
        <p style={{ color: 'var(--color-ac-subtext)' }} className="text-xs text-center mt-2">
          Click Refresh to run AI burnout analysis
        </p>
      )}
    </div>
  )
}
