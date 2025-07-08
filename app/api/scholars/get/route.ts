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
