import { ref } from 'vue'

export interface AuthUser {
  id: number
  fullName: string | null
  email: string
  documentType: string
  document: string | null
  role: string
  phone: string | null
  createdAt: string
  updatedAt: string | null
}

interface LoginPayload {
  email: string
  password: string
}

interface AuthResponse {
  user: AuthUser
  token: string
}

interface ApiWrappedResponse<T> {
  data: T
}

const TOKEN_KEY = 'apartacho_token'
const USER_KEY = 'apartacho_user'

const user = ref<AuthUser | null>(readUser())

function getApiBaseUrl() {
  return import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3333/api/v1'
}

function readUser(): AuthUser | null {
  if (typeof window === 'undefined') {
    return null
  }

  const stored = localStorage.getItem(USER_KEY)
  if (!stored) {
    return null
  }

  try {
    return normalizeUser(JSON.parse(stored))
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

function clearSession() {
  if (typeof window === 'undefined') {
    return
  }

  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
  user.value = null
}

function normalizeUser(raw: unknown): AuthUser {
  if (!raw || typeof raw !== 'object') {
    throw new Error('Respuesta de usuario invalida.')
  }

  const candidate = raw as Record<string, unknown>

  if (
    typeof candidate.id !== 'number' ||
    typeof candidate.email !== 'string' ||
    (candidate.fullName !== null && typeof candidate.fullName !== 'string') ||
    typeof candidate.documentType !== 'string' ||
    (candidate.document !== null && typeof candidate.document !== 'string') ||
    typeof candidate.role !== 'string' ||
    (candidate.phone !== null && typeof candidate.phone !== 'string') ||
    typeof candidate.createdAt !== 'string' ||
    (candidate.updatedAt !== null && typeof candidate.updatedAt !== 'string')
  ) {
    throw new Error('Respuesta de usuario invalida.')
  }

  return candidate as unknown as AuthUser
}

function normalizeAuthResponse(body: unknown): AuthResponse {
  const wrapped = body as Partial<ApiWrappedResponse<AuthResponse>>
  const direct = body as Partial<AuthResponse>

  const payload = wrapped.data ?? direct

  if (!payload?.token || !payload?.user) {
    throw new Error('Respuesta de autenticacion invalida.')
  }

  return {
    token: payload.token,
    user: normalizeUser(payload.user),
  }
}

function saveSession(data: AuthResponse) {
  localStorage.setItem(TOKEN_KEY, data.token)
  localStorage.setItem(USER_KEY, JSON.stringify(data.user))
  user.value = data.user
}

async function request(path: string, payload: LoginPayload) {
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

  return normalizeAuthResponse(body)
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
    const data = await request('/auth/login', payload)
    saveSession(data)
    return data
  }

  function logout() {
    clearSession()
  }

  return {
    user,
    login,
    logout,
  }
}

if (typeof window !== 'undefined' && !readToken()) {
  clearSession()
}
