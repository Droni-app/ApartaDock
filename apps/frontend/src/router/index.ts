import { createRouter, createWebHistory } from 'vue-router'
import routes from '~pages'
import { getAuthUser, hasToken } from '../composables/useAuth'

const publicPaths = new Set(['/auth/login'])

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const isAuthenticated = hasToken()
  const isPublic = publicPaths.has(to.path)
  const isAdminRoute = to.path === '/admin' || to.path.startsWith('/admin/')

  if (!isAuthenticated && !isPublic) {
    return { path: '/auth/login', query: { redirect: to.fullPath } }
  }

  if (isAuthenticated && isAdminRoute) {
    const currentUser = getAuthUser()

    if (currentUser?.role !== 'admin') {
      return { path: '/units' }
    }
  }

  if (isAuthenticated && isPublic) {
    return { path: '/units' }
  }

  return true
})

export default router
