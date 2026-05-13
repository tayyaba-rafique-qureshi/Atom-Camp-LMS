import express from 'express'
import { callAI } from '../lib/ai.js'
import { CAREER_GPS_PROMPT } from '../lib/prompts.js'
import CareerRoadmap from '../models/CareerRoadmap.js'
import Learner from '../models/Learner.js'

const router = express.Router()

router.post('/', async (req, res) => {
  try {
    const { learnerId, goal } = req.body
    const learner = await Learner.findById(learnerId)
    const skillScores =
      learner?.skillScores instanceof Map
        ? Object.fromEntries(learner.skillScores)
        : { ...(learner?.skillScores || {}) }
    const result = await callAI(CAREER_GPS_PROMPT, `Career goal: ${goal}. Current skills: ${JSON.stringify(skillScores)}`)
    const roadmap = await CareerRoadmap.create({ learnerId, ...result, goal })
    res.json({ success: true, data: roadmap })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

router.get('/:learnerId', async (req, res) => {
  try {
    const roadmap = await CareerRoadmap.findOne({ learnerId: req.params.learnerId }).sort({ createdAt: -1 })
    res.json({ success: true, data: roadmap })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

export default router
