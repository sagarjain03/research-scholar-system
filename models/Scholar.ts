import mongoose from "mongoose"

const MilestoneSchema = new mongoose.Schema({
  name: String,
  status: String,
  notes: String,
  startDate: Date,
  endDate: Date,
})

const academicContributionsSchema = new mongoose.Schema({
  title: String,
  type: { type: String, enum: ['Publication', 'Conference', 'Award', 'Collaboration'] },
  date: Date,
  description: String,
  journalOrEvent: String,
  Publications: Number,
  link: String,
  isPublished: Boolean,
  extensions: {
    count: Number,
    details: String
  },
  delay: Number 
});

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
  rating: {
    type: Number,
    min: 1,
    max: 10,
  },
  feedback: {
    type: String,
  },
  academicContributions: [academicContributionsSchema],
    supervisorNotes: {
    type: String,
    default: ""
  },
})

export default mongoose.models.Scholar || mongoose.model("Scholar", ScholarSchema)
