// app/api/scholars/profile/route.js
import { connectDB } from "@/app/db/dbConfig";
import Scholar from "@/models/Scholar";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  await connectDB();
  const email = new URL(req.url).searchParams.get("email");

  try {
    const scholar = await Scholar.findOne({ email }).select('name email department researchArea rating feedback academicContributions');
    if (!scholar) return NextResponse.json({ success: false, error: "Scholar not found" }, { status: 404 });
    
    return NextResponse.json({ success: true, profile: scholar });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  await connectDB();
  const { email, academicContributions } = await req.json();

  try {
    const scholar = await Scholar.findOneAndUpdate(
      { email },
      { academicContributions },
      { new: true }
    );
    
    if (!scholar) return NextResponse.json({ success: false, error: "Scholar not found" }, { status: 404 });
    
    return NextResponse.json({ success: true, scholar });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}