import express from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import Learner from '../models/Learner.js'

const router = express.Router()

function generateToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

function normalizeSkillScores(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {}
  return Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, Number(v)]))
}

// ────────────────────────────────────────────────────────────────────────────
// PUBLIC REGISTRATION — Learners only
// Staff (instructor / coordinator / admin) accounts are created by the admin
// via seed.js or the Admin Dashboard — never via this public endpoint.
// ────────────────────────────────────────────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, learningStyle, goal, weeklyStudyHours, skillScores } = req.body

    // 🔒 Block staff self-registration
    if (role && role !== 'learner') {
      return res.status(403).json({
        success: false,
        error: 'Staff accounts (Instructor, Coordinator, Admin) are managed by the atomcamp administrator. Please log in with the credentials provided to you.',
      })
    }

    const exists = await User.findOne({ email })
    if (exists) return res.status(400).json({ success: false, error: 'Email already registered' })

    // Force role to learner regardless (safety net against forged requests)
    const user = await User.create({ name, email, password, role: 'learner' })

    const learner = await Learner.create({
      name,
      email,
      role: 'learner',
      learningStyle: learningStyle || 'visual',
      goal: goal || '',
      weeklyStudyHours: weeklyStudyHours || 10,
      skillScores: normalizeSkillScores(skillScores),
    })

    user.learnerId = learner._id
    await user.save()

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        learnerId: learner._id,
        token: generateToken(user._id),
      },
    })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' })
    }
    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        learnerId: user.learnerId,
        token: generateToken(user._id),
      },
    })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// ────────────────────────────────────────────────────────────────────────────
// ADMIN-ONLY: Create staff account
// Requires a valid admin JWT. Use from Admin Dashboard UI.
// ────────────────────────────────────────────────────────────────────────────
router.post('/admin/create-staff', async (req, res) => {
  try {
    // Verify the caller is an admin
    const header = req.headers.authorization
    if (!header?.startsWith('Bearer ')) return res.status(401).json({ success: false, error: 'No token' })

    const decoded = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET)
    const requestingUser = await User.findById(decoded.id)

    if (!requestingUser || requestingUser.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Only admins can create staff accounts.' })
    }

    const { name, email, password, role } = req.body
    const allowedStaffRoles = ['instructor', 'coordinator', 'admin']

    if (!allowedStaffRoles.includes(role)) {
      return res.status(400).json({ success: false, error: `Role must be one of: ${allowedStaffRoles.join(', ')}` })
    }

    const exists = await User.findOne({ email })
    if (exists) return res.status(400).json({ success: false, error: 'Email already registered' })

    const user = await User.create({ name, email, password, role })

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// ────────────────────────────────────────────────────────────────────────────
// GET /me — Verify token and return current user
// ────────────────────────────────────────────────────────────────────────────
router.get('/me', async (req, res) => {
  try {
    const header = req.headers.authorization
    if (!header?.startsWith('Bearer ')) return res.status(401).json({ success: false })
    const decoded = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET)
    const user = await User.findById(decoded.id).select('-password')
    res.json({ success: true, data: user })
  } catch {
    res.status(401).json({ success: false, error: 'Invalid token' })
  }
})

export default router
