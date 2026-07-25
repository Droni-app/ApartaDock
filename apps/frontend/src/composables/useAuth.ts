import { ref } from 'vue'

export type DocumentType = 'CC' | 'CE' | 'TI' | 'PP'

export interface AuthUser {
  id: number
  fullName: string | null
  email: string
}

interface LoginPayload {
  email: string
  password: string
}

interface SignupPayload extends LoginPayload {
  fullName: string | null
  documentType: DocumentType
  document: string
  passwordConfirmation: string
}

interface AuthResponse {
  user: AuthUser
  token: string
}

const TOKEN_KEY = 'apartacho_token'
const USER_KEY = 'apartacho_user'

const user = ref<AuthUser | null>(readUser())

function getApiBaseUrl() {
  return import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3333/api/v1'
}

function readUser(): AuthUser | null {
  const stored = localStorage.getItem(USER_KEY)
  if (!stored) {
    return null
  }

  try {
    return JSON.parse(stored) as AuthUser
  } catch {
    localStorage.removeItem(USER_KEY)
    return null
  }
}

function saveSession(data: AuthResponse) {
  localStorage.setItem(TOKEN_KEY, data.token)
  localStorage.setItem(USER_KEY, JSON.stringify(data.user))
  user.value = data.user
}

async function request(path: string, payload: LoginPayload | SignupPayload) {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const body = await response.json().catch(() => ({}))

  if (!response.ok) {
    const message =
      body?.errors?.[0]?.message ?? body?.message ?? 'No se pudo completar la solicitud.'
    throw new Error(message)
  }

  return body as AuthResponse
}

export function hasToken() {
  return Boolean(localStorage.getItem(TOKEN_KEY))
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function useAuth() {
  async function login(payload: LoginPayload) {
    const data = await request('/auth/login', payload)
    saveSession(data)
    return data
  }

  async function signup(payload: SignupPayload) {
    const data = await request('/auth/signup', payload)
    saveSession(data)
    return data
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    user.value = null
  }

  return {
    user,
    login,
    signup,
    logout,
  }
}
