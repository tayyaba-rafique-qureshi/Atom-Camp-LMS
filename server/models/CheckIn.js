import mongoose from 'mongoose'

const checkInSchema = new mongoose.Schema(
  {
    learnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Learner', required: true, index: true },
    week: { type: Number, required: true },
    text: { type: String, required: true },
    mood: { type: String, default: 'neutral' },
    engagementScore: { type: Number, default: 50 },
    aiFeedback: { type: String, default: '' },
    flagInstructor: { type: Boolean, default: false },
  },
  { timestamps: true }
)

// TTL index: auto-delete check-ins after 90 days
checkInSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 90 })

export default mongoose.models.CheckIn || mongoose.model('CheckIn', checkInSchema)
