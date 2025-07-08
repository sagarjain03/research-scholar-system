export type Milestone = {
  name: string
  status: string
  notes: string
  startDate: string
  endDate: string
}

export type ScholarType = {
  _id: string
  name: string
  email: string
  phone: string
  department: string
  supervisor: string
  researchArea: string
  startDate: string
  expectedCompletion: string
  description: string
  milestones: Milestone[]
}
