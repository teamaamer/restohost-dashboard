import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/calls/[id] - Get single call
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const call = await prisma.call.findUnique({
      where: { id: params.id },
      include: {
        restaurant: true,
        orders: {
          include: {
            items: true,
          },
        },
      },
    })

    if (!call) {
      return NextResponse.json(
        { error: "Call not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(call)
  } catch (error) {
    console.error("Error fetching call:", error)
    return NextResponse.json(
      { error: "Failed to fetch call" },
      { status: 500 }
    )
  }
}

// PUT /api/calls/[id] - Update call
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { 
      callerPhone, 
      callerName, 
      outcome, 
      transcriptText,
      summaryText 
    } = body

    const call = await prisma.call.update({
      where: { id: params.id },
      data: {
        callerPhone,
        callerName: callerName || null,
        outcome,
        transcriptText,
        summaryText: summaryText || null,
      },
      include: {
        restaurant: true,
        orders: {
          include: {
            items: true,
          },
        },
      },
    })

    return NextResponse.json(call)
  } catch (error) {
    console.error("Error updating call:", error)
    return NextResponse.json(
      { error: "Failed to update call" },
      { status: 500 }
    )
  }
}

// DELETE /api/calls/[id] - Delete call
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.call.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting call:", error)
    return NextResponse.json(
      { error: "Failed to delete call" },
      { status: 500 }
    )
  }
}
