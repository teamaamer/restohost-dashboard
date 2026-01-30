import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const restaurantId = searchParams.get('restaurantId')
    const outcome = searchParams.get('outcome')
    const from = searchParams.get('from')
    const to = searchParams.get('to')

    const where: any = {}
    
    if (restaurantId && restaurantId !== 'all') {
      where.restaurantId = restaurantId
    }

    if (outcome && outcome !== 'all') {
      where.outcome = outcome
    }

    if (from || to) {
      where.startedAt = {}
      if (from) where.startedAt.gte = new Date(from)
      if (to) where.startedAt.lte = new Date(to)
    }

    const [calls, total] = await Promise.all([
      prisma.call.findMany({
        where,
        include: {
          restaurant: true,
          orders: {
            include: {
              items: true,
            },
          },
        },
        orderBy: { startedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.call.count({ where }),
    ])

    return NextResponse.json({
      calls,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('Calls error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
