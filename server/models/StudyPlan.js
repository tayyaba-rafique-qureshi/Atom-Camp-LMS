import mongoose from 'mongoose'

const daySchema = new mongoose.Schema({
  day: String,
  topic: String,
  duration_minutes: Number,
  activity_type: String,
  reason: String,
})

const studyPlanSchema = new mongoose.Schema(
  {
    learnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Learner', required: true },
    week: { type: Number, required: true },
    week_summary: { type: String, default: '' },
    total_hours: { type: Number, default: 0 },
    days: [daySchema],
  },
  { timestamps: true }
)

export default mongoose.models.StudyPlan || mongoose.model('StudyPlan', studyPlanSchema)
