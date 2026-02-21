import { NextRequest, NextResponse } from 'next/server'
import { sammaiClient } from '@/lib/sammai-client'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status')
    const date = searchParams.get('date')

    // Extract auth token from request headers
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    const response = await sammaiClient.listReservations({
      page,
      page_size: limit,
      status_filter: status && status !== 'all' ? status : undefined,
      date: date || undefined,
      token,
    })

    return NextResponse.json({
      reservations: response.items,
      total: response.total,
      page: response.page,
      limit: response.page_size,
      totalPages: response.pages,
    })
  } catch (error) {
    console.error('Reservations error:', error)
    return NextResponse.json(
      { 
        reservations: [],
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 1,
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}
