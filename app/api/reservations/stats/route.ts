import { NextRequest, NextResponse } from 'next/server'
import { sammaiClient } from '@/lib/sammai-client'

export async function GET(request: NextRequest) {
  try {
    // Extract auth token from request headers
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    const stats = await sammaiClient.getReservationStats(token)
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Reservation stats error:', error)
    return NextResponse.json(
      { 
        reservations_today: 0,
        covers_today: 0,
        upcoming: 0,
        no_show_rate_7d: 0,
        status_breakdown: {},
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}
