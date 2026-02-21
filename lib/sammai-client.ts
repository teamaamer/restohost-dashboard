// Sammai API Client for server-side use

import type { 
  Tenant, 
  Call, 
  CallListResponse, 
  CallStats,
  Order, 
  OrderListResponse,
  OrderStats,
  Reservation,
  ReservationListResponse,
  ReservationStats,
  MenuItem,
  MenuItemListResponse
} from './sammai-types'

const SAMMAI_API_URL = process.env.SAMMAI_API_URL || 'http://localhost:8000'
const SAMMAI_TENANT_ID = process.env.SAMMAI_TENANT_ID || ''

class SammaiClient {
  private baseUrl: string
  private tenantId: string

  constructor(baseUrl: string = SAMMAI_API_URL, tenantId: string = SAMMAI_TENANT_ID) {
    this.baseUrl = baseUrl
    this.tenantId = tenantId
  }

  private async fetch<T>(path: string, options?: RequestInit & { token?: string }): Promise<T> {
    const url = `${this.baseUrl}${path}`
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options?.headers as Record<string, string>,
    }

    // Add authorization header if token is provided
    if (options?.token) {
      headers['Authorization'] = `Bearer ${options.token}`
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Sammai API error: ${response.status} - ${error}`)
    }

    return response.json()
  }

  // Tenant methods
  async getTenant(token?: string): Promise<Tenant> {
    return this.fetch<Tenant>(`/tenants/${this.tenantId}`, { token })
  }

  async listTenants(): Promise<Tenant[]> {
    return this.fetch<Tenant[]>('/tenants')
  }

  // Call methods
  async listCalls(params: {
    page?: number
    page_size?: number
    status_filter?: string
    outcome?: string
    token?: string
  }): Promise<CallListResponse> {
    const searchParams = new URLSearchParams()
    if (params.page) searchParams.set('page', params.page.toString())
    if (params.page_size) searchParams.set('page_size', params.page_size.toString())
    if (params.status_filter) searchParams.set('status_filter', params.status_filter)
    if (params.outcome) searchParams.set('outcome', params.outcome)

    return this.fetch<CallListResponse>(
      `/tenants/${this.tenantId}/calls?${searchParams.toString()}`,
      { token: params.token }
    )
  }

  async getCall(callId: string, includeEvents: boolean = true): Promise<Call> {
    const searchParams = new URLSearchParams()
    searchParams.set('include_events', includeEvents.toString())
    
    return this.fetch<Call>(
      `/tenants/${this.tenantId}/calls/${callId}?${searchParams.toString()}`
    )
  }

  async getCallStats(token?: string): Promise<CallStats> {
    return this.fetch<CallStats>(`/tenants/${this.tenantId}/calls/stats/summary`, { token })
  }

  // Order methods
  async listOrders(params: {
    page?: number
    page_size?: number
    status_filter?: string
    token?: string
  }): Promise<OrderListResponse> {
    const searchParams = new URLSearchParams()
    if (params.page) searchParams.set('page', params.page.toString())
    if (params.page_size) searchParams.set('page_size', params.page_size.toString())
    if (params.status_filter) searchParams.set('status_filter', params.status_filter)

    return this.fetch<OrderListResponse>(
      `/tenants/${this.tenantId}/orders?${searchParams.toString()}`,
      { token: params.token }
    )
  }

  async getOrder(orderId: string): Promise<Order> {
    return this.fetch<Order>(`/tenants/${this.tenantId}/orders/${orderId}`)
  }

  async getOrderStats(token?: string): Promise<OrderStats> {
    return this.fetch<OrderStats>(`/tenants/${this.tenantId}/orders/stats/summary`, { token })
  }

  // Reservation methods
  async listReservations(params: {
    page?: number
    page_size?: number
    status_filter?: string
    date?: string
    token?: string
  }): Promise<ReservationListResponse> {
    const searchParams = new URLSearchParams()
    if (params.page) searchParams.set('page', params.page.toString())
    if (params.page_size) searchParams.set('page_size', params.page_size.toString())
    if (params.status_filter) searchParams.set('status_filter', params.status_filter)
    if (params.date) searchParams.set('date', params.date)

    return this.fetch<ReservationListResponse>(
      `/tenants/${this.tenantId}/reservations?${searchParams.toString()}`,
      { token: params.token }
    )
  }

  async getReservation(reservationId: string): Promise<Reservation> {
    return this.fetch<Reservation>(`/tenants/${this.tenantId}/reservations/${reservationId}`)
  }

  async getReservationStats(token?: string): Promise<ReservationStats> {
    return this.fetch<ReservationStats>(`/tenants/${this.tenantId}/reservations/stats/summary`, { token })
  }

  // Menu methods
  async listMenuItems(params?: {
    category?: string
    is_active?: boolean
    token?: string
  }): Promise<MenuItem[]> {
    const searchParams = new URLSearchParams()
    if (params?.category) searchParams.set('category', params.category)
    if (params?.is_active !== undefined) searchParams.set('is_active', params.is_active.toString())

    return this.fetch<MenuItem[]>(
      `/tenants/${this.tenantId}/menu_items?${searchParams.toString()}`,
      { token: params?.token }
    )
  }

  async getMenuItem(itemId: string): Promise<MenuItem> {
    return this.fetch<MenuItem>(`/tenants/${this.tenantId}/menu_items/${itemId}`)
  }

  async getMenuCategories(): Promise<string[]> {
    return this.fetch<string[]>(`/tenants/${this.tenantId}/menu_categories`)
  }
}

export const sammaiClient = new SammaiClient()
