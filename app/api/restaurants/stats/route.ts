import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const from = searchParams.get('from')
    const to = searchParams.get('to')

    const restaurants = await prisma.restaurant.findMany({
      include: {
        calls: {
          where: {
            startedAt: {
              ...(from && { gte: new Date(from) }),
              ...(to && { lte: new Date(to) }),
            },
          },
        },
        orders: {
          where: {
            status: 'PLACED',
            createdAt: {
              ...(from && { gte: new Date(from) }),
              ...(to && { lte: new Date(to) }),
            },
          },
        },
      },
    })

    const stats = restaurants.map((restaurant) => {
      const totalCalls = restaurant.calls.length
      const totalOrders = restaurant.orders.length
      const sales = restaurant.orders.reduce((sum, order) => sum + Number(order.total), 0)
      const avgTicket = totalOrders > 0 ? sales / totalOrders : 0
      const orderPlacedCalls = restaurant.calls.filter((c) => c.outcome === 'ORDER_PLACED').length
      const conversionRate = totalCalls > 0 ? (orderPlacedCalls / totalCalls) * 100 : 0
      const lastCall = restaurant.calls.length > 0 
        ? restaurant.calls.sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime())[0].startedAt
        : null

      return {
        id: restaurant.id,
        name: restaurant.name,
        brand: restaurant.brand,
        totalCalls,
        totalOrders,
        sales,
        avgTicket,
        conversionRate,
        lastCall,
      }
    })

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Restaurant stats error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
