import { connectDB } from "@/app/db/dbConfig"
import Scholar from "@/models/Scholar"
import { NextResponse } from "next/server"

export async function PUT(req: Request) {
  await connectDB()
  
  try {
    const updateData = await req.json()
    const { email, ...updateFields } = updateData

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Scholar email is required" },
        { status: 400 }
      )
    }

    // Format dates and milestones
    const formattedData: any = {
      ...updateFields,
      updatedAt: new Date()
    }

    // Handle date fields
    if (updateFields.startDate) {
      formattedData.startDate = new Date(updateFields.startDate)
    }
    if (updateFields.expectedCompletion) {
      formattedData.expectedCompletion = new Date(updateFields.expectedCompletion)
    }

    // Handle milestones
    if (updateFields.milestones) {
      formattedData.milestones = updateFields.milestones.map((m: any) => ({
        ...m,
        startDate: m.startDate ? new Date(m.startDate) : null,
        endDate: m.endDate ? new Date(m.endDate) : null
      }))
    }

    const updatedScholar = await Scholar.findOneAndUpdate(
      { email },
      formattedData,
      { new: true }
    )

    if (!updatedScholar) {
      return NextResponse.json(
        { success: false, error: "Scholar not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      scholar: updatedScholar
    })

  } catch (err) {
    console.error("Profile update error:", err)
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    )
  }
}