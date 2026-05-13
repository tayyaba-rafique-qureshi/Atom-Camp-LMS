import express from 'express'
import Course from '../models/Course.js'
import { allowRoles } from '../middleware/authMiddleware.js'

const router = express.Router()

// GET /api/courses — all active courses (any authenticated user)
router.get('/', async (req, res) => {
  try {
    const { category, level } = req.query
    const filter = { isActive: true }
    if (category) filter.category = category
    if (level) filter.level = level
    const courses = await Course.find(filter).sort({ category: 1, title: 1 })
    res.json({ success: true, data: courses })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET /api/courses/:id — single course
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
    if (!course) return res.status(404).json({ success: false, error: 'Course not found' })
    res.json({ success: true, data: course })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// POST /api/courses — create course (admin only)
router.post('/', allowRoles('admin'), async (req, res) => {
  try {
    const course = await Course.create(req.body)
    res.status(201).json({ success: true, data: course })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// PUT /api/courses/:id — update course (admin or instructor)
router.put('/:id', allowRoles('admin', 'instructor'), async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!course) return res.status(404).json({ success: false, error: 'Course not found' })
    res.json({ success: true, data: course })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// DELETE /api/courses/:id — soft-delete (admin only)
router.delete('/:id', allowRoles('admin'), async (req, res) => {
  try {
    await Course.findByIdAndUpdate(req.params.id, { isActive: false })
    res.json({ success: true, message: 'Course deactivated' })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

export default router
