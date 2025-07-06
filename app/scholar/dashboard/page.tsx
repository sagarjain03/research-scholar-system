"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import {
  BookOpen,
  LogOut,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Bell,
  TrendingUp,
  Calendar,
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { ThemeToggle } from "@/components/theme-toggle"
import { User } from "lucide-react" 

export default function ScholarDashboard() {
  const [feedback, setFeedback] = useState("")
  const { toast } = useToast()

  const milestones = [
    { id: 1, title: "Literature Review", status: "completed", date: "2024-01-15", progress: 100 },
    { id: 2, title: "Research Proposal", status: "completed", date: "2024-03-20", progress: 100 },
    { id: 3, title: "Data Collection", status: "in-progress", date: "2024-06-30", progress: 75 },
    { id: 4, title: "Analysis & Results", status: "pending", date: "2024-09-15", progress: 0 },
    { id: 5, title: "Thesis Writing", status: "pending", date: "2024-12-01", progress: 0 },
  ]

  const notifications = [
    { id: 1, message: "Data Collection milestone due in 15 days", type: "warning", date: "2024-06-15" },
    { id: 2, message: "Monthly progress report submitted successfully", type: "success", date: "2024-06-10" },
    { id: 3, message: "Supervisor feedback available for review", type: "info", date: "2024-06-08" },
  ]

  const handleFeedbackSubmit = () => {
    toast({
      title: "Feedback submitted!",
      description: "Your feedback has been sent to your supervisor.",
    })
    setFeedback("")
  }

  const handleLogout = () => {
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800">
      {/* Top Navigation */}
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-blue-100 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6 text-blue-600" />
              <span className="text-lg font-semibold text-gray-900 dark:text-white">Scholar Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <span className="text-gray-700 dark:text-gray-300">Welcome, John Doe</span>
              <Link href="/">
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Prediction Status Card */}
            <Card className="border-0 shadow-lg dark:bg-gray-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span className="dark:text-white">Progress Prediction</span>
                  </CardTitle>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">On Track</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">Overall Progress</span>
                    <span className="font-medium">68%</span>
                  </div>
                  <Progress value={68} className="h-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Based on your current progress, you are on track to complete your research by December 2024. Keep up
                    the excellent work!
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Milestone Tracker */}
            <Card className="border-0 shadow-lg dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <span>Milestone Timeline</span>
                </CardTitle>
                <CardDescription>Track your research progress through key milestones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {milestones.map((milestone, index) => (
                    <div key={milestone.id} className="flex items-start space-x-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            milestone.status === "completed"
                              ? "bg-green-100 text-green-600"
                              : milestone.status === "in-progress"
                                ? "bg-blue-100 text-blue-600"
                                : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {milestone.status === "completed" ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : milestone.status === "in-progress" ? (
                            <Clock className="h-4 w-4" />
                          ) : (
                            <AlertCircle className="h-4 w-4" />
                          )}
                        </div>
                        {index < milestones.length - 1 && <div className="w-0.5 h-12 bg-gray-200 mt-2" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white">{milestone.title}</h3>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{milestone.date}</span>
                        </div>
                        {milestone.status === "in-progress" && (
                          <div className="mt-2">
                            <Progress value={milestone.progress} className="h-1" />
                            <span className="text-xs text-gray-500 mt-1">{milestone.progress}% complete</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Feedback Section */}
            <Card className="border-0 shadow-lg dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                  <span>Submit Feedback</span>
                </CardTitle>
                <CardDescription>Share your progress updates and concerns with your supervisor</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="feedback">Your Message</Label>
                    <Textarea
                      id="feedback"
                      placeholder="Share your progress, challenges, or questions..."
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      className="mt-2 min-h-[100px]"
                    />
                  </div>
                  <Button onClick={handleFeedbackSubmit} className="bg-blue-600 hover:bg-blue-700">
                    Submit Feedback
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Notifications */}
            <Card className="border-0 shadow-lg dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5 text-blue-600" />
                  <span>Notifications</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700"
                    >
                      <div
                        className={`w-2 h-2 rounded-full mt-2 ${
                          notification.type === "warning"
                            ? "bg-yellow-400"
                            : notification.type === "success"
                              ? "bg-green-400"
                              : "bg-blue-400"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 dark:text-white">{notification.message}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="border-0 shadow-lg dark:bg-gray-800">
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Completed Milestones</span>
                    <span className="font-medium">2/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Days Until Next Deadline</span>
                    <span className="font-medium text-orange-600">15</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Research Duration</span>
                    <span className="font-medium">18 months</span>
                  </div>
                </div>
              </CardContent>
            </Card>
              {/* My Profile Link */}
            <Card className="border-0 shadow-lg dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-blue-600" />
                  <span>My Profile</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Link href="/scholar/profile">
                  <Button variant="outline" className="w-full text-blue-600 dark:text-blue-300">
                    View Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
  
}

