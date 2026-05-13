import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getAllLearners, updateLearner } from '../api'

export default function CoordinatorDashboard() {
  const [learners, setLearners] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllLearners()
      .then((r) => setLearners(r.data.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  async function setAttendance(id, value) {
    await updateLearner(id, { attendanceRate: Number(value) })
    setLearners((p) => p.map((l) => (l._id === id ? { ...l, attendanceRate: Number(value) } : l)))
  }

  const atRisk = learners.filter((l) => l.attendanceRate < 75)
  const healthy = learners.filter((l) => l.attendanceRate >= 75)

  if (loading)
    return (
      <div style={{ background: 'var(--color-ac-navy)' }} className="min-h-screen flex items-center justify-center">
        <div className="skeleton w-48 h-4 rounded" />
      </div>
    )

  return (
    <div style={{ background: 'var(--color-ac-navy)' }} className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 style={{ color: 'var(--color-ac-text)' }} className="text-2xl font-bold mb-1">Coordinator Dashboard</h1>
          <p style={{ color: 'var(--color-ac-subtext)' }} className="text-sm">{learners.length} learners enrolled</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Total enrolled', value: learners.length, color: 'var(--color-ac-orange)' },
            { label: 'Below 75% attendance', value: atRisk.length, color: 'var(--color-ac-red)' },
            { label: 'Good standing', value: healthy.length, color: 'var(--color-ac-green)' },
          ].map((s) => (
            <div key={s.label} className="card-sm text-center">
              <p style={{ color: s.color }} className="text-2xl font-bold">{s.value}</p>
              <p style={{ color: 'var(--color-ac-subtext)' }} className="text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {atRisk.length > 0 && (
          <div
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}
            className="rounded-2xl p-4 mb-6"
          >
            <p style={{ color: 'var(--color-ac-red)' }} className="text-sm font-semibold mb-2">
              ⚠ At risk of removal — below 75% attendance
            </p>
            <div className="flex flex-wrap gap-2">
              {atRisk.map((l) => (
                <span
                  key={l._id}
                  style={{ background: 'rgba(239,68,68,0.15)', color: 'var(--color-ac-red)', border: '1px solid rgba(239,68,68,0.3)' }}
                  className="text-xs px-3 py-1.5 rounded-full font-medium"
                >
                  {l.name} · {l.attendanceRate}%
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Attendance table */}
        <div className="card p-0 overflow-hidden">
          <div
            style={{ borderBottom: '1px solid var(--color-ac-border)' }}
            className="px-6 py-4"
          >
            <p style={{ color: 'var(--color-ac-text)' }} className="text-sm font-semibold">Attendance Tracker</p>
            <p style={{ color: 'var(--color-ac-subtext)' }} className="text-xs mt-0.5">
              Minimum requirement: 75% · Edit to update
            </p>
          </div>
          {learners.map((l, i) => (
            <div
              key={l._id}
              style={{ borderBottom: i < learners.length - 1 ? '1px solid var(--color-ac-border)' : 'none' }}
              className="px-6 py-4 flex items-center gap-4"
            >
              <div
                style={{ background: 'var(--color-ac-orange-t)', color: 'var(--color-ac-orange)' }}
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
              >
                {l.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p style={{ color: 'var(--color-ac-text)' }} className="text-sm font-medium">{l.name}</p>
                <p style={{ color: 'var(--color-ac-subtext)' }} className="text-xs">{l.email}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="w-24 hidden sm:block">
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${l.attendanceRate}%`,
                        background: l.attendanceRate < 75 ? 'var(--color-ac-red)' : 'var(--color-ac-green)',
                      }}
                    />
                  </div>
                </div>
                <input
                  type="number" min="0" max="100"
                  className="input w-16 py-1.5 px-2 text-xs text-center"
                  style={{
                    borderColor: l.attendanceRate < 75 ? 'rgba(239,68,68,0.5)' : 'var(--color-ac-border)',
                    color: l.attendanceRate < 75 ? 'var(--color-ac-red)' : 'var(--color-ac-text)',
                  }}
                  value={l.attendanceRate}
                  onChange={(e) => setAttendance(l._id, e.target.value)}
                />
              </div>
            </div>
          ))}
          {learners.length === 0 && (
            <div className="px-6 py-12 text-center">
              <p style={{ color: 'var(--color-ac-subtext)' }} className="text-sm">No learners enrolled yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
