import { motion } from 'framer-motion'

function getSkillColor(score) {
  if (score >= 70) return 'var(--color-ac-green)'
  if (score >= 40) return 'var(--color-ac-amber)'
  return 'var(--color-ac-red)'
}

export default function SkillMap({ skillScores = {} }) {
  const entries = Object.entries(skillScores)

  if (!entries.length)
    return (
      <div className="card h-full flex flex-col justify-center items-center text-center py-8">
        <span className="text-4xl mb-3">🗺️</span>
        <p style={{ color: 'var(--color-ac-text)' }} className="text-sm font-semibold mb-1">No skills mapped</p>
        <p style={{ color: 'var(--color-ac-subtext)' }} className="text-xs">
          Add skill scores during registration to see your skill map.
        </p>
      </div>
    )

  const avg = Math.round(entries.reduce((s, [, v]) => s + Number(v), 0) / entries.length)

  return (
    <div className="card h-full">
      <div className="flex items-center justify-between mb-4">
        <p style={{ color: 'var(--color-ac-subtext)' }} className="text-xs font-medium uppercase tracking-wide">
          Skill Map
        </p>
        <span className="badge badge-orange">Avg {avg}%</span>
      </div>

      <div className="space-y-3">
        {entries.map(([skill, score], i) => {
          const s = Number(score)
          const color = getSkillColor(s)
          return (
            <div key={skill}>
              <div className="flex justify-between mb-1">
                <span style={{ color: 'var(--color-ac-muted)' }} className="text-xs">{skill}</span>
                <span style={{ color }} className="text-xs font-semibold">{s}%</span>
              </div>
              <div className="progress-track">
                <motion.div
                  className="progress-fill"
                  style={{ background: color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${s}%` }}
                  transition={{ duration: 0.6, delay: i * 0.05, ease: 'easeOut' }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div style={{ borderTop: '1px solid var(--color-ac-border)' }} className="flex gap-4 pt-3 mt-4">
        {[
          { color: 'var(--color-ac-green)', label: '70+ Strong' },
          { color: 'var(--color-ac-amber)', label: '40–69 Growing' },
          { color: 'var(--color-ac-red)',   label: '<40 Gap' },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-1.5">
            <div style={{ background: l.color }} className="w-2 h-2 rounded-full" />
            <span style={{ color: 'var(--color-ac-subtext)' }} className="text-xs">{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
