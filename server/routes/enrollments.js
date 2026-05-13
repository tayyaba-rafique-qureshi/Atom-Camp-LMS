import express from 'express'
import Enrollment from '../models/Enrollment.js'
import Course from '../models/Course.js'
import { allowRoles } from '../middleware/authMiddleware.js'

const router = express.Router()

// POST /api/enrollments — learner enrolls in a course
router.post('/', allowRoles('learner'), async (req, res) => {
  try {
    const { learnerId, courseId } = req.body
    if (!learnerId || !courseId) {
      return res.status(400).json({ success: false, error: 'learnerId and courseId are required' })
    }

    // Check course exists and is active
    const course = await Course.findById(courseId)
    if (!course || !course.isActive) {
      return res.status(404).json({ success: false, error: 'Course not found or inactive' })
    }

    // Check enrollment cap
    const count = await Enrollment.countDocuments({ courseId, status: 'active' })
    if (count >= course.maxEnrollments) {
      return res.status(400).json({ success: false, error: 'Course is full' })
    }

    // Build initial progress array (one entry per module)
    const progress = course.modules.map((_, i) => ({ moduleIndex: i, isCompleted: false }))

    const enrollment = await Enrollment.create({ learnerId, courseId, progress })
    const populated = await enrollment.populate('courseId', 'title slug category level durationWeeks durationMonths thumbnail tags')
    res.status(201).json({ success: true, data: populated })
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, error: 'Already enrolled in this course' })
    }
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET /api/enrollments/learner/:learnerId — all enrollments for a learner
router.get('/learner/:learnerId', async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ learnerId: req.params.learnerId })
      .populate('courseId', 'title slug category level durationWeeks durationMonths thumbnail tags shortDesc modules instructorName')
      .sort({ enrolledAt: -1 })
    res.json({ success: true, data: enrollments })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET /api/enrollments/course/:courseId — all enrollments for a course (instructor/coordinator/admin)
router.get('/course/:courseId', allowRoles('instructor', 'coordinator', 'admin'), async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ courseId: req.params.courseId })
      .populate('learnerId', 'name email attendanceRate burnoutScore burnoutLabel')
      .sort({ enrolledAt: -1 })
    res.json({ success: true, data: enrollments })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// GET /api/enrollments/all — all enrollments (coordinator/admin)
router.get('/all', allowRoles('coordinator', 'admin'), async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate('learnerId', 'name email burnoutLabel')
      .populate('courseId', 'title category')
      .sort({ enrolledAt: -1 })
    res.json({ success: true, data: enrollments })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// PATCH /api/enrollments/:id/progress — learner marks a module complete
router.patch('/:id/progress', allowRoles('learner'), async (req, res) => {
  try {
    const { moduleIndex } = req.body
    const enrollment = await Enrollment.findById(req.params.id).populate('courseId', 'modules')
    if (!enrollment) return res.status(404).json({ success: false, error: 'Enrollment not found' })

    // Mark module complete
    const mod = enrollment.progress.find((p) => p.moduleIndex === moduleIndex)
    if (mod) {
      mod.isCompleted = true
      mod.completedAt = new Date()
    } else {
      enrollment.progress.push({ moduleIndex, isCompleted: true, completedAt: new Date() })
    }

    // Recalculate overall progress %
    const totalModules = enrollment.courseId?.modules?.length || enrollment.progress.length
    const completedCount = enrollment.progress.filter((p) => p.isCompleted).length
    enrollment.progressPct = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0

    // Auto-complete if all modules done
    if (enrollment.progressPct === 100) {
      enrollment.status = 'completed'
      enrollment.completedAt = new Date()
    }

    await enrollment.save()
    res.json({ success: true, data: enrollment })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// PATCH /api/enrollments/:id — instructor/coordinator updates status, grade, notes
router.patch('/:id', allowRoles('instructor', 'coordinator', 'admin'), async (req, res) => {
  try {
    const { status, grade, notes } = req.body
    const update = {}
    if (status) update.status = status
    if (grade !== undefined) update.grade = grade
    if (notes !== undefined) update.notes = notes
    if (status === 'completed') update.completedAt = new Date()

    const enrollment = await Enrollment.findByIdAndUpdate(req.params.id, update, { new: true })
      .populate('learnerId', 'name email')
      .populate('courseId', 'title')
    if (!enrollment) return res.status(404).json({ success: false, error: 'Enrollment not found' })
    res.json({ success: true, data: enrollment })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// DELETE /api/enrollments/:id — learner drops a course
router.delete('/:id', allowRoles('learner', 'admin'), async (req, res) => {
  try {
    await Enrollment.findByIdAndUpdate(req.params.id, { status: 'dropped' })
    res.json({ success: true, message: 'Dropped from course' })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

export default router
