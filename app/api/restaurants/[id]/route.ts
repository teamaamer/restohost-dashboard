import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/restaurants/[id] - Get single restaurant
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: params.id },
    })

    if (!restaurant) {
      return NextResponse.json(
        { error: "Restaurant not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(restaurant)
  } catch (error) {
    console.error("Error fetching restaurant:", error)
    return NextResponse.json(
      { error: "Failed to fetch restaurant" },
      { status: 500 }
    )
  }
}

// PUT /api/restaurants/[id] - Update restaurant
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, brand } = body

    if (!name) {
      return NextResponse.json(
        { error: "Restaurant name is required" },
        { status: 400 }
      )
    }

    const restaurant = await prisma.restaurant.update({
      where: { id: params.id },
      data: {
        name,
        brand: brand || null,
      },
    })

    return NextResponse.json(restaurant)
  } catch (error) {
    console.error("Error updating restaurant:", error)
    return NextResponse.json(
      { error: "Failed to update restaurant" },
      { status: 500 }
    )
  }
}

// DELETE /api/restaurants/[id] - Delete restaurant
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.restaurant.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting restaurant:", error)
    return NextResponse.json(
      { error: "Failed to delete restaurant" },
      { status: 500 }
    )
  }
}
