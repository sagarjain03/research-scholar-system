// app/api/scholars/get-by-id/route.js
import { connectDB } from "@/db/dbConfig"
import Scholar from "@/models/Scholar"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  await connectDB()
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")

  try {
    const scholar = await Scholar.findById(id)
    if (!scholar) {
      return NextResponse.json({ success: false, error: "Scholar not found" }, { status: 404 })
    }
    return NextResponse.json({ success: true, scholar })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 })
  }
}