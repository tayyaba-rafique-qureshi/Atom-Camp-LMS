import express from 'express'
import { callAI } from '../lib/ai.js'
import { MOOD_PROMPT } from '../lib/prompts.js'
import CheckIn from '../models/CheckIn.js'

const router = express.Router()

router.post('/', async (req, res) => {
  try {
    const { learnerId, week, text } = req.body
    const result = await callAI(MOOD_PROMPT, `Learner weekly check-in: "${text}"`)
    const checkIn = await CheckIn.create({
      learnerId,
      week,
      text,
      mood: result.mood,
      engagementScore: result.engagement_score,
      aiFeedback: result.feedback,
      flagInstructor: result.flag_instructor,
    })
    res.json({ success: true, data: { checkIn, aiResult: result } })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

router.get('/:learnerId', async (req, res) => {
  try {
    const checkIns = await CheckIn.find({ learnerId: req.params.learnerId }).sort({ createdAt: -1 }).limit(8)
    res.json({ success: true, data: checkIns })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

export default router
