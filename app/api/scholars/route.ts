import { connectDB } from "@/db/dbconfig"
import Scholar from "@/models/Scholar"
import { NextResponse } from "next/server"

export async function PUT(req: Request) {
  await connectDB()

  try {
    const { email, rating, feedback } = await req.json()

    // Validate input
    if (!email) {
      return NextResponse.json(
        { success: false, error: "Scholar email is required" },
        { status: 400 }
      )
    }

    // Validate rating if provided
    if (rating !== undefined && (rating < 1 || rating > 10)) {
      return NextResponse.json(
        { success: false, error: "Rating must be between 1 and 10" },
        { status: 400 }
      )
    }

    // Prepare update object
    const updateData: { rating?: number | null; feedback?: string } = {}
    
    if (rating !== undefined) {
      updateData.rating = rating === null ? null : Number(rating)
    }
    
    if (feedback !== undefined) {
      updateData.feedback = feedback
    }

    // Find and update the scholar
    const updatedScholar = await Scholar.findOneAndUpdate(
      { email },
      { $set: updateData },
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
      message: "Scholar updated successfully",
      scholar: updatedScholar
    })

  } catch (error) {
    console.error("Error updating scholar:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}