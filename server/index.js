import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { connectDB } from './db.js'
import { protect } from './middleware/authMiddleware.js'

import authRouter from './routes/auth.js'
import learnersRouter from './routes/learners.js'
import careerGpsRouter from './routes/careerGps.js'
import moodRouter from './routes/mood.js'
import burnoutRouter from './routes/burnout.js'
import studyPlanRouter from './routes/studyPlan.js'
import coursesRouter from './routes/courses.js'
import enrollmentsRouter from './routes/enrollments.js'

await connectDB()

const app = express()
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }))
app.use(express.json())

app.use('/api/auth', authRouter)
app.get('/api/health', (_, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }))

app.use('/api/learners', protect, learnersRouter)
app.use('/api/career-gps', protect, careerGpsRouter)
app.use('/api/mood', protect, moodRouter)
app.use('/api/burnout', protect, burnoutRouter)
app.use('/api/study-plan', protect, studyPlanRouter)
app.use('/api/courses', protect, coursesRouter)
app.use('/api/enrollments', protect, enrollmentsRouter)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
