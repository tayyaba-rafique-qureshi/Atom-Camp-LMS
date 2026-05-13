import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { clearAuth, isLoggedIn, getRole, getUserName, getRoleHome } from '../auth'

const NAV_LINKS = {
  learner: [
    { to: '/dashboard/learner', label: 'Dashboard' },
    { to: '/dashboard/learner/checkin', label: 'Check-in' },
    { to: '/dashboard/learner/career', label: 'Career GPS' },
    { to: '/dashboard/learner/study-plan', label: 'Study Plan' },
  ],
  instructor: [{ to: '/dashboard/instructor', label: 'Dashboard' }],
  coordinator: [{ to: '/dashboard/coordinator', label: 'Dashboard' }],
  admin: [{ to: '/dashboard/admin', label: 'Dashboard' }],
}

const ROLE_COLORS = {
  learner:     'badge-orange',
  instructor:  'badge-blue',
  coordinator: 'badge-amber',
  admin:       'badge-purple',
}

export default function Navbar() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const loggedIn = isLoggedIn()
  const role = getRole()
  const name = getUserName()
  const links = NAV_LINKS[role] || []
  const [menuOpen, setMenuOpen] = useState(false)

  function logout() {
    clearAuth()
    navigate('/login')
  }

  return (
    <nav
      style={{
        background: 'var(--color-ac-dark)',
        borderBottom: '1px solid var(--color-ac-border)',
      }}
      className="sticky top-0 z-50 px-4 sm:px-6 py-3"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link
          to={loggedIn ? getRoleHome(role) : '/login'}
          className="flex items-center gap-2.5 group"
        >
          <div
            style={{ background: 'var(--color-ac-orange)' }}
            className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-sm transition-transform group-hover:scale-105"
          >
            A
          </div>
          <span style={{ color: 'var(--color-ac-text)' }} className="font-semibold text-sm hidden sm:block">
            atomcamp <span style={{ color: 'var(--color-ac-orange)' }}>LMS</span>
          </span>
        </Link>

        {/* Desktop nav links */}
        {loggedIn && (
          <div className="hidden md:flex items-center gap-1">
            {links.map((l) => {
              const active = pathname === l.to
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  style={{
                    color: active ? 'var(--color-ac-orange)' : 'var(--color-ac-muted)',
                    background: active ? 'var(--color-ac-orange-t)' : 'transparent',
                  }}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:text-white"
                >
                  {l.label}
                </Link>
              )
            })}
          </div>
        )}

        {/* Right side */}
        <div className="flex items-center gap-3">
          {loggedIn ? (
            <>
              <span className={`badge ${ROLE_COLORS[role] || 'badge-muted'} capitalize hidden sm:inline-flex`}>
                {role}
              </span>
              <span style={{ color: 'var(--color-ac-subtext)' }} className="text-xs hidden lg:block truncate max-w-32">
                {name}
              </span>
              <button
                type="button"
                onClick={logout}
                style={{ color: 'var(--color-ac-subtext)' }}
                className="text-xs hover:text-red-400 transition-colors"
              >
                Sign out
              </button>
              {/* Mobile hamburger */}
              <button
                type="button"
                className="md:hidden p-1.5 rounded-lg"
                style={{ color: 'var(--color-ac-muted)', border: '1px solid var(--color-ac-border)' }}
                onClick={() => setMenuOpen((o) => !o)}
                aria-label="Toggle menu"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  {menuOpen
                    ? <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.75.75 0 1 1 1.06 1.06L9.06 8l3.22 3.22a.75.75 0 1 1-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 0 1-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z" />
                    : <path d="M1 2.75A.75.75 0 0 1 1.75 2h12.5a.75.75 0 0 1 0 1.5H1.75A.75.75 0 0 1 1 2.75Zm0 5A.75.75 0 0 1 1.75 7h12.5a.75.75 0 0 1 0 1.5H1.75A.75.75 0 0 1 1 7.75ZM1.75 12h12.5a.75.75 0 0 1 0 1.5H1.75a.75.75 0 0 1 0-1.5Z" />
                  }
                </svg>
              </button>
            </>
          ) : (
            <Link
              to="/login"
              style={{ color: 'var(--color-ac-muted)' }}
              className="text-sm hover:text-white transition-colors"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && loggedIn && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden"
          >
            <div
              style={{ borderTop: '1px solid var(--color-ac-border)' }}
              className="pt-3 mt-3 flex flex-col gap-1"
            >
              {links.map((l) => {
                const active = pathname === l.to
                return (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={() => setMenuOpen(false)}
                    style={{
                      color: active ? 'var(--color-ac-orange)' : 'var(--color-ac-muted)',
                      background: active ? 'var(--color-ac-orange-t)' : 'transparent',
                    }}
                    className="px-3 py-2 rounded-lg text-sm font-medium"
                  >
                    {l.label}
                  </Link>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
