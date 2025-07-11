"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { useToast } from "@/hooks/use-toast"
import { AddScholarForm } from "@/components/add-scholar-form"
import { ReportsSection } from "@/components/reports-section"
import { DashboardCharts } from "@/components/admin-charts"
import {
  BookOpen,
  LogOut,
  Users,
  UserPlus,
  FileText,
  Search,
  Eye,
  TrendingUp,
  Calendar as CalendarIcon,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react"

export default function AdminDashboard() {
  const [currentView, setCurrentView] = useState("scholars")
  const [searchTerm, setSearchTerm] = useState("")
  const [scholars, setScholars] = useState<any[]>([])
  const [attendance, setAttendance] = useState<any[]>([])
  const [attendanceStatus, setAttendanceStatus] = useState<Record<string, "Present" | "Absent" | "Leave">>({})
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split("T")[0])
  const { toast } = useToast()

  useEffect(() => {
    const adminEmail = localStorage.getItem("userEmail")
    if (!adminEmail) return

    const fetchScholars = async () => {
      const res = await fetch(`/api/scholars/get?createdBy=${adminEmail}`)
      const data = await res.json()
      if (data.success) setScholars(data.scholars)
    }

    const fetchAttendance = async () => {
      const res = await fetch(`/api/attendance/get?createdBy=${adminEmail}`)
      const data = await res.json()
      if (data.success) setAttendance(data.attendance)
    }

    fetchScholars()
    fetchAttendance()
  }, [])

  const filteredScholars = scholars.filter(
    (s) =>
      s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleLogout = () => {
    toast({ title: "Logged out", description: "You have been logged out." })
  }

  const handleSaveAttendance = async () => {
    const createdBy = localStorage.getItem("userEmail")
    const date = attendanceDate

    const saveResults = await Promise.all(
      filteredScholars.map(async (scholar) => {
        const status = attendanceStatus[scholar.email]
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
      description: `Attendance for ${new Date(attendanceDate).toLocaleDateString()} saved for ${saveResults.filter(r => r?.success).length} scholars.`,
      className: "bg-green-600 text-white border-0"
    })
  }

  const renderMainContent = () => {
    switch (currentView) {
      case "add-scholar":
        return <AddScholarForm onSuccess={() => setCurrentView("scholars")} />
      case "reports":
        return <ReportsSection />
      case "attendance":
        return (
          <Card className="shadow-xl dark:bg-gray-900/80 border border-gray-800">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-blue-500/10">
                  <FileText className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-blue-400">Attendance Records</CardTitle>
                  <CardDescription className="text-gray-400">
                    Mark and manage scholar attendance records
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                <div className="relative w-full md:w-96">
                  <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <Input
                    className="pl-10 w-full dark:bg-gray-800/50 dark:border-gray-700 focus:ring-2 focus:ring-blue-500/50"
                    placeholder="Search scholars by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center space-x-3 w-full md:w-auto">
                  <div className="flex items-center bg-gray-100 dark:bg-gray-800/50 px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700">
                    <CalendarIcon className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                    <Input
                      type="date"
                      value={attendanceDate}
                      onChange={(e) => setAttendanceDate(e.target.value)}
                      className="w-40 dark:bg-transparent border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </div>
                  <Button 
                    onClick={handleSaveAttendance}
                    className="bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-blue-500/20"
                  >
                    Save Attendance
                  </Button>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
                <Table>
                  <TableHeader className="bg-gray-100 dark:bg-gray-800/50">
                    <TableRow>
                      <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Scholar</TableHead>
                      <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Email</TableHead>
                      <TableHead className="font-semibold text-gray-700 dark:text-gray-300 text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredScholars.length > 0 ? (
                      filteredScholars.map((s) => (
                        <TableRow key={s._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                          <TableCell className="font-medium dark:text-white">
                            <div className="flex items-center space-x-3">
                              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                                <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                              </div>
                              <span>{s.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="dark:text-gray-300">{s.email}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Badge
                                variant={attendanceStatus[s.email] === "Present" ? "default" : "outline"}
                                className={`px-3 py-1 rounded-full cursor-pointer transition-all ${
                                  attendanceStatus[s.email] === "Present" 
                                    ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50"
                                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                                }`}
                                onClick={() => setAttendanceStatus((prev) => ({ ...prev, [s.email]: "Present" }))}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Present
                              </Badge>
                              <Badge
                                variant={attendanceStatus[s.email] === "Absent" ? "default" : "outline"}
                                className={`px-3 py-1 rounded-full cursor-pointer transition-all ${
                                  attendanceStatus[s.email] === "Absent" 
                                    ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50"
                                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                                }`}
                                onClick={() => setAttendanceStatus((prev) => ({ ...prev, [s.email]: "Absent" }))}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Absent
                              </Badge>
                              <Badge
                                variant={attendanceStatus[s.email] === "Leave" ? "default" : "outline"}
                                className={`px-3 py-1 rounded-full cursor-pointer transition-all ${
                                  attendanceStatus[s.email] === "Leave" 
                                    ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/50"
                                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                                }`}
                                onClick={() => setAttendanceStatus((prev) => ({ ...prev, [s.email]: "Leave" }))}
                              >
                                <Clock className="h-4 w-4 mr-1" />
                                Leave
                              </Badge>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                          {searchTerm ? "No matching scholars found" : "No scholars available"}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-6 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <div>
                  Showing <span className="font-medium">{filteredScholars.length}</span> of <span className="font-medium">{scholars.length}</span> scholars
                </div>
                <div className="flex items-center space-x-4">
                  <span className="flex items-center">
                    <span className="w-3 h-3 rounded-full bg-green-500 mr-1"></span>
                    Present: {Object.values(attendanceStatus).filter(s => s === "Present").length}
                  </span>
                  <span className="flex items-center">
                    <span className="w-3 h-3 rounded-full bg-red-500 mr-1"></span>
                    Absent: {Object.values(attendanceStatus).filter(s => s === "Absent").length}
                  </span>
                  <span className="flex items-center">
                    <span className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></span>
                    Leave: {Object.values(attendanceStatus).filter(s => s === "Leave").length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      case "scholars":
      default:
        return (
          <>
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
            </div>

            <DashboardCharts scholars={scholars} attendance={attendance} />

            <Card className="border-0 shadow-lg dark:bg-gray-800 mt-8">
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
                      <TableHead>Department</TableHead>
                      <TableHead>Supervisor</TableHead>
                      <TableHead>Research Area</TableHead>
                      <TableHead>Start–End Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredScholars.map((scholar) => {
                      const formatDate = (date: string) =>
                        new Date(date).toLocaleDateString("en-US", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      return (
                        <TableRow key={scholar._id}>
                          <TableCell className="font-medium dark:text-white">{scholar.name}</TableCell>
                          <TableCell className="dark:text-gray-300">{scholar.email}</TableCell>
                          <TableCell className="dark:text-gray-300 capitalize">{scholar.department || "N/A"}</TableCell>
                          <TableCell className="dark:text-gray-300 capitalize">{scholar.supervisor || "N/A"}</TableCell>
                          <TableCell className="dark:text-gray-300">{scholar.researchArea || "N/A"}</TableCell>
                          <TableCell className="dark:text-gray-300">
                            {scholar.startDate && scholar.expectedCompletion
                              ? `${formatDate(scholar.startDate)} – ${formatDate(scholar.expectedCompletion)}`
                              : "N/A"}
                          </TableCell>
                          <TableCell>
                            <Link href={`/admin/scholars/${scholar._id}`}>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      )
                    })}
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
        <div className="w-64 bg-white dark:bg-gray-800 shadow-lg min-h-screen">
          <div className="p-6">
            <nav className="space-y-2">
              <Button
                variant="ghost"
                className={`w-full justify-start ${currentView === "scholars" ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300" : ""}`}
                onClick={() => setCurrentView("scholars")}
              >
                <Users className="h-4 w-4 mr-3" />
                Scholars List
              </Button>
              <Button
                variant="ghost"
                className={`w-full justify-start ${currentView === "attendance" ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300" : ""}`}
                onClick={() => setCurrentView("attendance")}
              >
                <FileText className="h-4 w-4 mr-3" />
                Attendance
              </Button>
              <Button
                variant="ghost"
                className={`w-full justify-start ${currentView === "add-scholar" ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300" : ""}`}
                onClick={() => setCurrentView("add-scholar")}
              >
                <UserPlus className="h-4 w-4 mr-3" />
                Add Scholar
              </Button>
              <Button
                variant="ghost"
                className={`w-full justify-start ${currentView === "reports" ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300" : ""}`}
                onClick={() => setCurrentView("reports")}
              >
                <TrendingUp className="h-4 w-4 mr-3" />
                Reports
              </Button>
            </nav>
          </div>
        </div>

        <main className="flex-1 p-6">{renderMainContent()}</main>
      </div>
    </div>
  )
}