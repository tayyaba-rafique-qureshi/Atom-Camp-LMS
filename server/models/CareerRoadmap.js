import mongoose from 'mongoose'

const careerRoadmapSchema = new mongoose.Schema(
  {
    learnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Learner', required: true },
    goal: { type: String, required: true },
    timeline_weeks: { type: Number, default: 12 },
    summary: { type: String, default: '' },
    milestones: [{ week: Number, title: String, skills: [String] }],
    gaps: [String],
    atomcamp_courses: [{ name: String, covers: [String], priority: String }],
  },
  { timestamps: true }
)

export default mongoose.models.CareerRoadmap || mongoose.model('CareerRoadmap', careerRoadmapSchema)
