import { connectDB} from "@/db/dbConfig"
import Scholar from "@/models/Scholar"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  await connectDB();
  const { email } = await req.json();

  if (!email || typeof email !== "string") {
    return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 });
  }

  try {
    const scholar = await Scholar.findOne({ email: email.trim().toLowerCase() }).lean();
    if (!scholar) {
      return NextResponse.json({ success: false, error: "Scholar not found" });
    }
    return NextResponse.json({ success: true, scholar });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Server error" });
  }
}

export async function GET(req: Request) {
  await connectDB()

  try {
    const scholars = await Scholar.find({}).lean()
    return NextResponse.json({ success: true, scholars })
  } catch (err) {
    return NextResponse.json({ success: false, error: "Failed to fetch scholars" }, { status: 500 })
  }
}
