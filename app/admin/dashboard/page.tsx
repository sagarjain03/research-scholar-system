"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  BookOpen, LogOut, Users, UserPlus, FileText, Search, Eye, TrendingUp, AlertTriangle,
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  ProgressOverviewChart,
  StatusDistributionChart,
  PerformanceTrendChart,
  AverageAttendanceChart,
} from "@/components/admin-charts"
import { AddScholarForm } from "@/components/add-scholar-form"
import { ReportsSection } from "@/components/reports-section"

export default function AdminDashboard() {
  const [currentView, setCurrentView] = useState("scholars")
  const [searchTerm, setSearchTerm] = useState("")
  const [scholars, setScholars] = useState<any[]>([])
  const [attendance, setAttendance] = useState<Record<string, "Present" | "Absent" | "Leave">>({})
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split("T")[0])
  const { toast } = useToast()

  useEffect(() => {
    const fetchScholars = async () => {
      const adminEmail = localStorage.getItem("userEmail")
      if (!adminEmail) return

      try {
        const res = await fetch(`/api/scholars/get?createdBy=${adminEmail}`)
        const data = await res.json()
        if (data.success) {
          setScholars(data.scholars)
        }
      } catch (err) {
        console.error("Error fetching scholars:", err)
      }
    }

    fetchScholars()
  }, [])

  const filteredScholars = scholars.filter(
    (s) =>
      s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleLogout = () => {
    toast({ title: "Logged out", description: "You have been logged out." })
  }

  const renderMainContent = () => {
    switch (currentView) {
      case "add-scholar":
        return <AddScholarForm onSuccess={() => setCurrentView("scholars")} />
      case "reports":
        return <ReportsSection />
      case "attendance":
          const filteredAttendanceScholars = scholars.filter(
    (scholar) =>
      scholar.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scholar.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSaveAttendance = async () => {
    const createdBy = localStorage.getItem("userEmail")
    const date = attendanceDate

    const saveResults = await Promise.all(
      filteredAttendanceScholars.map(async (scholar) => {
        const status = attendance[scholar.email]
        if (!status) return null

        const res = await fetch("/api/attendance/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            scholarEmail: scholar.email,
            status,
            date,
            createdBy,
          }),
        })

        return res.json()
      })
    )

    toast({
      title: "Attendance Saved",
      description: `Attendance for ${attendanceDate} saved for ${saveResults.filter(r => r?.success).length} scholars.`,
    })
  }
        return (
          <Card className="shadow-lg dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="dark:text-white">Attendance Records</CardTitle>
              <CardDescription className="dark:text-gray-300">
                Mark attendance for scholars on a selected date
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-6">
                <div className="relative flex items-center space-x-4">
                  <Search className="h-4 w-4 text-gray-400 absolute ml-3" />
                  <Input
                    className="pl-10 w-64 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Search scholars..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Select Date:</span>
                  <Input
                    type="date"
                    value={attendanceDate}
                    onChange={(e) => setAttendanceDate(e.target.value)}
                    className="w-40 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Attendance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredScholars.map((s) => (
                    <TableRow key={s._id}>
                      <TableCell className="font-medium dark:text-white">{s.name}</TableCell>
                      <TableCell className="dark:text-gray-300">{s.email}</TableCell>
                      <TableCell>
                        {(["Present", "Absent", "Leave"] as const).map((status) => (
                          <Badge
                            key={status}
                            variant={attendance[s.email] === status ? "default" : "outline"}
                            className="mr-2 cursor-pointer"
                            onClick={() => setAttendance((prev) => ({ ...prev, [s.email]: status }))}
                          >
                            {status}
                          </Badge>
                        ))}

                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-4 text-right">
                <Button onClick={handleSaveAttendance}>Save Attendance</Button>
              </div>
            </CardContent>
          </Card>
        )
      case "scholars":
      default:
        return (
          <>
            {/* Dashboard Metrics */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <Card className="border-0 shadow-lg dark:bg-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Total Scholars</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{scholars.length}</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg dark:bg-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">On Track</p>
                      <p className="text-2xl font-bold text-green-600">
                        {scholars.filter((s) => s.status === "On Track").length}
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg dark:bg-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">At Risk</p>
                      <p className="text-2xl font-bold text-red-600">
                        {scholars.filter((s) => s.status === "At Risk").length}
                      </p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg dark:bg-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Avg Progress</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {scholars.length > 0
                          ? `${Math.round(
                              scholars.reduce((sum, s) => sum + (s.progress || 0), 0) / scholars.length
                            )}%`
                          : "0%"}
                      </p>
                    </div>
                    <FileText className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-3 gap-6 mb-8">
              <ProgressOverviewChart />
              <StatusDistributionChart />
            </div>

            <div className="grid lg:grid-cols-3 gap-6 mb-8">
              <PerformanceTrendChart />
              <AverageAttendanceChart />
            </div>

            {/* Scholars Table */}
            <Card className="border-0 shadow-lg dark:bg-gray-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="dark:text-white">Research Scholars</CardTitle>
                    <CardDescription className="dark:text-gray-300">
                      Manage and monitor all research scholars
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search scholars..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setCurrentView("add-scholar")}>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add Scholar
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Prediction</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredScholars.map((scholar) => (
                      <TableRow key={scholar._id}>
                        <TableCell className="font-medium dark:text-white">{scholar.name}</TableCell>
                        <TableCell className="dark:text-gray-300">{scholar.email}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              scholar.status === "On Track"
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : "bg-red-100 text-red-800 hover:bg-red-100"
                            }
                          >
                            {scholar.status || "N/A"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={scholar.prediction === "On Time" ? "default" : "destructive"}>
                            {scholar.prediction || "Unknown"}
                          </Badge>
                        </TableCell>
                        <TableCell>{scholar.progress || 0}%</TableCell>
                        <TableCell>{scholar.lastUpdated?.split("T")[0] || "N/A"}</TableCell>
                        <TableCell>
                          <Link href={`/admin/scholars/${scholar._id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800">
      {/* Navbar */}
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-blue-100 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6 text-blue-600" />
              <span className="text-lg font-semibold text-gray-900 dark:text-white">Admin Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <span className="text-gray-700 dark:text-gray-300">Welcome, Admin</span>
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

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white dark:bg-gray-800 shadow-lg min-h-screen">
          <div className="p-6">
            <nav className="space-y-2">
              <Button
                variant="ghost"
                className={`w-full justify-start ${
                  currentView === "scholars" ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300" : ""
                }`}
                onClick={() => setCurrentView("scholars")}
              >
                <Users className="h-4 w-4 mr-3" />
                Scholars List
              </Button>
              <Button
                variant="ghost"
                className={`w-full justify-start ${
                  currentView === "attendance" ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300" : ""
                }`}
                onClick={() => setCurrentView("attendance")}
              >
                <FileText className="h-4 w-4 mr-3" />
                Attendance
              </Button>
              <Button
                variant="ghost"
                className={`w-full justify-start ${
                  currentView === "add-scholar" ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300" : ""
                }`}
                onClick={() => setCurrentView("add-scholar")}
              >
                <UserPlus className="h-4 w-4 mr-3" />
                Add Scholar
              </Button>
              <Button
                variant="ghost"
                className={`w-full justify-start ${
                  currentView === "reports" ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300" : ""
                }`}
                onClick={() => setCurrentView("reports")}
              >
                <TrendingUp className="h-4 w-4 mr-3" />
                Reports
              </Button>
            </nav>
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 p-6">{renderMainContent()}</main>
      </div>
    </div>
  )
}
