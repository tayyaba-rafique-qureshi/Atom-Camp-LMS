import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getLearner, getCheckIns, getStudyPlan, generateStudyPlan } from '../api'
import { getLearnerId, getUserName } from '../auth'
import SkillMap from '../components/SkillMap'
import BurnoutMeter from '../components/BurnoutMeter'
import MoodCard from '../components/MoodCard'
import StudyPlanCalendar from '../components/StudyPlanCalendar'

const FEATURE_CARDS = [
  {
    to: '/dashboard/learner/career',
    icon: '🧭',
    title: 'Career GPS',
    desc: 'AI-powered roadmap to your dream role',
    color: 'var(--color-ac-orange)',
    bg: 'var(--color-ac-orange-t)',
  },
  {
    to: '/dashboard/learner/checkin',
    icon: '💬',
    title: 'Mood Check-in',
    desc: 'Weekly wellbeing & engagement tracker',
    color: 'var(--color-ac-blue)',
    bg: 'rgba(59,130,246,0.12)',
  },
  {
    to: '/dashboard/learner/study-plan',
    icon: '📅',
    title: 'Study Planner',
    desc: 'Adaptive weekly schedule from AI',
    color: 'var(--color-ac-purple)',
    bg: 'rgba(168,85,247,0.12)',
  },
]

function StatCard({ label, value, sub }) {
  return (
    <div className="card-sm">
      <p style={{ color: 'var(--color-ac-subtext)' }} className="text-xs mb-1">{label}</p>
      <p style={{ color: 'var(--color-ac-text)' }} className="text-xl font-bold capitalize">{value}</p>
      {sub && <p style={{ color: 'var(--color-ac-subtext)' }} className="text-xs mt-0.5">{sub}</p>}
    </div>
  )
}

function SkeletonCard({ h = 'h-40' }) {
  return <div className={`skeleton rounded-2xl ${h}`} />
}

export default function Dashboard() {
  const navigate = useNavigate()
  const learnerId = getLearnerId()
  const learnerName = getUserName() || 'Learner'
  const [learner, setLearner] = useState(null)
  const [checkIns, setCheckIns] = useState([])
  const [studyPlan, setStudyPlan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    if (!learnerId) { navigate('/login'); return }
    Promise.all([getLearner(learnerId), getCheckIns(learnerId), getStudyPlan(learnerId)])
      .then(([l, c, s]) => {
        setLearner(l.data.data)
        setCheckIns(c.data.data)
        setStudyPlan(s.data.data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [learnerId, navigate])

  async function handleGeneratePlan() {
    setGenerating(true)
    try {
      const res = await generateStudyPlan({ learnerId, week: 1 })
      setStudyPlan(res.data.data)
    } catch (err) {
      console.error(err)
    } finally {
      setGenerating(false)
    }
  }

  const skillScores = learner?.skillScores instanceof Map
    ? Object.fromEntries(learner.skillScores)
    : { ...(learner?.skillScores || {}) }

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div style={{ background: 'var(--color-ac-navy)' }} className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start justify-between mb-8"
        >
          <div>
            <h1 style={{ color: 'var(--color-ac-text)' }} className="text-2xl font-bold">
              {greeting}, {learnerName.split(' ')[0]} 👋
            </h1>
            <p style={{ color: 'var(--color-ac-subtext)' }} className="text-sm mt-1">
              Here's your learning overview for today
            </p>
          </div>
          <Link to="/dashboard/learner/checkin" className="btn-primary hidden sm:inline-flex">
            Weekly check-in →
          </Link>
        </motion.div>

        {loading ? (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <SkeletonCard h="h-20" /><SkeletonCard h="h-20" /><SkeletonCard h="h-20" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SkeletonCard h="h-48" /><SkeletonCard h="h-48" />
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3">
              <StatCard label="Learning style" value={learner?.learningStyle || '—'} />
              <StatCard label="Study goal" value={`${learner?.weeklyStudyHours}h`} sub="per week" />
              <StatCard label="Attendance" value={`${learner?.attendanceRate}%`} />
            </div>

            {/* Feature quick-access */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {FEATURE_CARDS.map((fc) => (
                <Link
                  key={fc.to}
                  to={fc.to}
                  style={{ background: 'var(--color-ac-surface)', border: '1px solid var(--color-ac-border)' }}
                  className="rounded-2xl p-4 flex items-start gap-3 hover:border-orange-500 transition-all group"
                >
                  <div style={{ background: fc.bg, color: fc.color }} className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0">
                    {fc.icon}
                  </div>
                  <div>
                    <p style={{ color: 'var(--color-ac-text)' }} className="text-sm font-semibold group-hover:text-orange-400 transition-colors">
                      {fc.title}
                    </p>
                    <p style={{ color: 'var(--color-ac-subtext)' }} className="text-xs mt-0.5">{fc.desc}</p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Skill map + Burnout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SkillMap skillScores={skillScores} />
              <BurnoutMeter learnerId={learnerId} initialScore={learner?.burnoutScore} initialLabel={learner?.burnoutLabel} />
            </div>

            {/* Mood + Study plan */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <MoodCard checkIns={checkIns} />
              <StudyPlanCalendar plan={studyPlan} />
            </div>

            {/* Generate plan CTA */}
            {!studyPlan && (
              <button
                type="button"
                onClick={handleGeneratePlan}
                disabled={generating}
                style={{
                  background: 'transparent',
                  border: `2px dashed var(--color-ac-border)`,
                  color: 'var(--color-ac-subtext)',
                }}
                className="w-full rounded-2xl py-4 text-sm font-medium hover:border-orange-500 hover:text-orange-400 disabled:opacity-40 transition-all"
              >
                {generating ? '⏳ Generating your AI study plan...' : '+ Generate this week\'s AI study plan'}
              </button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}
