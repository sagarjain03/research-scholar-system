
import { NextResponse } from "next/server"
import { connectDB } from "@/db/dbConfig"
import Attendance from "@/models/Attendance"

export async function POST(req: Request) {
  await connectDB()

  try {
    const { scholarEmail, status, date, createdBy } = await req.json()

    if (!scholarEmail || !status || !date || !createdBy) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const attendance = await Attendance.findOneAndUpdate(
      { scholarEmail, date: new Date(date) },
      { scholarEmail, status, date: new Date(date), createdBy },
      { upsert: true, new: true }
    )

    return NextResponse.json({ success: true, data: attendance })
  } catch (error) {
    console.error("Attendance save error:", error)
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 })
  }
}
