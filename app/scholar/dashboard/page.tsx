"use client"

import {
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Chart as ChartJS,
} from "chart.js"
import { useEffect, useState } from "react"
import { Line } from "react-chartjs-2"
import Calendar from "react-calendar"
import 'react-calendar/dist/Calendar.css'
import { ScholarType } from "@/types"
import { useToast } from "@/hooks/use-toast"
import {
  BookOpen, LogOut, Clock, CheckCircle, AlertCircle,
  MessageSquare, Bell, TrendingUp, Calendar as CalendarIcon, User
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend)

function AttendanceCalendar({ attendance }: { attendance: any[] }) {
  const getTileClassName = ({ date }: { date: Date }) => {
    const record = attendance.find(
      (a) => new Date(a.date).toDateString() === date.toDateString()
    )
    if (!record) return ""
    if (record.status === "Present") return "bg-green-100 text-green-800 font-semibold"
    if (record.status === "Absent") return "bg-red-100 text-red-800 font-semibold"
    if (record.status === "Leave") return "bg-yellow-100 text-yellow-800 font-semibold"
  }

  return (
    <Card className="shadow-2xl border border-blue-100/50 backdrop-blur-md bg-white/60 dark:bg-gray-900/60 transition-all">
      <CardHeader>
        <CardTitle className="text-blue-700 dark:text-blue-300 text-lg">Attendance Calendar</CardTitle>
        <CardDescription className="text-sm text-gray-600 dark:text-gray-400">Visual monthly summary</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg overflow-hidden shadow-inner">
          <Calendar
            tileClassName={getTileClassName}
            className="w-full rounded-xl bg-transparent text-gray-900 dark:text-white border-0"
          />
        </div>
        <div className="flex justify-between mt-3 text-xs font-medium px-2 text-gray-600 dark:text-gray-300">
          <span className="bg-green-100 px-2 py-1 rounded">Present</span>
          <span className="bg-red-100 px-2 py-1 rounded">Absent</span>
          <span className="bg-yellow-100 px-2 py-1 rounded">Leave</span>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ScholarDashboard() {
  const [scholarData, setScholarData] = useState<ScholarType | null>(null)
  const [attendanceData, setAttendanceData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [feedback, setFeedback] = useState("")
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editedMilestone, setEditedMilestone] = useState<any>({})
  const { toast } = useToast()

  useEffect(() => {
    const fetchScholarData = async () => {
      const email = localStorage.getItem("userEmail")
      if (!email) {
        toast({ title: "Error", description: "No email found. Please log in again.", variant: "destructive" })
        setLoading(false)
        return
      }

      try {
        const res = await fetch("/api/scholars/get", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        })

        const result = await res.json()
        if (result.success && result.scholar) {
          setScholarData(result.scholar)
        } else {
          toast({ title: "Error", description: result.error || "Scholar not found.", variant: "destructive" })
        }

        const attendanceRes = await fetch("/api/attendance/get", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ scholarEmail: email }),
        })

        const attendanceResult = await attendanceRes.json()
        if (attendanceResult.success) {
          setAttendanceData(attendanceResult.attendance)
        }
      } catch {
        toast({ title: "Error", description: "Failed to fetch scholar data.", variant: "destructive" })
      } finally {
        setLoading(false)
      }
    }

    fetchScholarData()
  }, [toast])

  const handleLogout = () => {
    localStorage.removeItem("userEmail")
    toast({ title: "Logged out", description: "You have been logged out." })
  }

  const handleFeedbackSubmit = () => {
    toast({ title: "Feedback submitted!", description: "Your feedback has been sent." })
    setFeedback("")
  }

  const handleMilestoneEdit = (index: number) => {
    setEditingIndex(index)
    setEditedMilestone({ ...scholarData?.milestones[index] })
  }

  const handleMilestoneSave = async () => {
    const email = localStorage.getItem("userEmail")
    try {
      const res = await fetch("/api/scholars/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          milestoneIndex: editingIndex,
          updatedMilestone: editedMilestone,
        }),
      })

      const result = await res.json()
      if (result.success) {
        setScholarData(result.scholar)
        toast({ title: "Success", description: "Milestone updated successfully." })
        setEditingIndex(null)
        setEditedMilestone({})
      } else {
        toast({ title: "Error", description: result.error || "Update failed", variant: "destructive" })
      }
    } catch {
      toast({ title: "Error", description: "Failed to update milestone", variant: "destructive" })
    }
  }

  const handleChange = (field: string, value: any) => {
    setEditedMilestone({ ...editedMilestone, [field]: value })
  }

  const predictionData = {
    result: "On Time",
    confidence: 72,
    parameters: {
      attendance: 0.08,
      progress: -0.07,
      published: 0.006,
      extensions: -0.18,
      delay: -0.23,
      score: -0.0001,
    },
  }

  function PredictionGraph() {
    const labels = Object.keys(predictionData.parameters)
    const values = Object.values(predictionData.parameters)

    const data = {
      labels,
      datasets: [
        {
          label: "Feature Weights",
          data: values,
          fill: false,
          borderColor: "#2563eb",
          backgroundColor: "#60a5fa",
          tension: 0.4,
        },
      ],
    }

    const options = {
      scales: {
        y: { suggestedMin: -0.3, suggestedMax: 0.1 },
      },
      responsive: true,
      maintainAspectRatio: false,
    }

    return <div className="h-64 animate-fade-in"><Line data={data} options={options} /></div>
  }

  if (loading) return <div className="p-8 text-center text-lg animate-pulse text-gray-600">Loading scholar dashboard...</div>
  if (!scholarData) return <div className="p-8 text-center text-red-500">Scholar data not found.</div>

  const { name, milestones } = scholarData

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-green-100 dark:from-gray-900 dark:to-gray-800 transition-all">
      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 border-b shadow-sm backdrop-blur-md px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-blue-600" />
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Scholar Dashboard</h1>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <span className="text-gray-700 dark:text-gray-300">Hi, {name}</span>
          <Link href="/">
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-1" />
              Logout
            </Button>
          </Link>
        </div>
      </nav>

      {/* BODY */}
      <div className="max-w-7xl mx-auto px-4 py-10 grid lg:grid-cols-3 gap-8">
        {/* LEFT PANEL */}
        <div className="lg:col-span-2 space-y-8">
          {/* Prediction */}
          <Card className="border border-blue-200/60 shadow-xl dark:bg-gray-800 animate-fade-in">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                  <TrendingUp className="h-5 w-5" />
                  Progress Prediction
                </CardTitle>
                <Badge className="bg-green-100 text-green-800">{predictionData.result}</Badge>
              </div>
              <CardDescription className="dark:text-gray-400">Confidence: {predictionData.confidence}%</CardDescription>
            </CardHeader>
            <CardContent><PredictionGraph /></CardContent>
          </Card>

          {/* Milestone Tracker with Editing */}
          <Card className="shadow-xl border border-gray-200/50 dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                <CalendarIcon className="h-5 w-5" />
                Milestone Timeline
              </CardTitle>
              <CardDescription>Track and update your milestones</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {milestones.length > 0 ? milestones.map((m, idx) => (
                <div key={idx} className="flex items-start space-x-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-9 h-9 rounded-full shadow flex items-center justify-center ${
                      m.status === "Completed" ? "bg-green-100 text-green-600" :
                      m.status === "In Progress" ? "bg-blue-100 text-blue-600" :
                      "bg-gray-200 text-gray-500"
                    }`}>
                      {m.status === "Completed" ? <CheckCircle className="h-5 w-5" /> :
                       m.status === "In Progress" ? <Clock className="h-5 w-5" /> :
                       <AlertCircle className="h-5 w-5" />}
                    </div>
                    {idx < milestones.length - 1 && <div className="w-0.5 h-10 bg-gray-300 mt-2" />}
                  </div>
                  <div className="flex-1">
                    {editingIndex === idx ? (
                      <div className="space-y-2">
                        <Input value={editedMilestone.name} onChange={(e) => handleChange("name", e.target.value)} placeholder="Milestone Name" />
                        <Input type="date" value={editedMilestone.startDate?.substring(0, 10)} onChange={(e) => handleChange("startDate", e.target.value)} />
                        <Input type="date" value={editedMilestone.endDate?.substring(0, 10)} onChange={(e) => handleChange("endDate", e.target.value)} />
                        <Select value={editedMilestone.status} onValueChange={(value) => handleChange("status", value)}>
                          <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Not Started">Not Started</SelectItem>
                            <SelectItem value="In Progress">In Progress</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                            <SelectItem value="Missed">Missed</SelectItem>
                            <SelectItem value="Delayed">Delayed</SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="flex gap-2">
                          <Button size="sm" onClick={handleMilestoneSave}>Save</Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingIndex(null)}>Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">{m.name}</h4>
                            <p className="text-xs text-gray-500 italic">{m.notes}</p>
                          </div>
                          <div className="text-xs text-right text-gray-500">
                            <div>Start: {new Date(m.startDate).toLocaleDateString()}</div>
                            <div>End: {new Date(m.endDate).toLocaleDateString()}</div>
                          </div>
                        </div>
                        {m.status === "In Progress" && (
                          <div className="mt-2">
                            <Progress value={50} className="h-1 bg-blue-100" />
                            <span className="text-xs text-gray-500">50% complete</span>
                          </div>
                        )}
                        <Button size="sm" variant="ghost" onClick={() => handleMilestoneEdit(idx)} className="mt-2 text-blue-500">Edit</Button>
                      </>
                    )}
                  </div>
                </div>
              )) : (
                <p className="text-gray-500">No milestones assigned yet.</p>
              )}
            </CardContent>
          </Card>

          {/* Feedback */}
          <Card className="shadow-lg dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                <MessageSquare className="h-5 w-5" />
                Submit Feedback
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Label htmlFor="feedback">Your Message</Label>
              <Textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} className="mt-2 min-h-[100px]" />
              <Button className="mt-4 bg-blue-600 hover:bg-blue-700" onClick={handleFeedbackSubmit}>
                Submit Feedback
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT PANEL */}
        <div className="space-y-6">
          <Card className="shadow-lg dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm dark:text-gray-300">You have upcoming deadlines.</p>
            </CardContent>
          </Card>

          <AttendanceCalendar attendance={attendanceData} />

          <Card className="shadow-lg dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                <User className="h-5 w-5" />
                My Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Link href="/scholar/profile">
                <Button variant="outline" className="w-full text-blue-600 dark:text-blue-300">View Profile</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
