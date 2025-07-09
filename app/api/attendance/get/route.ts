import { NextResponse } from "next/server"
import { connectDB } from "@/db/dbconfig"
import Attendance from "@/models/Attendance"

export async function POST(req: Request) {
  await connectDB()

  try {
    const { scholarEmail } = await req.json()
    if (!scholarEmail) {
      return NextResponse.json({ success: false, error: "Missing scholar email" }, { status: 400 })
    }

    const attendanceRecords = await Attendance.find({ scholarEmail })
    return NextResponse.json({ success: true, attendance: attendanceRecords })
  } catch (error) {
    console.error("Error fetching attendance:", error)
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 })
  }
}

export async function GET(req: Request) {
  await connectDB()

  try {
    const url = new URL(req.url)
    const createdBy = url.searchParams.get("createdBy")

    if (!createdBy) {
      return NextResponse.json({ success: false, error: "Missing createdBy parameter" }, { status: 400 })
    }

    const records = await Attendance.find({ createdBy })
    return NextResponse.json({ success: true, attendance: records })
  } catch (error) {
    console.error("Error fetching attendance (GET):", error)
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 })
  }
}
