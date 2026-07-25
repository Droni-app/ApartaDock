import { createRouter, createWebHistory } from 'vue-router'
import routes from '~pages'
import { hasToken } from '../composables/useAuth'

const publicPaths = new Set(['/auth/login', '/auth/register'])

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const isAuthenticated = hasToken()
  const isPublic = publicPaths.has(to.path)

  if (!isAuthenticated && !isPublic) {
    return { path: '/auth/login', query: { redirect: to.fullPath } }
  }

  if (isAuthenticated && isPublic) {
    return { path: '/units' }
  }

  return true
})

export default router
