import { connectDB } from "@/db/dbconfig"
import Scholar from "@/models/Scholar"
import { NextResponse } from "next/server"

export async function PUT(req: Request) {
  await connectDB()
  const { email, milestoneIndex, updatedMilestone, rating, feedback } = await req.json()

  if (!email) {
    return NextResponse.json({ success: false, error: "Missing scholar email" }, { status: 400 })
  }

  try {
    const scholar = await Scholar.findOne({ email })
    if (!scholar) {
      return NextResponse.json({ success: false, error: "Scholar not found" })
    }

    let updated = false

    // Update milestone if applicable
    if (milestoneIndex !== undefined && updatedMilestone) {
      if (!scholar.milestones || milestoneIndex >= scholar.milestones.length) {
        return NextResponse.json({ success: false, error: "Invalid milestone index" }, { status: 400 })
      }

      scholar.milestones[milestoneIndex] = {
        ...scholar.milestones[milestoneIndex],
        ...updatedMilestone,
      }

      updated = true
    }

    // Update rating if provided
    if (rating !== undefined) {
      scholar.rating = rating
      updated = true
    }

    // Update feedback if provided
    if (feedback !== undefined) {
      scholar.feedback = feedback
      updated = true
    }

    if (!updated) {
      return NextResponse.json({ success: false, error: "Nothing to update" }, { status: 400 })
    }

    await scholar.save()

    return NextResponse.json({ success: true, scholar })
  } catch (err) {
    console.error("Update error:", err)
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 })
  }
}
