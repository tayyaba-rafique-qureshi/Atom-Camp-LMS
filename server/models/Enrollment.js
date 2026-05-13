import mongoose from 'mongoose'

const progressItemSchema = new mongoose.Schema({
  moduleIndex: { type: Number, required: true },
  isCompleted: { type: Boolean, default: false },
  completedAt: { type: Date, default: null },
})

const enrollmentSchema = new mongoose.Schema(
  {
    learnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Learner',
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'dropped', 'paused'],
      default: 'active',
    },
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    progress: [progressItemSchema],
    progressPct: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    grade: {
      type: Number,
      default: null,
      min: 0,
      max: 100,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
)

// Unique constraint: one learner can only enroll in a course once
enrollmentSchema.index({ learnerId: 1, courseId: 1 }, { unique: true })

// Index for querying enrollments by learner or course
enrollmentSchema.index({ learnerId: 1, status: 1 })
enrollmentSchema.index({ courseId: 1, status: 1 })

export default mongoose.models.Enrollment || mongoose.model('Enrollment', enrollmentSchema)
