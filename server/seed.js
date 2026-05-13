/**
 * Seed script for atomcamp LMS demo data
 * Run: node seed.js
 */
import 'dotenv/config'
import mongoose from 'mongoose'
import { connectDB } from './db.js'
import User from './models/User.js'
import Learner from './models/Learner.js'
import CheckIn from './models/CheckIn.js'
import Course from './models/Course.js'
import Enrollment from './models/Enrollment.js'

const DEMO_USERS = [
  {
    name: 'Sara Ahmed',
    email: 'demo@learner.com',
    password: 'demo123',
    role: 'learner',
    learner: {
      learningStyle: 'visual',
      goal: 'Become an AI Engineer',
      weeklyStudyHours: 20,
      attendanceRate: 85,
      burnoutScore: 42,
      burnoutLabel: 'at_risk',
      skillScores: {
        Python: 65,
        JavaScript: 40,
        'HTML/CSS': 55,
        'Data Analysis': 30,
        'Machine Learning': 20,
        SQL: 45,
        React: 35,
        'Node.js': 25,
      },
    },
  },
  {
    name: 'Ali Hassan',
    email: 'demo2@learner.com',
    password: 'demo123',
    role: 'learner',
    learner: {
      learningStyle: 'kinesthetic',
      goal: 'Become a Data Scientist',
      weeklyStudyHours: 15,
      attendanceRate: 92,
      burnoutScore: 18,
      burnoutLabel: 'healthy',
      skillScores: {
        Python: 80,
        JavaScript: 30,
        'HTML/CSS': 20,
        'Data Analysis': 70,
        'Machine Learning': 55,
        SQL: 75,
        React: 15,
        'Node.js': 10,
      },
    },
  },
  {
    name: 'Fatima Khan',
    email: 'demo3@learner.com',
    password: 'demo123',
    role: 'learner',
    learner: {
      learningStyle: 'reading',
      goal: 'Become a Full Stack Developer',
      weeklyStudyHours: 10,
      attendanceRate: 60,
      burnoutScore: 78,
      burnoutLabel: 'critical',
      skillScores: {
        Python: 20,
        JavaScript: 60,
        'HTML/CSS': 75,
        'Data Analysis': 15,
        'Machine Learning': 5,
        SQL: 30,
        React: 50,
        'Node.js': 40,
      },
    },
  },
  {
    name: 'Dr. Naveed',
    email: 'demo@instructor.com',
    password: 'demo123',
    role: 'instructor',
  },
  {
    name: 'Coordinator Zara',
    email: 'demo@coordinator.com',
    password: 'demo123',
    role: 'coordinator',
  },
  {
    name: 'Admin User',
    email: 'demo@admin.com',
    password: 'demo123',
    role: 'admin',
  },
]

const DEMO_CHECKINS = [
  { mood: 'overwhelmed', text: "I'm struggling to keep up with the pace. The last few sessions felt overwhelming.", engagementScore: 35, aiFeedback: "It's okay to feel overwhelmed — take it one step at a time and reach out to your instructor.", flagInstructor: true, week: 3 },
  { mood: 'anxious', text: "Feeling anxious about the upcoming project deadline.", engagementScore: 50, aiFeedback: "Break the project into smaller tasks and tackle them one by one — you've got this!", flagInstructor: false, week: 2 },
  { mood: 'motivated', text: "Had a great session today, finally understood neural networks!", engagementScore: 88, aiFeedback: "That breakthrough feeling is amazing — keep riding that momentum!", flagInstructor: false, week: 1 },
]

async function seed() {
  console.log('🌱 Connecting to MongoDB...')
  await connectDB()

  console.log('🗑️  Clearing existing demo data...')
  const demoEmails = DEMO_USERS.map((u) => u.email)
  const existingUsers = await User.find({ email: { $in: demoEmails } })
  const existingLearnerIds = existingUsers.map((u) => u.learnerId).filter(Boolean)

  await CheckIn.deleteMany({ learnerId: { $in: existingLearnerIds } })
  await Learner.deleteMany({ email: { $in: demoEmails } })
  await User.deleteMany({ email: { $in: demoEmails } })

  console.log('👤 Creating demo users...')
  for (const u of DEMO_USERS) {
    const user = await User.create({
      name: u.name,
      email: u.email,
      password: u.password,
      role: u.role,
    })

    if (u.role === 'learner' && u.learner) {
      const learner = await Learner.create({
        name: u.name,
        email: u.email,
        role: u.role,
        ...u.learner,
      })
      user.learnerId = learner._id
      await user.save()

      // Add check-ins for first learner
      if (u.email === 'demo@learner.com') {
        for (const ci of DEMO_CHECKINS) {
          await CheckIn.create({ learnerId: learner._id, ...ci })
        }
        console.log(`  ✅ ${u.name} (learner) + ${DEMO_CHECKINS.length} check-ins`)
      } else {
        console.log(`  ✅ ${u.name} (learner)`)
      }
    } else {
      console.log(`  ✅ ${u.name} (${u.role})`)
    }
  }

  console.log('\n🎉 Seed complete! Demo accounts:')
  console.log('  Learner:     demo@learner.com     / demo123')
  console.log('  Learner 2:   demo2@learner.com    / demo123')
  console.log('  Learner 3:   demo3@learner.com    / demo123')
  console.log('  Instructor:  demo@instructor.com  / demo123')
  console.log('  Coordinator: demo@coordinator.com / demo123')
  console.log('  Admin:       demo@admin.com       / demo123')

  await mongoose.disconnect()
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})
