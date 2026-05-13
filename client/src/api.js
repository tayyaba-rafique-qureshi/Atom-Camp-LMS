import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const registerUser = (data) => api.post('/auth/register', data)
export const loginUser = (data) => api.post('/auth/login', data)
export const getMe = () => api.get('/auth/me')

export const getLearner = (id) => api.get(`/learners/${id}`)
export const getAllLearners = () => api.get('/learners')
export const updateLearner = (id, data) => api.put(`/learners/${id}`, data)

export const generateCareerGPS = (data) => api.post('/career-gps', data)
export const getCareerRoadmap = (id) => api.get(`/career-gps/${id}`)

export const submitCheckIn = (data) => api.post('/mood', data)
export const getCheckIns = (id) => api.get(`/mood/${id}`)

export const analyzeBurnout = (id) => api.post(`/burnout/${id}`)

export const generateStudyPlan = (data) => api.post('/study-plan', data)
export const getStudyPlan = (id) => api.get(`/study-plan/${id}`)
