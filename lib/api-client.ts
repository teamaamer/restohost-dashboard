// Direct API client for Sammai - matches dashboard-react-main pattern
import axios, { AxiosError } from 'axios'

// Use NEXT_PUBLIC_API_URL when available, fallback to localhost
// In Next.js, environment variables must be accessed differently in browser vs server
const API_URL = typeof window !== 'undefined' 
  ? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000')
  : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000')

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Store auth token in memory (will be managed by auth store)
let authToken: string | null = null

export const setAuthToken = (token: string | null) => {
  authToken = token
}

// Add auth token to requests
api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`
  }
  return config
})

// Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      authToken = null
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// Types
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  page_size: number
  pages: number
}

export interface Call {
  id: string
  tenant_id: string
  twilio_call_sid: string | null
  from_number: string
  from_number_masked: string
  to_number: string
  started_at: string
  ended_at: string | null
  duration_seconds: number | null
  status: string
  outcome: string | null
  recording_url: string | null
  recording_duration: number | null
  escalated: boolean
  escalation_reason: string | null
  summary: string | null
  created_at: string
  updated_at: string
  transcript?: {
    id: string
    text: string
    segments_json: any[]
  }
  events?: any[]
}

export interface Order {
  id: string
  tenant_id: string
  call_id: string | null
  order_number: string
  customer_name: string
  customer_phone: string
  customer_phone_masked: string
  customer_email: string | null
  pickup_time: string
  items_json: Array<{
    item_id?: string
    name: string
    quantity: number
    price_cents: number
    modifiers?: any[]
  }>
  subtotal_cents: number
  tax_cents: number
  total_cents: number
  notes: string | null
  status: string
  payment_status: string
  payment_link: string | null
  confirmation_sent: boolean
  created_at: string
  updated_at: string
}

export interface Tenant {
  id: string
  name: string
  timezone: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  tenant_id: string
  email: string
  full_name: string
  role: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface TokenResponse {
  access_token: string
  refresh_token: string
  token_type: string
}

// Auth API
export const auth = {
  login: async (email: string, password: string): Promise<TokenResponse> => {
    const response = await api.post('/auth/login', { email, password })
    return response.data
  },

  refresh: async (refreshToken: string): Promise<TokenResponse> => {
    const response = await api.post('/auth/refresh', { refresh_token: refreshToken })
    return response.data
  },

  me: async (): Promise<User> => {
    const response = await api.get('/auth/me')
    return response.data
  },
}

// Tenants API
export const tenants = {
  list: async (): Promise<Tenant[]> => {
    const response = await api.get('/tenants')
    return response.data
  },

  get: async (tenantId: string): Promise<Tenant> => {
    const response = await api.get(`/tenants/${tenantId}`)
    return response.data
  },
}

// Calls API
export const calls = {
  list: async (tenantId: string, page = 1, pageSize = 20): Promise<PaginatedResponse<Call>> => {
    const response = await api.get(`/tenants/${tenantId}/calls`, {
      params: { page, page_size: pageSize },
    })
    return response.data
  },

  get: async (tenantId: string, callId: string, includeEvents = true): Promise<Call> => {
    const response = await api.get(`/tenants/${tenantId}/calls/${callId}`, {
      params: { include_events: includeEvents },
    })
    return response.data
  },

  getStats: async (tenantId: string): Promise<Record<string, any>> => {
    const response = await api.get(`/tenants/${tenantId}/calls/stats/summary`)
    return response.data
  },
}

// Orders API
export const orders = {
  list: async (tenantId: string, page = 1, pageSize = 20): Promise<PaginatedResponse<Order>> => {
    const response = await api.get(`/tenants/${tenantId}/orders`, {
      params: { page, page_size: pageSize },
    })
    return response.data
  },

  get: async (tenantId: string, orderId: string): Promise<Order> => {
    const response = await api.get(`/tenants/${tenantId}/orders/${orderId}`)
    return response.data
  },

  update: async (tenantId: string, orderId: string, data: Partial<Order>): Promise<Order> => {
    const response = await api.put(`/tenants/${tenantId}/orders/${orderId}`, data)
    return response.data
  },

  getStats: async (tenantId: string): Promise<Record<string, any>> => {
    const response = await api.get(`/tenants/${tenantId}/orders/stats/summary`)
    return response.data
  },
}

// Build a full URL for media (audio, images) with auth token
export function getMediaUrl(path: string): string {
  const base = API_URL.replace(/\/$/, '')
  const separator = path.includes('?') ? '&' : '?'
  return `${base}${path}${authToken ? `${separator}token=${authToken}` : ''}`
}

export default api
