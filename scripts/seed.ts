import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  const restaurant1 = await prisma.restaurant.upsert({
    where: { externalId: 'resto_001' },
    update: {},
    create: {
      externalId: 'resto_001',
      name: 'Pizza Palace',
      brand: 'Palace Group',
      phone: '+972599123456',
      timezone: 'Asia/Hebron',
    },
  })

  const restaurant2 = await prisma.restaurant.upsert({
    where: { externalId: 'resto_002' },
    update: {},
    create: {
      externalId: 'resto_002',
      name: 'Burger House',
      brand: 'House Brands',
      phone: '+972599234567',
      timezone: 'Asia/Hebron',
    },
  })

  const restaurant3 = await prisma.restaurant.upsert({
    where: { externalId: 'resto_003' },
    update: {},
    create: {
      externalId: 'resto_003',
      name: 'Shawarma Express',
      phone: '+972599345678',
      timezone: 'Asia/Hebron',
    },
  })

  console.log('✅ Created restaurants')

  const now = new Date()
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)
  const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)

  const call1 = await prisma.call.upsert({
    where: { externalId: 'call_001' },
    update: {},
    create: {
      externalId: 'call_001',
      restaurantId: restaurant1.id,
      startedAt: new Date(yesterday.getTime() - 5 * 60 * 1000),
      endedAt: yesterday,
      durationSeconds: 300,
      callerPhone: '+972599111222',
      callerName: 'Ahmad',
      transcriptText: `Agent: Hello, Pizza Palace, how can I help you?
Customer: Hi, I'd like to order a large pepperoni pizza.
Agent: Great choice! Would you like any extra toppings?
Customer: Yes, add mushrooms and olives please.
Agent: Perfect. For pickup or delivery?
Customer: Delivery please.
Agent: Your address?
Customer: 123 Main Street, Hebron.
Agent: Total is 80 shekels. Payment method?
Customer: Cash on delivery.
Agent: Your order will arrive in 30-40 minutes. Thank you!`,
      summaryText: 'Customer ordered a large pepperoni pizza with mushrooms and olives for delivery. Payment: cash. Total: 80 NIS.',
      outcome: 'ORDER_PLACED',
      recordingUrl: 'https://example.com/recordings/call_001.mp3',
      isRecorded: true,
    },
  })

  const call2 = await prisma.call.upsert({
    where: { externalId: 'call_002' },
    update: {},
    create: {
      externalId: 'call_002',
      restaurantId: restaurant2.id,
      startedAt: new Date(yesterday.getTime() - 3 * 60 * 60 * 1000),
      endedAt: new Date(yesterday.getTime() - 3 * 60 * 60 * 1000 + 240 * 1000),
      durationSeconds: 240,
      callerPhone: '+972599222333',
      callerName: 'Sara',
      transcriptText: `Agent: Burger House, how may I help you?
Customer: Hi, what are your opening hours?
Agent: We're open from 11 AM to 11 PM daily.
Customer: Great, thank you!
Agent: You're welcome!`,
      summaryText: 'Customer inquired about opening hours. No order placed.',
      outcome: 'INQUIRY',
      recordingUrl: 'https://example.com/recordings/call_002.mp3',
      isRecorded: true,
    },
  })

  const call3 = await prisma.call.upsert({
    where: { externalId: 'call_003' },
    update: {},
    create: {
      externalId: 'call_003',
      restaurantId: restaurant3.id,
      startedAt: new Date(twoDaysAgo.getTime() - 2 * 60 * 60 * 1000),
      endedAt: new Date(twoDaysAgo.getTime() - 2 * 60 * 60 * 1000 + 420 * 1000),
      durationSeconds: 420,
      callerPhone: '+972599333444',
      callerName: 'Mohammed',
      transcriptText: `Agent: Shawarma Express, good evening!
Customer: Hi, I want to order 3 chicken shawarmas and 2 falafel wraps.
Agent: Excellent! For pickup or delivery?
Customer: Pickup in 20 minutes.
Agent: Perfect. Any drinks?
Customer: Yes, 3 Cokes please.
Agent: Total is 120 shekels. Name for the order?
Customer: Mohammed.
Agent: Thank you Mohammed, see you in 20 minutes!`,
      summaryText: 'Customer ordered 3 chicken shawarmas, 2 falafel wraps, and 3 Cokes for pickup. Total: 120 NIS.',
      outcome: 'ORDER_PLACED',
      recordingUrl: 'https://example.com/recordings/call_003.mp3',
      isRecorded: true,
    },
  })

  console.log('✅ Created calls')

  const order1 = await prisma.order.upsert({
    where: { externalId: 'order_001' },
    update: {},
    create: {
      externalId: 'order_001',
      restaurantId: restaurant1.id,
      callId: call1.id,
      orderType: 'DELIVERY',
      paymentMethod: 'CASH',
      subtotal: 80,
      tax: 0,
      tip: 0,
      total: 80,
      status: 'PLACED',
      customerName: 'Ahmad',
      customerPhone: '+972599111222',
    },
  })

  await prisma.orderItem.createMany({
    data: [
      {
        orderId: order1.id,
        itemName: 'Large Pepperoni Pizza',
        quantity: 1,
        unitPrice: 60,
        modifiersJson: { extraToppings: ['mushrooms', 'olives'] },
      },
      {
        orderId: order1.id,
        itemName: 'Extra Toppings',
        quantity: 2,
        unitPrice: 10,
      },
    ],
  })

  const order2 = await prisma.order.upsert({
    where: { externalId: 'order_002' },
    update: {},
    create: {
      externalId: 'order_002',
      restaurantId: restaurant3.id,
      callId: call3.id,
      orderType: 'PICKUP',
      paymentMethod: 'CASH',
      subtotal: 120,
      tax: 0,
      tip: 0,
      total: 120,
      status: 'PLACED',
      customerName: 'Mohammed',
      customerPhone: '+972599333444',
    },
  })

  await prisma.orderItem.createMany({
    data: [
      {
        orderId: order2.id,
        itemName: 'Chicken Shawarma',
        quantity: 3,
        unitPrice: 25,
      },
      {
        orderId: order2.id,
        itemName: 'Falafel Wrap',
        quantity: 2,
        unitPrice: 20,
      },
      {
        orderId: order2.id,
        itemName: 'Coca Cola',
        quantity: 3,
        unitPrice: 5,
      },
    ],
  })

  await prisma.call.create({
    data: {
      externalId: 'call_004',
      restaurantId: restaurant1.id,
      startedAt: new Date(now.getTime() - 6 * 60 * 60 * 1000),
      endedAt: new Date(now.getTime() - 6 * 60 * 60 * 1000 + 180 * 1000),
      durationSeconds: 180,
      callerPhone: '+972599444555',
      transcriptText: 'No answer - call went to voicemail.',
      outcome: 'MISSED',
      isRecorded: false,
    },
  })

  await prisma.call.create({
    data: {
      externalId: 'call_005',
      restaurantId: restaurant2.id,
      startedAt: new Date(now.getTime() - 4 * 60 * 60 * 1000),
      endedAt: new Date(now.getTime() - 4 * 60 * 60 * 1000 + 360 * 1000),
      durationSeconds: 360,
      callerPhone: '+972599555666',
      callerName: 'Layla',
      transcriptText: `Agent: Burger House!
Customer: Hi, I'd like to order 2 cheeseburgers with fries.
Agent: Sure! Anything to drink?
Customer: Actually, cancel that. I'll call back later.
Agent: No problem, have a good day!`,
      summaryText: 'Customer started an order but canceled before completion.',
      outcome: 'CANCELED',
      recordingUrl: 'https://example.com/recordings/call_005.mp3',
      isRecorded: true,
    },
  })

  console.log('✅ Created orders and items')
  console.log('🎉 Seeding complete!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
