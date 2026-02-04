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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      restaurantId, 
      orderType, 
      paymentMethod, 
      total, 
      customerName, 
      customerPhone,
      items 
    } = body

    if (!restaurantId || !orderType || !paymentMethod || !total) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const order = await prisma.order.create({
      data: {
        restaurantId,
        orderType,
        paymentMethod,
        total: parseFloat(total),
        subtotal: parseFloat(total),
        tax: 0,
        tip: 0,
        status: 'PLACED',
        customerName: customerName || null,
        customerPhone: customerPhone || null,
        items: items ? {
          create: items.map((item: any) => ({
            itemName: item.itemName,
            quantity: item.quantity,
            unitPrice: item.unitPrice ? parseFloat(item.unitPrice) : null,
            modifiersJson: item.modifiersJson || {},
          })),
        } : undefined,
      },
      include: {
        restaurant: true,
        items: true,
      },
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
