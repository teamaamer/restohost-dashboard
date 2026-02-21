// TypeScript types for Sammai API

export interface Tenant {
  id: string
  name: string
  timezone: string
  is_active: boolean
  created_at: string
  updated_at: string
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
  transcript?: Transcript
  events?: CallEvent[]
}

export interface Transcript {
  id: string
  call_id: string
  tenant_id: string
  text: string
  segments_json: any[]
  language: string
  confidence: number | null
}

export interface CallEvent {
  id: string
  call_id: string
  event_type: string
  timestamp: string
  content: string | null
  tool_name: string | null
  tool_input: any | null
  tool_output: any | null
  duration_ms: number | null
  metadata_json: any | null
}

export interface CallListResponse {
  items: Call[]
  total: number
  page: number
  page_size: number
  pages: number
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
  items_json: OrderItem[]
  subtotal_cents: number
  tax_cents: number
  total_cents: number
  total_dollars: number
  notes: string | null
  status: string
  payment_status: string
  payment_link: string | null
  confirmation_sent: boolean
  created_at: string
  updated_at: string
}

export interface OrderItem {
  item_id?: string
  name: string
  quantity: number
  price_cents: number
  modifiers?: any[]
  notes?: string
}

export interface OrderListResponse {
  items: Order[]
  total: number
  page: number
  page_size: number
  pages: number
}

export interface CallStats {
  total_calls: number
  calls_last_24h: number
  calls_last_7d: number
  escalation_rate_7d: number
  avg_duration_seconds: number
  outcomes: Record<string, number>
}

export interface OrderStats {
  orders_today: number
  revenue_today_cents: number
  revenue_today_dollars: number
  revenue_7d_cents: number
  revenue_7d_dollars: number
  status_breakdown: Record<string, number>
}

export interface Reservation {
  id: string
  tenant_id: string
  call_id: string | null
  customer_name: string
  customer_phone: string
  customer_phone_masked: string
  customer_email: string | null
  party_size: number
  reservation_datetime: string
  duration_minutes: number
  table_preference: string | null
  special_requests: string | null
  notes: string | null
  status: string
  confirmation_sent: boolean
  reminder_sent: boolean
  created_at: string
  updated_at: string
}

export interface ReservationListResponse {
  items: Reservation[]
  total: number
  page: number
  page_size: number
  pages: number
}

export interface ReservationStats {
  reservations_today: number
  covers_today: number
  upcoming: number
  no_show_rate_7d: number
  status_breakdown: Record<string, number>
}

export interface MenuItem {
  id: string
  tenant_id: string
  name: string
  description: string | null
  price_cents: number
  price_dollars: number
  category: string
  is_active: boolean
  is_available: boolean
  dietary_info: Record<string, boolean> | null
  prep_time_minutes: number | null
  created_at: string
  updated_at: string
  modifiers?: MenuModifier[]
}

export interface MenuModifier {
  id: string
  tenant_id: string
  menu_item_id: string
  name: string
  options_json: any
  is_required: boolean
  max_selections: number | null
}

export interface MenuItemListResponse {
  items: MenuItem[]
  total: number
  page: number
  page_size: number
  pages: number
}
