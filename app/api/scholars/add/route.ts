import { connectDB } from "@/app/db/dbConfig"
import Scholar from "@/models/Scholar"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  await connectDB()
  const body = await req.json()

  const {
    name,
    email,
    phone,
    department,
    supervisor,
    researchArea,
    startDate,
    expectedCompletion,
    description,
    milestones,
    createdBy, 
  } = body

  if (!createdBy) {
    return NextResponse.json({ success: false, error: "Missing createdBy field" }, { status: 400 })
  }

  try {
    const existing = await Scholar.findOne({ email })
    if (existing) {
      return NextResponse.json({ success: false, error: "Scholar already exists" }, { status: 409 })
    }

    const scholar = await Scholar.create({
      name,
      email,
      phone,
      department,
      supervisor,
      researchArea,
      startDate,
      expectedCompletion,
      description,
      milestones,
      createdBy, 
    })

    return NextResponse.json({ success: true, scholar })
  } catch (error) {
    console.error("Failed to add scholar:", error)
    return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 })
  }
}
