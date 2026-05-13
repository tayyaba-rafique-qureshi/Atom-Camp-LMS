import express from 'express'
import { callAI } from '../lib/ai.js'
import { BURNOUT_PROMPT } from '../lib/prompts.js'
import Learner from '../models/Learner.js'
import CheckIn from '../models/CheckIn.js'

const router = express.Router()

router.post('/:learnerId', async (req, res) => {
  try {
    const { learnerId } = req.params
    const learner = await Learner.findById(learnerId)
    const recentCheckIns = await CheckIn.find({ learnerId }).sort({ createdAt: -1 }).limit(4)
    const signals = {
      attendanceRate: learner?.attendanceRate,
      recentMoods: recentCheckIns.map((c) => c.mood),
      recentEngagementScores: recentCheckIns.map((c) => c.engagementScore),
      flaggedCount: recentCheckIns.filter((c) => c.flagInstructor).length,
    }
    const result = await callAI(BURNOUT_PROMPT, `Student signals: ${JSON.stringify(signals)}`)
    await Learner.findByIdAndUpdate(learnerId, { burnoutScore: result.risk_score, burnoutLabel: result.label })
    res.json({ success: true, data: result })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

export default router
