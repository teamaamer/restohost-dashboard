import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { format } from 'date-fns'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const from = searchParams.get('from')
    const to = searchParams.get('to')
    const restaurantId = searchParams.get('restaurantId')
    const orderType = searchParams.get('orderType')
    const paymentMethod = searchParams.get('paymentMethod')

    const whereClause: any = {}
    
    if (restaurantId && restaurantId !== 'all') {
      whereClause.restaurantId = restaurantId
    }

    if (from || to) {
      whereClause.createdAt = {}
      if (from) whereClause.createdAt.gte = new Date(from)
      if (to) whereClause.createdAt.lte = new Date(to)
    }

    const orderWhere: any = { ...whereClause, status: 'PLACED' }
    if (orderType && orderType !== 'all') {
      orderWhere.orderType = orderType
    }
    if (paymentMethod && paymentMethod !== 'all') {
      orderWhere.paymentMethod = paymentMethod
    }

    const orders = await prisma.order.findMany({
      where: orderWhere,
      include: {
        items: true,
      },
    })

    const callWhere: any = {}
    if (restaurantId && restaurantId !== 'all') {
      callWhere.restaurantId = restaurantId
    }
    if (from || to) {
      callWhere.startedAt = {}
      if (from) callWhere.startedAt.gte = new Date(from)
      if (to) callWhere.startedAt.lte = new Date(to)
    }

    const calls = await prisma.call.findMany({
      where: callWhere,
    })

    const sales = orders.reduce((sum, order) => sum + Number(order.total), 0)
    const ordersCount = orders.length
    const avgTicket = ordersCount > 0 ? sales / ordersCount : 0
    const totalCalls = calls.length
    const callMinutes = calls.reduce((sum, call) => sum + call.durationSeconds, 0) / 60
    const orderPlacedCalls = calls.filter((c) => c.outcome === 'ORDER_PLACED').length
    const conversionRate = totalCalls > 0 ? (orderPlacedCalls / totalCalls) * 100 : 0

    const dailySalesMap = new Map<string, { sales: number; orders: number }>()
    orders.forEach((order) => {
      const date = format(new Date(order.createdAt), 'MMM dd')
      const existing = dailySalesMap.get(date) || { sales: 0, orders: 0 }
      dailySalesMap.set(date, {
        sales: existing.sales + Number(order.total),
        orders: existing.orders + 1,
      })
    })
    const dailySales = Array.from(dailySalesMap.entries()).map(([date, data]) => ({
      date,
      ...data,
    }))

    const dailyCallsMap = new Map<string, number>()
    calls.forEach((call) => {
      const date = format(new Date(call.startedAt), 'MMM dd')
      dailyCallsMap.set(date, (dailyCallsMap.get(date) || 0) + 1)
    })
    const dailyCalls = Array.from(dailyCallsMap.entries()).map(([date, calls]) => ({
      date,
      calls,
    }))

    const paymentMethodsMap = new Map<string, { count: number; total: number }>()
    orders.forEach((order) => {
      const method = order.paymentMethod
      const existing = paymentMethodsMap.get(method) || { count: 0, total: 0 }
      paymentMethodsMap.set(method, {
        count: existing.count + 1,
        total: existing.total + Number(order.total),
      })
    })
    const paymentMethods = Array.from(paymentMethodsMap.entries()).map(([method, data]) => ({
      method,
      ...data,
    }))

    const itemsMap = new Map<string, { quantity: number; revenue: number }>()
    orders.forEach((order) => {
      order.items.forEach((item) => {
        const existing = itemsMap.get(item.itemName) || { quantity: 0, revenue: 0 }
        const itemRevenue = item.unitPrice ? Number(item.unitPrice) * item.quantity : 0
        itemsMap.set(item.itemName, {
          quantity: existing.quantity + item.quantity,
          revenue: existing.revenue + itemRevenue,
        })
      })
    })
    const topItems = Array.from(itemsMap.entries())
      .map(([itemName, data]) => ({ itemName, ...data }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10)

    return NextResponse.json({
      sales,
      orders: ordersCount,
      avgTicket,
      totalCalls,
      callMinutes,
      conversionRate,
      dailySales,
      dailyCalls,
      paymentMethods,
      topItems,
    })
  } catch (error) {
    console.error('Metrics error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
