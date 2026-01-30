import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const restaurantId = searchParams.get('restaurantId')
    const orderType = searchParams.get('orderType')
    const paymentMethod = searchParams.get('paymentMethod')
    const from = searchParams.get('from')
    const to = searchParams.get('to')

    const where: any = {}
    
    if (restaurantId && restaurantId !== 'all') {
      where.restaurantId = restaurantId
    }

    if (orderType && orderType !== 'all') {
      where.orderType = orderType
    }

    if (paymentMethod && paymentMethod !== 'all') {
      where.paymentMethod = paymentMethod
    }

    if (from || to) {
      where.createdAt = {}
      if (from) where.createdAt.gte = new Date(from)
      if (to) where.createdAt.lte = new Date(to)
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          restaurant: true,
          call: true,
          items: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.order.count({ where }),
    ])

    return NextResponse.json({
      orders,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('Orders error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
