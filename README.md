# atomcamp Smart Adaptive LMS

> Built for atomcamp Hackathon 2025 · Powered by Gemini AI + MongoDB

A production-ready Learning Management System with 4 AI-powered modules that personalize the learning journey, predict burnout, and keep learners on track.

---

## 🚀 Features

| Module | Description |
|--------|-------------|
| 🧭 **Career GPS** | Enter a career goal → AI generates a personalized roadmap with milestones, skill gaps, and atomcamp course recommendations |
| 🔥 **Burnout Predictor** | Analyzes behavioral signals (attendance, mood history, engagement) to predict burnout risk with a 0–100 score |
| 💬 **Mood Check-in** | Weekly text-based check-ins analyzed by AI for mood, engagement score, and personalized feedback |
| 📅 **AI Study Planner** | Generates a 5-day adaptive study schedule based on skill gaps, burnout score, and available hours |

---

## 🛠️ Tech Stack

- **Frontend**: React 19 + Vite + Tailwind CSS v4 + Framer Motion
- **Backend**: Node.js + Express
- **Database**: MongoDB + Mongoose
- **AI**: Google Gemini API (gemini-2.0-flash)
- **Auth**: JWT

---

## ⚡ Quick Start

### 1. Clone & install

```bash
# Frontend
cd client
npm install

# Backend
cd server
npm install
```

### 2. Configure environment

```bash
# Copy and fill in your values
cp server/.env.example server/.env
```

Required values in `server/.env`:
```
MONGODB_URI=mongodb://localhost:27017/atomcamp_lms
GEMINI_API_KEY=your_key_from_aistudio.google.com
JWT_SECRET=any_random_secret_string
```

### 3. Seed demo data

```bash
cd server
node seed.js
```

### 4. Run

```bash
# Terminal 1 — Backend
cd server
npm run dev

# Terminal 2 — Frontend
cd client
npm run dev
```

Open http://localhost:5173

---

## 🔑 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Learner (at risk) | demo@learner.com | demo123 |
| Learner (healthy) | demo2@learner.com | demo123 |
| Learner (critical) | demo3@learner.com | demo123 |
| Instructor | demo@instructor.com | demo123 |
| Coordinator | demo@coordinator.com | demo123 |
| Admin | demo@admin.com | demo123 |

---

## 🧪 Test Scenarios

**Career GPS**: Login as `demo@learner.com` → Career GPS → Enter "Become an AI Engineer"

**Burnout**: Login as `demo@learner.com` → Dashboard → Click "Refresh ↻" on Burnout Risk card

**Mood Check-in**: Login as `demo@learner.com` → Check-in → Use "⚡ Demo text" button

**Study Plan**: Login as `demo@learner.com` → Study Plan → Click "Generate Plan"

---

## 📁 Project Structure

```
client/src/
  components/     # BurnoutMeter, MoodCard, SkillMap, StudyPlanCalendar, Navbar
  pages/          # Dashboard, CareerGPS, CheckIn, StudyPlan, Instructor, ...
  api.js          # Axios API calls
  auth.js         # JWT auth helpers

server/
  routes/         # careerGps, mood, burnout, studyPlan, auth, learners
  models/         # User, Learner, CheckIn, CareerRoadmap, StudyPlan
  lib/            # ai.js (Gemini), prompts.js
  middleware/     # authMiddleware.js
  seed.js         # Demo data seeder
```

---

## 🎨 Brand

Colors extracted from atomcamp.com:
- Primary: `#f97316` (orange)
- Background: `#0d1117` (navy)
- Surface: `#1c2333`
- Text: `#e6edf3`

---

*Built for Aurex AI Hackathon 2026*
