import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const FEATURES = [
  {
    icon: '🧭',
    title: 'Career GPS',
    desc: 'Enter your dream role and get a personalized AI roadmap with milestones, skill gaps, and atomcamp course recommendations.',
    color: 'var(--color-ac-orange)',
    bg: 'var(--color-ac-orange-t)',
    step: '01',
  },
  {
    icon: '🔥',
    title: 'Burnout Predictor',
    desc: 'AI analyzes your behavioral signals — attendance, engagement, mood history — and flags burnout risk before it becomes a problem.',
    color: 'var(--color-ac-red)',
    bg: 'rgba(239,68,68,0.12)',
    step: '02',
  },
  {
    icon: '💬',
    title: 'Mood Check-in',
    desc: 'Weekly text-based check-ins analyzed by AI for mood, engagement score, and personalized feedback. Instructors are notified when needed.',
    color: 'var(--color-ac-blue)',
    bg: 'rgba(59,130,246,0.12)',
    step: '03',
  },
  {
    icon: '📅',
    title: 'AI Study Planner',
    desc: 'Generates a 5-day adaptive study schedule based on your skill gaps, burnout score, and available hours per week.',
    color: 'var(--color-ac-purple)',
    bg: 'rgba(168,85,247,0.12)',
    step: '04',
  },
]

const STATS = [
  { value: '4', label: 'AI-powered modules' },
  { value: '< 2s', label: 'Roadmap generation' },
  { value: '100%', label: 'Personalized' },
  { value: '24/7', label: 'Available' },
]

export default function Onboarding() {
  return (
    <div style={{ background: 'var(--color-ac-navy)' }} className="min-h-screen">

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-16 pb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-6">
            <span
              style={{ background: 'var(--color-ac-orange-t)', color: 'var(--color-ac-orange)', border: '1px solid rgba(249,115,22,0.3)' }}
              className="text-xs px-3 py-1.5 rounded-full font-semibold"
            >
              ⚡ Built for atomcamp Hackathon 2025
            </span>
          </div>

          <h1 style={{ color: 'var(--color-ac-text)' }} className="text-4xl sm:text-5xl font-bold leading-tight mb-6">
            Smart Adaptive{' '}
            <span style={{ color: 'var(--color-ac-orange)' }}>Learning</span>
            <br />
            Management System
          </h1>

          <p style={{ color: 'var(--color-ac-muted)' }} className="text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            AI-powered tools that personalize your learning journey, predict burnout before it happens,
            and keep you on track toward your career goals.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/register" className="btn-primary text-base px-6 py-3">
              Get started free →
            </Link>
            <Link
              to="/login"
              style={{ color: 'var(--color-ac-muted)', border: '1px solid var(--color-ac-border)', background: 'transparent' }}
              className="btn-ghost text-base px-6 py-3"
            >
              Sign in
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          style={{ border: '1px solid var(--color-ac-border)', background: 'var(--color-ac-surface)' }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-0 rounded-2xl mt-16 overflow-hidden"
        >
          {STATS.map((s, i) => (
            <div
              key={i}
              style={{ borderRight: i < STATS.length - 1 ? '1px solid var(--color-ac-border)' : 'none' }}
              className="py-6 px-4 text-center"
            >
              <p style={{ color: 'var(--color-ac-orange)' }} className="text-2xl font-bold">{s.value}</p>
              <p style={{ color: 'var(--color-ac-subtext)' }} className="text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section style={{ borderTop: '1px solid var(--color-ac-border)' }} className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p style={{ color: 'var(--color-ac-orange)' }} className="text-xs font-semibold uppercase tracking-widest mb-3">
              4 Core Modules
            </p>
            <h2 style={{ color: 'var(--color-ac-text)' }} className="text-3xl font-bold">
              Everything you need to learn smarter
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{ background: 'var(--color-ac-surface)', border: '1px solid var(--color-ac-border)' }}
                className="rounded-2xl p-6 hover:border-orange-500 transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div
                    style={{ background: f.bg, color: f.color }}
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                  >
                    {f.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 style={{ color: 'var(--color-ac-text)' }} className="text-base font-bold group-hover:text-orange-400 transition-colors">
                        {f.title}
                      </h3>
                      <span
                        style={{ color: f.color, background: f.bg }}
                        className="text-xs px-2 py-0.5 rounded-full font-mono font-bold"
                      >
                        {f.step}
                      </span>
                    </div>
                    <p style={{ color: 'var(--color-ac-muted)' }} className="text-sm leading-relaxed">
                      {f.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ borderTop: '1px solid var(--color-ac-border)' }} className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p style={{ color: 'var(--color-ac-orange)' }} className="text-xs font-semibold uppercase tracking-widest mb-3">
            How it works
          </p>
          <h2 style={{ color: 'var(--color-ac-text)' }} className="text-3xl font-bold mb-12">
            From signup to roadmap in 60 seconds
          </h2>

          <div className="space-y-6">
            {[
              { step: '1', title: 'Create your profile', desc: 'Register with your role, skills, and career goal. Takes under 2 minutes.' },
              { step: '2', title: 'Generate your Career GPS', desc: 'Enter your dream role and get an AI-powered roadmap with milestones and course recommendations.' },
              { step: '3', title: 'Check in weekly', desc: 'Submit a short text about how you\'re feeling. AI analyzes mood, engagement, and flags concerns.' },
              { step: '4', title: 'Follow your study plan', desc: 'Get a personalized 5-day schedule that adapts to your burnout risk and available hours.' },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-4 text-left"
              >
                <div
                  style={{ background: 'var(--color-ac-orange)', color: '#fff' }}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 mt-0.5"
                >
                  {s.step}
                </div>
                <div>
                  <p style={{ color: 'var(--color-ac-text)' }} className="text-sm font-semibold mb-1">{s.title}</p>
                  <p style={{ color: 'var(--color-ac-muted)' }} className="text-sm">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-12">
            <Link to="/register" className="btn-primary text-base px-8 py-3">
              Start learning smarter →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--color-ac-border)' }} className="py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div
              style={{ background: 'var(--color-ac-orange)' }}
              className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-white text-xs"
            >
              A
            </div>
            <span style={{ color: 'var(--color-ac-muted)' }} className="text-sm">
              atomcamp <span style={{ color: 'var(--color-ac-orange)' }}>LMS</span>
            </span>
          </div>
          <p style={{ color: 'var(--color-ac-subtext)' }} className="text-xs text-center">
            Built for atomcamp Hackathon 2025 · Powered by Gemini AI + MongoDB
          </p>
          <div className="flex gap-4">
            <Link to="/login" style={{ color: 'var(--color-ac-subtext)' }} className="text-xs hover:text-white transition-colors">
              Sign in
            </Link>
            <Link to="/register" style={{ color: 'var(--color-ac-orange)' }} className="text-xs hover:underline">
              Register
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
