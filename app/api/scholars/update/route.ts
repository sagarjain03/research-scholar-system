import { connectDB } from "@/db/dbconfig"
import Scholar from "@/models/Scholar"
import { NextResponse } from "next/server"

export async function PUT(req: Request) {
  await connectDB()
  const { email, milestoneIndex, updatedMilestone } = await req.json()

  if (!email || milestoneIndex === undefined || !updatedMilestone) {
    return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 })
  }

  try {
    const scholar = await Scholar.findOne({ email })
    if (!scholar) {
      return NextResponse.json({ success: false, error: "Scholar not found" })
    }

    if (!scholar.milestones || milestoneIndex >= scholar.milestones.length) {
      return NextResponse.json({ success: false, error: "Invalid milestone index" }, { status: 400 })
    }

    // Update the milestone
    scholar.milestones[milestoneIndex] = {
      ...scholar.milestones[milestoneIndex],
      ...updatedMilestone,
    }

    await scholar.save()

    return NextResponse.json({ success: true, scholar })
  } catch (err) {
    console.error("Update error:", err)
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 })
  }
}
