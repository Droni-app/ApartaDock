import axios from 'axios'

const TOKEN_KEY = 'apartacho_token'

function getApiBaseUrl() {
  return import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3333/api/v1'
}

function readToken() {
  if (typeof window === 'undefined') {
    return null
  }

  const token = localStorage.getItem(TOKEN_KEY)
  if (!token || token === 'undefined' || token === 'null') {
    return null
  }

  return token
}

export const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    Accept: 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = readToken()

  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`)
  }

  return config
})
