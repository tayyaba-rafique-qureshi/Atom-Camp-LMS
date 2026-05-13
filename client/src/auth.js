export const saveAuth = (d) => {
  localStorage.setItem('token', d.token)
  localStorage.setItem('userId', d._id)
  localStorage.setItem('userRole', d.role)
  localStorage.setItem('userName', d.name)
  localStorage.setItem('learnerId', d.learnerId || '')
}

export const clearAuth = () =>
  ['token', 'userId', 'userRole', 'userName', 'learnerId'].forEach((k) => localStorage.removeItem(k))

export const getRole = () => localStorage.getItem('userRole')
export const isLoggedIn = () => !!localStorage.getItem('token')
export const getLearnerId = () => localStorage.getItem('learnerId')
export const getUserName = () => localStorage.getItem('userName')

export const getRoleHome = (role) =>
  (
    {
      learner: '/dashboard/learner',
      instructor: '/dashboard/instructor',
      coordinator: '/dashboard/coordinator',
      admin: '/dashboard/admin',
    }[role] || '/login'
  )
