import mongoose from 'mongoose'

const learnerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, default: 'learner' },
    learningStyle: { type: String, enum: ['visual', 'auditory', 'reading', 'kinesthetic'], default: 'visual' },
    goal: { type: String, default: '' },
    weeklyStudyHours: { type: Number, default: 10 },
    skillScores: { type: mongoose.Schema.Types.Mixed, default: {} },
    attendanceRate: { type: Number, default: 100 },
    burnoutScore: { type: Number, default: 0 },
    burnoutLabel: { type: String, default: 'healthy' },
  },
  { timestamps: true }
)

export default mongoose.models.Learner || mongoose.model('Learner', learnerSchema)
