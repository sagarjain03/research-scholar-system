import mongoose from "mongoose"

const AttendanceSchema = new mongoose.Schema({
  scholarEmail: { type: String, required: true },
  status: { type: String, enum: ["Present", "Absent", "Leave"], required: true },
  date: { type: Date, required: true },
  createdBy: { type: String, required: true }, // Admin email
})

export default mongoose.models.Attendance || mongoose.model("Attendance", AttendanceSchema)
