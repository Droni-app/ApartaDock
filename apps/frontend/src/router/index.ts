import { createRouter, createWebHistory } from 'vue-router'
import routes from '~pages'
import { getAuthUser, hasToken } from '../composables/useAuth'

const publicPaths = new Set(['/auth/login', '/auth/password/update', '/auth/google/callback'])

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const isAuthenticated = hasToken()
  const isPublic = publicPaths.has(to.path)
  const isAdminRoute = to.path === '/admin' || to.path.startsWith('/admin/')
  const isBoardRoute = to.path === '/board' || to.path.startsWith('/board/')
  const isSecurityRoute = to.path === '/security' || to.path.startsWith('/security/')

  if (!isAuthenticated && !isPublic) {
    return { path: '/auth/login', query: { redirect: to.fullPath } }
  }

  if (isAuthenticated && isAdminRoute) {
    const currentUser = getAuthUser()

    if (currentUser?.role !== 'admin') {
      return { path: '/' }
    }
  }

  if (isAuthenticated && isBoardRoute) {
    const currentUser = getAuthUser()

    if (!['board', 'admin'].includes(currentUser?.role ?? '')) {
      return { path: '/' }
    }
  }

  if (isAuthenticated && isSecurityRoute) {
    const currentUser = getAuthUser()
    
    if (!['security', 'admin'].includes(currentUser?.role ?? '')) {
      return { path: '/' }
    }
  }

  if (isAuthenticated && isPublic) {
    return { path: '/' }
  }

  return true
})

export default router
