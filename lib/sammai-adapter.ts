// Adapter to transform Sammai API data to dashboard-compatible format

import type { Call, Order } from './sammai-types'

export interface DashboardCall {
  id: string
  startedAt: string
  endedAt: string
  durationSeconds: number
  callerPhone: string
  callerName: string | null
  outcome: string
  isRecorded: boolean
  recordingUrl: string | null
  transcriptText: string
  summaryText: string | null
  restaurant: { name: string }
  orders: Array<{
    total: number
    paymentMethod: string
    items: Array<{ itemName: string; quantity: number }>
  }>
}

export interface DashboardOrder {
  id: string
  createdAt: string
  orderType: string
  total: number
  paymentMethod: string
  customerName: string | null
  customerPhone: string | null
  restaurant: { name: string }
  call: { isRecorded: boolean; recordingUrl: string | null } | null
  items: Array<{
    itemName: string
    quantity: number
    unitPrice: number | null
    modifiersJson: any
  }>
}

export function adaptCallToDashboard(call: Call, restaurantName: string = 'Restaurant'): DashboardCall {
  return {
    id: call.id,
    startedAt: call.started_at,
    endedAt: call.ended_at || call.started_at,
    durationSeconds: call.duration_seconds || 0,
    callerPhone: call.from_number_masked,
    callerName: null,
    outcome: mapOutcome(call.outcome),
    isRecorded: !!call.recording_url,
    recordingUrl: call.recording_url,
    transcriptText: call.transcript?.text || '',
    summaryText: call.summary,
    restaurant: { name: restaurantName },
    orders: [],
  }
}

export function adaptOrderToDashboard(order: Order, restaurantName: string = 'Restaurant'): DashboardOrder {
  return {
    id: order.id,
    createdAt: order.created_at,
    orderType: 'PICKUP',
    total: order.total_dollars,
    paymentMethod: mapPaymentStatus(order.payment_status),
    customerName: order.customer_name,
    customerPhone: order.customer_phone_masked,
    restaurant: { name: restaurantName },
    call: null,
    items: order.items_json.map(item => ({
      itemName: item.name,
      quantity: item.quantity,
      unitPrice: item.price_cents ? item.price_cents / 100 : null,
      modifiersJson: item.modifiers || {},
    })),
  }
}

function mapOutcome(outcome: string | null): string {
  if (!outcome) return 'OTHER'
  
  const outcomeMap: Record<string, string> = {
    'order_placed': 'ORDER_PLACED',
    'reservation_made': 'INQUIRY',
    'faq_answered': 'INQUIRY',
    'escalated': 'OTHER',
    'voicemail': 'MISSED',
    'hangup': 'CANCELED',
    'error': 'OTHER',
    'unknown': 'OTHER',
  }
  
  return outcomeMap[outcome] || 'OTHER'
}

function mapPaymentStatus(status: string): string {
  const statusMap: Record<string, string> = {
    'pending': 'UNKNOWN',
    'link_sent': 'ONLINE',
    'paid': 'CARD',
    'failed': 'UNKNOWN',
    'refunded': 'UNKNOWN',
  }
  
  return statusMap[status] || 'CASH'
}
