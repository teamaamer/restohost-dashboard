import { NextRequest, NextResponse } from 'next/server'
import { sammaiClient } from '@/lib/sammai-client'

export async function GET(request: NextRequest) {
  try {
    // Extract auth token from request headers
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    const stats = await sammaiClient.getOrderStats(token)
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Order stats error:', error)
    return NextResponse.json(
      { 
        orders_today: 0,
        revenue_today_cents: 0,
        revenue_today_dollars: 0,
        revenue_7d_cents: 0,
        revenue_7d_dollars: 0,
        status_breakdown: {},
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}
