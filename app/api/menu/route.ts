import { NextRequest, NextResponse } from 'next/server'
import { sammaiClient } from '@/lib/sammai-client'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const is_active = searchParams.get('is_active')

    // Extract auth token from request headers
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    const items = await sammaiClient.listMenuItems({
      category: category || undefined,
      is_active: is_active ? is_active === 'true' : undefined,
      token,
    })

    return NextResponse.json({
      items,
      total: items.length,
    })
  } catch (error) {
    console.error('Menu error:', error)
    return NextResponse.json(
      { 
        items: [],
        total: 0,
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}
