import { connectDB } from "@/db/dbconfig"
import Scholar from "@/models/Scholar"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  await connectDB()
  const { email } = await req.json()

  try {
    const scholar = await Scholar.findOne({ email })
    if (!scholar) {
      return NextResponse.json({ success: false, error: "Scholar not found" })
    }
    return NextResponse.json({ success: true, scholar })
  } catch (err) {
    return NextResponse.json({ success: false, error: "Server error" })
  }
}

export async function GET(req: Request) {
  await connectDB()

  const url = new URL(req.url)
  const createdBy = url.searchParams.get("createdBy")

  if (!createdBy) {
    return NextResponse.json({ success: false, error: "Missing createdBy parameter" }, { status: 400 })
  }

  try {
    const scholars = await Scholar.find({ createdBy })
    return NextResponse.json({ success: true, scholars })
  } catch (err) {
    return NextResponse.json({ success: false, error: "Failed to fetch scholars" }, { status: 500 })
  }
}
