// app/api/predict/route.ts
import { connectDB } from "@/app/db/dbConfig";
import Scholar from "@/models/Scholar";
import { NextResponse } from "next/server";

// Environment variable for your ML model URL
const ML_MODEL_URL = process.env.ML_MODEL_URL || "https://thesisdelaypredictor.onrender.com";

export async function POST(req: Request) {
  await connectDB();
  
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    // Fetch scholar data
    const scholar = await Scholar.findOne({ email: email.trim().toLowerCase() });
    if (!scholar) {
      return NextResponse.json(
        { success: false, error: "Scholar not found" },
        { status: 404 }
      );
    }

    // Calculate metrics for ML model
    const mlData = {
      attendance: calculateAttendancePercentage(scholar),
      progress: calculateProgressPercentage(scholar),
      published: scholar.academicContributions?.filter(c => c.isPublished).length || 0,
      extensions: scholar.academicContributions?.reduce((sum, c) => sum + (c.extensions?.count || 0), 0) || 0,
      delay: calculateAverageDelay(scholar),
      score: scholar.rating || 5 // Default to average if no rating
    };

    // Log the data being sent to ML model with colored output
    console.log('\x1b[36m%s\x1b[0m', '----- DATA SENT TO ML MODEL -----');
    console.log('\x1b[33m%s\x1b[0m', JSON.stringify(mlData, null, 2));
    console.log('\x1b[36m%s\x1b[0m', '---------------------------------');

    // Call ML model API
    const mlResponse = await fetch(`${ML_MODEL_URL}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mlData),
    });

    if (!mlResponse.ok) {
      const errorText = await mlResponse.text();
      console.error('\x1b[31m%s\x1b[0m', 'ML Model Error:', errorText);
      throw new Error(`ML model error: ${mlResponse.statusText}`);
    }

    const prediction = await mlResponse.json();

    // Log the prediction received
    console.log('\x1b[32m%s\x1b[0m', '----- PREDICTION RECEIVED -----');
    console.log('\x1b[33m%s\x1b[0m', JSON.stringify(prediction, null, 2));
    console.log('\x1b[32m%s\x1b[0m', '-------------------------------');

    // Save prediction to scholar's history
    scholar.predictions = scholar.predictions || [];
    scholar.predictions.push({
      date: new Date(),
      result: prediction.prediction,
      confidence: prediction.confidence,
      parameters: prediction.reason,
    });
    await scholar.save();

    return NextResponse.json({
      success: true,
      prediction: {
        result: prediction.prediction,
        confidence: Math.round(prediction.confidence * 100), // Convert to percentage
        parameters: prediction.reason,
      },
    });

  } catch (error: any) {
    console.error('\x1b[31m%s\x1b[0m', 'Prediction error:', error.message);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || "Failed to generate prediction" 
      },
      { status: 500 }
    );
  }
}

// Helper function to calculate attendance percentage
function calculateAttendancePercentage(scholar: any): number {
  if (!scholar.attendanceRecords || scholar.attendanceRecords.length === 0) {
    return 0.85; // Default value if no attendance data
  }
  
  const presentDays = scholar.attendanceRecords.filter(
    (r: any) => r.status === "Present"
  ).length;
  return presentDays / scholar.attendanceRecords.length;
}

// Helper function to calculate progress percentage
function calculateProgressPercentage(scholar: any): number {
  if (!scholar.milestones || scholar.milestones.length === 0) return 0;
  
  const completed = scholar.milestones.filter(
    (m: any) => m.status === "Completed"
  ).length;
  return completed / scholar.milestones.length;
}

// Helper function to calculate average delay
function calculateAverageDelay(scholar: any): number {
  if (!scholar.academicContributions || scholar.academicContributions.length === 0) {
    return 0;
  }
  
  const totalDelay = scholar.academicContributions.reduce(
    (sum: number, c: any) => sum + (c.delay || 0),
    0
  );
  return totalDelay / scholar.academicContributions.length;
}