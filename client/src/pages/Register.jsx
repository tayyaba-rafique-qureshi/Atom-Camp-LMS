import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { registerUser } from '../api'
import { saveAuth, getRoleHome } from '../auth'

const SKILLS = ['Python', 'JavaScript', 'HTML/CSS', 'Data Analysis', 'Machine Learning', 'SQL', 'React', 'Node.js']

const ROLES = [
  { id: 'learner',      label: 'Learner',      desc: 'Enrolled in a bootcamp', icon: '🎓' },
  { id: 'instructor',   label: 'Instructor',   desc: 'Teaching bootcamp sessions', icon: '👨‍🏫' },
  { id: 'coordinator',  label: 'Coordinator',  desc: 'Managing cohort operations', icon: '📋' },
  { id: 'admin',        label: 'Admin',        desc: 'Platform administration', icon: '⚙️' },
]

export default function Register() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'learner',
    learningStyle: 'visual', goal: '', weeklyStudyHours: 10, skillScores: {},
  })

  const f = (k, v) => setForm((p) => ({ ...p, [k]: v }))
  const setSkill = (skill, val) => setForm((p) => ({ ...p, skillScores: { ...p.skillScores, [skill]: Number(val) } }))
  const isLearner = form.role === 'learner'
  const totalSteps = isLearner ? 2 : 1

  async function submit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await registerUser(form)
      saveAuth(res.data.data)
      navigate(getRoleHome(res.data.data.role))
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed')
      setStep(1)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ background: 'var(--color-ac-navy)' }} className="min-h-screen flex items-center justify-center p-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <div
            style={{ background: 'var(--color-ac-orange)' }}
            className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white text-lg mx-auto mb-4"
          >
            A
          </div>
          <h1 style={{ color: 'var(--color-ac-text)' }} className="text-2xl font-bold mb-1">Create account</h1>
          <p style={{ color: 'var(--color-ac-subtext)' }} className="text-sm">Join atomcamp LMS</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                style={{
                  background: step > i ? 'var(--color-ac-orange)' : step === i + 1 ? 'var(--color-ac-orange)' : 'var(--color-ac-border)',
                  width: step === i + 1 ? '2rem' : '0.5rem',
                  height: '0.5rem',
                  borderRadius: '9999px',
                  transition: 'all 0.3s',
                }}
              />
            </div>
          ))}
          <span style={{ color: 'var(--color-ac-subtext)' }} className="text-xs ml-1">
            Step {step} of {totalSteps}
          </span>
        </div>

        <div className="card">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.form
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={isLearner ? (e) => { e.preventDefault(); setStep(2) } : submit}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Full name</label>
                    <input required className="input" placeholder="Sara Ahmed" value={form.name} onChange={(e) => f('name', e.target.value)} />
                  </div>
                  <div>
                    <label className="label">Email</label>
                    <input type="email" required className="input" placeholder="sara@email.com" value={form.email} onChange={(e) => f('email', e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="label">Password</label>
                  <input type="password" required minLength={6} className="input" placeholder="Min. 6 characters" value={form.password} onChange={(e) => f('password', e.target.value)} />
                </div>

                <div>
                  <label className="label">I am joining as</label>
                  <div className="grid grid-cols-2 gap-2">
                    {ROLES.map((role) => (
                      <button
                        type="button"
                        key={role.id}
                        onClick={() => f('role', role.id)}
                        style={{
                          background: form.role === role.id ? 'var(--color-ac-orange-t)' : 'var(--color-ac-dark)',
                          border: `1px solid ${form.role === role.id ? 'var(--color-ac-orange)' : 'var(--color-ac-border)'}`,
                          color: form.role === role.id ? 'var(--color-ac-orange)' : 'var(--color-ac-muted)',
                        }}
                        className="text-left p-3 rounded-xl transition-all hover:border-orange-500"
                      >
                        <p className="text-sm font-semibold">{role.icon} {role.label}</p>
                        <p className="text-xs mt-0.5 opacity-70">{role.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {error && (
                  <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--color-ac-red)' }} className="rounded-lg px-3 py-2 text-sm">
                    {error}
                  </div>
                )}

                <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
                  {isLearner ? 'Next — set up skills →' : loading ? 'Creating...' : 'Create account →'}
                </button>
              </motion.form>
            )}

            {step === 2 && isLearner && (
              <motion.form
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={submit}
                className="space-y-5"
              >
                <div>
                  <label className="label">Learning style</label>
                  <select
                    className="input"
                    value={form.learningStyle}
                    onChange={(e) => f('learningStyle', e.target.value)}
                  >
                    <option value="visual">Visual — diagrams and videos</option>
                    <option value="auditory">Auditory — listening and discussion</option>
                    <option value="reading">Reading — notes and articles</option>
                    <option value="kinesthetic">Kinesthetic — hands-on building</option>
                  </select>
                </div>

                <div>
                  <label className="label">Career goal</label>
                  <input
                    className="input"
                    placeholder="e.g. Become a data scientist"
                    value={form.goal}
                    onChange={(e) => f('goal', e.target.value)}
                  />
                </div>

                <div>
                  <label className="label">
                    Weekly study hours:{' '}
                    <span style={{ color: 'var(--color-ac-orange)' }} className="font-bold">{form.weeklyStudyHours}h</span>
                  </label>
                  <input
                    type="range" min="2" max="40"
                    className="w-full accent-orange-500 mt-1"
                    value={form.weeklyStudyHours}
                    onChange={(e) => f('weeklyStudyHours', Number(e.target.value))}
                  />
                  <div style={{ color: 'var(--color-ac-subtext)' }} className="flex justify-between text-xs mt-1">
                    <span>2h</span><span>40h</span>
                  </div>
                </div>

                <div>
                  <label className="label">Rate your current skills (0–100)</label>
                  <div className="space-y-3 mt-2">
                    {SKILLS.map((skill) => {
                      const val = form.skillScores[skill] ?? 0
                      return (
                        <div key={skill} className="flex items-center gap-3">
                          <span style={{ color: 'var(--color-ac-muted)' }} className="text-xs w-28 shrink-0">{skill}</span>
                          <input
                            type="range" min="0" max="100" step="5"
                            className="flex-1 accent-orange-500"
                            value={val}
                            onChange={(e) => setSkill(skill, e.target.value)}
                          />
                          <span
                            style={{ color: val > 60 ? 'var(--color-ac-green)' : val > 30 ? 'var(--color-ac-amber)' : 'var(--color-ac-subtext)' }}
                            className="text-xs w-7 text-right font-medium"
                          >
                            {val}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {error && (
                  <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--color-ac-red)' }} className="rounded-lg px-3 py-2 text-sm">
                    {error}
                  </div>
                )}

                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(1)} className="btn-ghost flex-1">
                    ← Back
                  </button>
                  <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">
                    {loading ? 'Creating...' : 'Create account →'}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          <p style={{ color: 'var(--color-ac-subtext)' }} className="text-sm mt-5 text-center">
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--color-ac-orange)' }} className="font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
