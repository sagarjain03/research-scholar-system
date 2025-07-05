"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { BookOpen, LogOut, Users, UserPlus, FileText, Search, Eye, TrendingUp, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  ProgressOverviewChart,
  StatusDistributionChart,
  PerformanceTrendChart,
  MilestoneCompletionChart,
} from "@/components/admin-charts"
import { AddScholarForm } from "@/components/add-scholar-form"
import { ReportsSection } from "@/components/reports-section"

export default function AdminDashboard() {
  const [currentView, setCurrentView] = useState("scholars")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedScholar, setSelectedScholar] = useState<any>(null)
  const { toast } = useToast()

  const scholars = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@university.edu",
      status: "On Track",
      prediction: "On Time",
      lastUpdated: "2024-06-15",
      progress: 68,
      milestones: {
        completed: 2,
        total: 5,
      },
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@university.edu",
      status: "At Risk",
      prediction: "Delay Expected",
      lastUpdated: "2024-06-10",
      progress: 45,
      milestones: {
        completed: 1,
        total: 5,
      },
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike.johnson@university.edu",
      status: "On Track",
      prediction: "On Time",
      lastUpdated: "2024-06-14",
      progress: 82,
      milestones: {
        completed: 3,
        total: 5,
      },
    },
  ]

  const filteredScholars = scholars.filter(
    (scholar) =>
      scholar.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scholar.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleLogout = () => {
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    })
  }

  const renderMainContent = () => {
    switch (currentView) {
      case "add-scholar":
        return <AddScholarForm onSuccess={() => setCurrentView("scholars")} />
      case "reports":
        return <ReportsSection />
      case "scholars":
      default:
        return (
          <>
            {/* Stats Cards */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <Card className="border-0 shadow-lg dark:bg-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Total Scholars</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">24</p>
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
                      <p className="text-2xl font-bold text-green-600">18</p>
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
                      <p className="text-2xl font-bold text-red-600">6</p>
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
                      <p className="text-2xl font-bold text-blue-600">65%</p>
                    </div>
                    <FileText className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Section */}
            <div className="grid lg:grid-cols-3 gap-6 mb-8">
              <ProgressOverviewChart />
              <StatusDistributionChart />
            </div>

            <div className="grid lg:grid-cols-3 gap-6 mb-8">
              <PerformanceTrendChart />
              <MilestoneCompletionChart />
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
                      <TableRow key={scholar.id}>
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
                            {scholar.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={scholar.prediction === "On Time" ? "default" : "destructive"}>
                            {scholar.prediction}
                          </Badge>
                        </TableCell>
                        <TableCell>{scholar.progress}%</TableCell>
                        <TableCell>{scholar.lastUpdated}</TableCell>
                        <TableCell>
                            <Link href={`/admin/scholars/${scholar.id}`}>
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
      {/* Top Navigation */}
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
                <FileText className="h-4 w-4 mr-3" />
                View Reports
              </Button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">{renderMainContent()}</div>
      </div>
    </div>
  )
}
