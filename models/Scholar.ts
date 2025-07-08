import mongoose from "mongoose"

const MilestoneSchema = new mongoose.Schema({
  name: String,
  status: String,
  notes: String,
  startDate: Date,
  endDate: Date,
})

const ScholarSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: String,
  department: String,
  supervisor: String,
  researchArea: String,
  startDate: Date,
  expectedCompletion: Date,
  description: String,
  milestones: [MilestoneSchema],
  createdBy: {
    type: String,
    required: true, 
  },
})

export default mongoose.models.Scholar || mongoose.model("Scholar", ScholarSchema)
