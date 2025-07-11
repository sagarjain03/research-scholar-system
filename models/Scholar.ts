// app/models/Scholar.ts
import mongoose from "mongoose";

const MilestoneSchema = new mongoose.Schema({
  name: String,
  status: {
    type: String,
  },
  notes: String,
  startDate: Date,
  endDate: Date,
  completionDate: Date,
});

const AcademicContributionSchema = new mongoose.Schema({
  title: String,
  type: {
    type: String,
    enum: ["Publication", "Conference", "Award", "Collaboration"],
  },
  date: Date,
  description: String,
  journalOrEvent: String,
  isPublished: Boolean,
  extensions: {
    count: Number,
    details: String,
  },
  delay: Number, // Days delayed
  link: String,
});

const AttendanceRecordSchema = new mongoose.Schema({
  date: Date,
  status: {
    type: String,
    enum: ["Present", "Absent", "Leave"],
  },
});

const PredictionSchema = new mongoose.Schema({
  date: Date,
  result: String,
  confidence: Number,
  parameters: mongoose.Schema.Types.Mixed, // Stores SHAP values
});

const ScholarSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true, required: true },
    phone: String,
    department: String,
    supervisor: String,
    researchArea: String,
    startDate: Date,
    expectedCompletion: Date,
    description: String,
    
    // Tracking
    milestones: [MilestoneSchema],
    academicContributions: [AcademicContributionSchema],
    attendanceRecords: [AttendanceRecordSchema],
    
    // Metrics for ML model
    metrics: {
      attendancePercentage: Number,
      progressPercentage: Number,
      publicationsCount: Number,
      totalExtensions: Number,
      averageDelay: Number,
      lastUpdated: Date,
    },
    
    // Prediction history
    predictions: [PredictionSchema],
    
    // Supervisor evaluation
    rating: { type: Number, min: 1, max: 10 },
    feedback: String,
    supervisorNotes: String,
  },
  { timestamps: true }
);

export default mongoose.models.Scholar || mongoose.model("Scholar", ScholarSchema);