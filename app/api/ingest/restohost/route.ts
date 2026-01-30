import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { CallOutcome, OrderType, PaymentMethod, OrderStatus } from '@prisma/client'

interface IngestPayload {
  restaurant: {
    externalId: string
    name: string
    brand?: string
    phone?: string
    timezone?: string
  }
  call: {
    id: string
    startedAt: string
    endedAt: string
    callerPhone: string
    callerName?: string
    recordingUrl?: string
    isRecorded: boolean
    transcriptText: string
    summaryText?: string
    outcome: string
  }
  orders?: Array<{
    id: string
    orderType: string
    paymentMethod: string
    subtotal: number
    tax: number
    tip: number
    total: number
    status: string
    customerName?: string
    customerPhone?: string
    items: Array<{
      itemName: string
      quantity: number
      unitPrice?: number
      modifiersJson?: any
    }>
  }>
}

export async function POST(request: NextRequest) {
  try {
    const payload: IngestPayload = await request.json()

    if (!payload.restaurant?.externalId || !payload.call?.id) {
      return NextResponse.json(
        { ok: false, error: 'Missing required fields: restaurant.externalId or call.id' },
        { status: 400 }
      )
    }

    const restaurant = await prisma.restaurant.upsert({
      where: { externalId: payload.restaurant.externalId },
      update: {
        name: payload.restaurant.name,
        brand: payload.restaurant.brand,
        phone: payload.restaurant.phone,
        timezone: payload.restaurant.timezone || 'Asia/Hebron',
      },
      create: {
        externalId: payload.restaurant.externalId,
        name: payload.restaurant.name,
        brand: payload.restaurant.brand,
        phone: payload.restaurant.phone,
        timezone: payload.restaurant.timezone || 'Asia/Hebron',
      },
    })

    const durationSeconds = Math.floor(
      (new Date(payload.call.endedAt).getTime() - new Date(payload.call.startedAt).getTime()) / 1000
    )

    const call = await prisma.call.upsert({
      where: { externalId: payload.call.id },
      update: {
        startedAt: new Date(payload.call.startedAt),
        endedAt: new Date(payload.call.endedAt),
        durationSeconds,
        callerPhone: payload.call.callerPhone,
        callerName: payload.call.callerName,
        transcriptText: payload.call.transcriptText,
        summaryText: payload.call.summaryText,
        outcome: payload.call.outcome as CallOutcome,
        recordingUrl: payload.call.recordingUrl,
        isRecorded: payload.call.isRecorded,
      },
      create: {
        externalId: payload.call.id,
        restaurantId: restaurant.id,
        startedAt: new Date(payload.call.startedAt),
        endedAt: new Date(payload.call.endedAt),
        durationSeconds,
        callerPhone: payload.call.callerPhone,
        callerName: payload.call.callerName,
        transcriptText: payload.call.transcriptText,
        summaryText: payload.call.summaryText,
        outcome: payload.call.outcome as CallOutcome,
        recordingUrl: payload.call.recordingUrl,
        isRecorded: payload.call.isRecorded,
      },
    })

    if (payload.orders && payload.orders.length > 0) {
      for (const orderData of payload.orders) {
        const order = await prisma.order.upsert({
          where: { externalId: orderData.id },
          update: {
            callId: call.id,
            orderType: orderData.orderType as OrderType,
            paymentMethod: orderData.paymentMethod as PaymentMethod,
            subtotal: orderData.subtotal,
            tax: orderData.tax,
            tip: orderData.tip,
            total: orderData.total,
            status: orderData.status as OrderStatus,
            customerName: orderData.customerName,
            customerPhone: orderData.customerPhone,
          },
          create: {
            externalId: orderData.id,
            restaurantId: restaurant.id,
            callId: call.id,
            orderType: orderData.orderType as OrderType,
            paymentMethod: orderData.paymentMethod as PaymentMethod,
            subtotal: orderData.subtotal,
            tax: orderData.tax,
            tip: orderData.tip,
            total: orderData.total,
            status: orderData.status as OrderStatus,
            customerName: orderData.customerName,
            customerPhone: orderData.customerPhone,
          },
        })

        await prisma.orderItem.deleteMany({
          where: { orderId: order.id },
        })

        if (orderData.items && orderData.items.length > 0) {
          await prisma.orderItem.createMany({
            data: orderData.items.map((item) => ({
              orderId: order.id,
              itemName: item.itemName,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              modifiersJson: item.modifiersJson,
            })),
          })
        }
      }
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Ingestion error:', error)
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
