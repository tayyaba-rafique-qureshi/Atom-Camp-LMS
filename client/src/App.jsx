import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import CheckIn from './pages/CheckIn'
import CareerGPS from './pages/CareerGPS'
import StudyPlan from './pages/StudyPlan'
import Instructor from './pages/Instructor'
import CoordinatorDashboard from './pages/CoordinatorDashboard'
import AdminDashboard from './pages/AdminDashboard'
import Onboarding from './pages/Onboarding'
import { isLoggedIn, getRoleHome, getRole } from './auth'

function RootRedirect() {
  if (!isLoggedIn()) return <Navigate to="/welcome" replace />
  return <Navigate to={getRoleHome(getRole())} replace />
}

// Page transition wrapper
function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  )
}

function AppRoutes() {
  const location = useLocation()
  const showNavbar = !['/', '/welcome', '/login', '/register'].includes(location.pathname)

  return (
    <>
      {showNavbar && <Navbar />}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/welcome" element={<PageTransition><Onboarding /></PageTransition>} />
          <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
          <Route path="/register" element={<PageTransition><Register /></PageTransition>} />

          <Route
            path="/unauthorized"
            element={
              <PageTransition>
                <div
                  style={{ background: 'var(--color-ac-navy)' }}
                  className="min-h-screen flex items-center justify-center"
                >
                  <div className="text-center">
                    <p className="text-5xl mb-4">🚫</p>
                    <p style={{ color: 'var(--color-ac-text)' }} className="text-xl font-semibold mb-2">Access denied</p>
                    <p style={{ color: 'var(--color-ac-subtext)' }} className="text-sm">
                      You do not have permission to view this page.
                    </p>
                  </div>
                </div>
              </PageTransition>
            }
          />

          <Route
            path="/dashboard/learner"
            element={
              <ProtectedRoute allowedRoles={['learner']}>
                <PageTransition><Dashboard /></PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/learner/checkin"
            element={
              <ProtectedRoute allowedRoles={['learner']}>
                <PageTransition><CheckIn /></PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/learner/career"
            element={
              <ProtectedRoute allowedRoles={['learner']}>
                <PageTransition><CareerGPS /></PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/learner/study-plan"
            element={
              <ProtectedRoute allowedRoles={['learner']}>
                <PageTransition><StudyPlan /></PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/instructor"
            element={
              <ProtectedRoute allowedRoles={['instructor']}>
                <PageTransition><Instructor /></PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/coordinator"
            element={
              <ProtectedRoute allowedRoles={['coordinator']}>
                <PageTransition><CoordinatorDashboard /></PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <PageTransition><AdminDashboard /></PageTransition>
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
