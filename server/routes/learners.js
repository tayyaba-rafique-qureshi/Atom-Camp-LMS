import express from 'express'
import Learner from '../models/Learner.js'

const router = express.Router()

router.post('/', async (req, res) => {
  try {
    const learner = await Learner.create(req.body)
    res.json({ success: true, data: learner })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

router.get('/', async (req, res) => {
  try {
    const learners = await Learner.find({ role: 'learner' }).sort({ createdAt: -1 })
    res.json({ success: true, data: learners })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const learner = await Learner.findById(req.params.id)
    res.json({ success: true, data: learner })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const learner = await Learner.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json({ success: true, data: learner })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

export default router
