import { ref } from 'vue'
import { api } from '../services/api'
import type { AuthResponse, AuthUser } from '../types/auth'

interface LoginPayload {
  email: string
  password: string
}

const TOKEN_KEY = 'apartadock_token'
const USER_KEY = 'apartadock_user'

const user = ref<AuthUser | null>(readUser())

function readUser(): AuthUser | null {
  const stored = localStorage.getItem(USER_KEY)
  if (!stored) return null

  try {
    return JSON.parse(stored)
  } catch {
    localStorage.removeItem(USER_KEY)
    return null
  }
}

function readToken(): string | null {
  if (typeof window === 'undefined') {
    return null
  }

  const token = localStorage.getItem(TOKEN_KEY)
  if (!token || token === 'undefined' || token === 'null') {
    return null
  }

  return token
}

function saveSession(data: AuthResponse) {
  localStorage.setItem(TOKEN_KEY, data.token)
  localStorage.setItem(USER_KEY, JSON.stringify(data.user))
  user.value = data.user
}


export function hasToken() {
  return Boolean(readToken())
}

export function getToken() {
  return readToken()
}

export function getAuthUser() {
  return user.value ?? readUser()
}

export function useAuth() {
  async function login(payload: LoginPayload) {
    await api.post<AuthResponse>('/auth/login', payload).then((response) => {
      const data = response.data
      saveSession(data)
      return data
    }).catch((error) => {
      console.error('Login error:', error)
      throw error
    })
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    user.value = null
  }

  async function sendPasswordReset(email: string) {
    await api.post<AuthResponse>('/auth/password/reset', { email }).then((response) => {
      const data = response.data
      console.log('Password reset request sent:', data)
      return data
    }).catch((error) => {
      console.error('Password reset error:', error)
      throw error
    })
  }

  return {
    user,
    login,
    logout,
    sendPasswordReset,
  }
}