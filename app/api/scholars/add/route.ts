import { connectDB } from "@/db/dbconfig"
import Scholar from "@/models/Scholar"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  await connectDB()
  const body = await req.json()

  try {
    const existing = await Scholar.findOne({ email: body.email })
    if (existing) {
      return NextResponse.json({ success: false, error: "Scholar already exists" }, { status: 409 })
    }

    const scholar = await Scholar.create(body)
    return NextResponse.json({ success: true, scholar })
  } catch (error) {
    console.error("Failed to add scholar:", error)
    return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 })
  }
}
