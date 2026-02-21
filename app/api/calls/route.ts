import { NextRequest, NextResponse } from 'next/server'
import { sammaiClient } from '@/lib/sammai-client'
import { adaptCallToDashboard } from '@/lib/sammai-adapter'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const outcome = searchParams.get('outcome')

    // Extract auth token from request headers
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    const [response, tenant] = await Promise.all([
      sammaiClient.listCalls({
        page,
        page_size: limit,
        outcome: outcome && outcome !== 'all' ? outcome : undefined,
        token,
      }),
      sammaiClient.getTenant(token),
    ])

    const calls = response.items.map(call => adaptCallToDashboard(call, tenant.name))

    return NextResponse.json({
      calls,
      total: response.total,
      page: response.page,
      limit: response.page_size,
      totalPages: response.pages,
    })
  } catch (error) {
    console.error('Calls error:', error)
    return NextResponse.json(
      { 
        calls: [],
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
