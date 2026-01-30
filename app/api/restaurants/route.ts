import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const restaurants = await prisma.restaurant.findMany({
      orderBy: { name: 'asc' },
    })

    return NextResponse.json(restaurants)
  } catch (error) {
    console.error('Restaurants error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
