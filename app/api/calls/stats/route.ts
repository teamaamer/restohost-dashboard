import { NextRequest, NextResponse } from 'next/server'
import { sammaiClient } from '@/lib/sammai-client'

export async function GET(request: NextRequest) {
  try {
    // Extract auth token from request headers
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    const stats = await sammaiClient.getCallStats(token)
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Call stats error:', error)
    return NextResponse.json(
      { 
        total_calls: 0,
        calls_last_24h: 0,
        calls_last_7d: 0,
        escalation_rate_7d: 0,
        avg_duration_seconds: 0,
        outcomes: {},
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}
