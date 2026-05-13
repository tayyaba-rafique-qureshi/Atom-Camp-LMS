import { motion } from 'framer-motion'

const ACTIVITY = {
  review:      { color: 'var(--color-ac-blue)',   bg: 'rgba(59,130,246,0.12)',  label: 'Review',      icon: '📖' },
  practice:    { color: 'var(--color-ac-green)',  bg: 'rgba(34,197,94,0.12)',   label: 'Practice',    icon: '💪' },
  new_concept: { color: 'var(--color-ac-purple)', bg: 'rgba(168,85,247,0.12)',  label: 'New Concept', icon: '💡' },
  rest:        { color: 'var(--color-ac-muted)',  bg: 'rgba(139,148,158,0.12)', label: 'Rest',        icon: '😴' },
}

export default function StudyPlanCalendar({ plan }) {
  if (!plan)
    return (
      <div className="card h-full flex flex-col justify-center items-center text-center py-8">
        <span className="text-4xl mb-3">📅</span>
        <p style={{ color: 'var(--color-ac-text)' }} className="text-sm font-semibold mb-1">No study plan yet</p>
        <p style={{ color: 'var(--color-ac-subtext)' }} className="text-xs">
          Generate your AI-powered weekly plan from the dashboard.
        </p>
      </div>
    )

  return (
    <div className="card h-full">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p style={{ color: 'var(--color-ac-subtext)' }} className="text-xs font-medium uppercase tracking-wide mb-1">
            This Week's Plan
          </p>
          <p style={{ color: 'var(--color-ac-text)' }} className="text-sm font-medium leading-snug">
            {plan.week_summary}
          </p>
        </div>
        <span className="badge badge-orange shrink-0 ml-3">{plan.total_hours}h total</span>
      </div>

      <div className="space-y-2">
        {plan.days?.map((d, i) => {
          const a = ACTIVITY[d.activity_type] || ACTIVITY.rest
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              style={{ background: a.bg, border: `1px solid ${a.color}25` }}
              className="rounded-xl p-3 group relative"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-base">{a.icon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span style={{ color: 'var(--color-ac-subtext)' }} className="text-xs font-semibold uppercase tracking-wide">
                        {d.day}
                      </span>
                      <span
                        style={{ background: `${a.color}20`, color: a.color }}
                        className="text-xs px-1.5 py-0.5 rounded-full font-medium"
                      >
                        {a.label}
                      </span>
                    </div>
                    <p style={{ color: 'var(--color-ac-text)' }} className="text-sm font-medium mt-0.5">
                      {d.topic}
                    </p>
                  </div>
                </div>
                <span style={{ color: 'var(--color-ac-subtext)' }} className="text-xs shrink-0 mt-1">
                  {d.duration_minutes}m
                </span>
              </div>
              {d.reason && (
                <p style={{ color: 'var(--color-ac-subtext)' }} className="text-xs mt-1.5 ml-7 leading-relaxed">
                  {d.reason}
                </p>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
