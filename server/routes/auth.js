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

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, learningStyle, goal, weeklyStudyHours, skillScores } = req.body
    const exists = await User.findOne({ email })
    if (exists) return res.status(400).json({ success: false, error: 'Email already registered' })

    const user = await User.create({ name, email, password, role })
    let learnerId = null

    if (role === 'learner') {
      const learner = await Learner.create({
        name,
        email,
        role,
        learningStyle: learningStyle || 'visual',
        goal: goal || '',
        weeklyStudyHours: weeklyStudyHours || 10,
        skillScores: normalizeSkillScores(skillScores),
      })
      learnerId = learner._id
      user.learnerId = learnerId
      await user.save()
    }

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        learnerId,
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
