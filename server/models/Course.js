import mongoose from 'mongoose'

const moduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  durationHours: { type: Number, default: 2 },
  order: { type: Number, default: 0 },
})

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: {
      type: String,
      enum: ['bootcamp', 'course', 'specialized'],
      default: 'course',
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    description: { type: String, default: '' },
    shortDesc: { type: String, default: '' },
    durationWeeks: { type: Number, default: 4 },
    durationMonths: { type: Number, default: 0 },
    price: { type: Number, default: 0 },          // PKR
    currency: { type: String, default: 'PKR' },
    tags: [String],                                // skills covered
    modules: [moduleSchema],
    instructorName: { type: String, default: '' },
    instructorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    maxEnrollments: { type: Number, default: 100 },
    isActive: { type: Boolean, default: true },
    thumbnail: { type: String, default: '' },      // emoji or URL
    startDate: { type: Date, default: null },
  },
  { timestamps: true }
)

courseSchema.index({ category: 1, isActive: 1 })

export default mongoose.models.Course || mongoose.model('Course', courseSchema)
