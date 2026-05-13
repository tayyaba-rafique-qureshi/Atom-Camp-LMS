import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { loginUser } from '../api'
import { saveAuth, getRoleHome } from '../auth'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await loginUser(form)
      saveAuth(res.data.data)
      navigate(getRoleHome(res.data.data.role))
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{ background: 'var(--color-ac-navy)' }}
      className="min-h-screen flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div
            style={{ background: 'var(--color-ac-orange)' }}
            className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white text-lg mx-auto mb-4"
          >
            A
          </div>
          <h1 style={{ color: 'var(--color-ac-text)' }} className="text-2xl font-bold mb-1">
            Welcome back
          </h1>
          <p style={{ color: 'var(--color-ac-subtext)' }} className="text-sm">
            Sign in to atomcamp LMS
          </p>
        </div>

        {/* Form card */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                required
                className="input"
                placeholder="you@email.com"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              />
            </div>
            <div>
              <label className="label">Password</label>
              <input
                type="password"
                required
                className="input"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
              />
            </div>

            {error && (
              <div
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--color-ac-red)' }}
                className="rounded-lg px-3 py-2 text-sm"
              >
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
              {loading ? (
                <>
                  <Spinner /> Signing in...
                </>
              ) : (
                'Sign in →'
              )}
            </button>
          </form>

          <p style={{ color: 'var(--color-ac-subtext)' }} className="text-sm mt-5 text-center">
            No account?{' '}
            <Link
              to="/register"
              style={{ color: 'var(--color-ac-orange)' }}
              className="font-medium hover:underline"
            >
              Create one
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

function Spinner() {
  return (
    <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  )
}
