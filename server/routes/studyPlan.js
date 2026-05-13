import express from 'express'
import { callAI } from '../lib/ai.js'
import { STUDY_PLAN_PROMPT } from '../lib/prompts.js'
import StudyPlan from '../models/StudyPlan.js'
import Learner from '../models/Learner.js'

const router = express.Router()

router.post('/', async (req, res) => {
  try {
    const { learnerId, week } = req.body
    const learner = await Learner.findById(learnerId)
    const skillScores =
      learner?.skillScores instanceof Map
        ? Object.fromEntries(learner.skillScores)
        : { ...(learner?.skillScores || {}) }
    const gaps = Object.entries(skillScores)
      .filter(([_, s]) => Number(s) < 60)
      .map(([t]) => t)
    const result = await callAI(
      STUDY_PLAN_PROMPT,
      `Skill gaps: ${gaps.join(', ')}. Burnout score: ${learner?.burnoutScore}. Weekly study hours: ${learner?.weeklyStudyHours}`
    )
    const plan = await StudyPlan.create({ learnerId, week, ...result })
    res.json({ success: true, data: plan })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

router.get('/:learnerId', async (req, res) => {
  try {
    const plan = await StudyPlan.findOne({ learnerId: req.params.learnerId }).sort({ createdAt: -1 })
    res.json({ success: true, data: plan })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

export default router
