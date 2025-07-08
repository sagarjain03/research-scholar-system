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
import { ScholarType } from "@/types"
import { useToast } from "@/hooks/use-toast"
import {
  BookOpen, LogOut, Clock, CheckCircle, AlertCircle,
  MessageSquare, Bell, TrendingUp, Calendar, User
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend)

export default function ScholarDashboard() {
  const [scholarData, setScholarData] = useState<ScholarType | null>(null)
  const [loading, setLoading] = useState(true)
  const [feedback, setFeedback] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    const fetchScholarData = async () => {
      const email = localStorage.getItem("userEmail")
      if (!email) {
        toast({
          title: "Error",
          description: "No email found. Please log in again.",
          variant: "destructive",
        })
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
          toast({
            title: "Error",
            description: result.error || "Scholar not found.",
            variant: "destructive",
          })
        }
      } catch {
        toast({
          title: "Error",
          description: "Failed to fetch scholar data.",
          variant: "destructive",
        })
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
    toast({
      title: "Feedback submitted!",
      description: "Your feedback has been sent.",
    })
    setFeedback("")
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
          borderColor: "#3b82f6",
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

    return <div className="h-64"><Line data={data} options={options} /></div>
  }

  if (loading) {
    return <div className="p-8 text-center">Loading scholar dashboard...</div>
  }

  if (!scholarData) {
    return <div className="p-8 text-center text-red-500">Scholar data not found.</div>
  }

  const { name, milestones } = scholarData

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800">
      {/* Navbar */}
      <nav className="bg-white/80 dark:bg-gray-900/80 sticky top-0 border-b px-4 py-2 flex justify-between">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-6 w-6 text-blue-600" />
          <span className="text-lg font-semibold dark:text-white">Scholar Dashboard</span>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <span className="text-gray-700 dark:text-gray-300">Welcome, {name}</span>
          <Link href="/">
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-1" />
              Logout
            </Button>
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Prediction */}
          <Card className="shadow-lg dark:bg-gray-800">
            <CardHeader>
              <div className="flex justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <span className="dark:text-white">Progress Prediction</span>
                </CardTitle>
                <Badge className="bg-green-100 text-green-800">{predictionData.result}</Badge>
              </div>
              <CardDescription className="dark:text-gray-400">Confidence: {predictionData.confidence}%</CardDescription>
            </CardHeader>
            <CardContent><PredictionGraph /></CardContent>
          </Card>

          {/* Milestones */}
          <Card className="shadow-lg dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <span>Milestone Timeline</span>
              </CardTitle>
              <CardDescription>Track your milestones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {milestones.length > 0 ? (
                  milestones.map((m, idx) => (
                    <div key={idx} className="flex items-start space-x-4">
                      {/* Status Dot */}
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          m.status === "completed"
                            ? "bg-green-100 text-green-600"
                            : m.status === "in-progress"
                            ? "bg-blue-100 text-blue-600"
                            : "bg-gray-200 text-gray-500"
                        }`}>
                          {m.status === "completed" ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : m.status === "in-progress" ? (
                            <Clock className="h-4 w-4" />
                          ) : (
                            <AlertCircle className="h-4 w-4" />
                          )}
                        </div>
                        {idx < milestones.length - 1 && <div className="w-0.5 h-12 bg-gray-300 mt-2" />}
                      </div>

                      {/* Milestone Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between">
                          <div>
                            <h4 className="text-sm font-medium dark:text-white">{m.name}</h4>
                            <p className="text-xs text-gray-500 mt-1 italic">{m.notes}</p>
                          </div>
                          <div className="text-right text-xs text-gray-500">
                            <div>Start: {new Date(m.startDate).toLocaleDateString()}</div>
                            <div>End: {new Date(m.endDate).toLocaleDateString()}</div>
                          </div>
                        </div>

                        {m.status === "in-progress" && (
                          <div className="mt-2">
                            <Progress value={50} className="h-1" />
                            <span className="text-xs text-gray-500">50% complete</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No milestones assigned yet.</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Feedback */}
          <Card className="shadow-lg dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                <span>Submit Feedback</span>
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

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="shadow-lg dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-blue-600" />
                <span>Notifications</span>
              </CardTitle>
            </CardHeader>
            <CardContent><p className="text-sm dark:text-gray-300">You have upcoming deadlines.</p></CardContent>
          </Card>

          <Card className="shadow-lg dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5 text-blue-600" />
                <span>My Profile</span>
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
