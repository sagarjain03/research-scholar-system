"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { FileText, Download, TrendingUp, AlertTriangle, Users, Clock, CheckCircle, BarChart3 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function ReportsSection() {
  const [selectedReport, setSelectedReport] = useState("overview")
  const [timeRange, setTimeRange] = useState("6months")
  const { toast } = useToast()

  const reportTypes = [
    { id: "overview", name: "Overview Report", icon: BarChart3 },
    { id: "progress", name: "Progress Report", icon: TrendingUp },
    { id: "performance", name: "Performance Analysis", icon: Users },
    { id: "milestones", name: "Milestone Report", icon: CheckCircle },
    { id: "alerts", name: "Risk Assessment", icon: AlertTriangle },
  ]

  const overviewData = {
    totalScholars: 24,
    onTrack: 18,
    atRisk: 6,
    avgProgress: 65,
    completedMilestones: 89,
    upcomingDeadlines: 12,
  }

  const progressReportData = [
    {
      id: 1,
      name: "John Doe",
      department: "Computer Science",
      progress: 68,
      status: "On Track",
      lastUpdate: "2024-06-15",
      nextMilestone: "Data Analysis",
      daysToDeadline: 45,
    },
    {
      id: 2,
      name: "Jane Smith",
      department: "Engineering",
      progress: 45,
      status: "At Risk",
      lastUpdate: "2024-06-10",
      nextMilestone: "Literature Review",
      daysToDeadline: 15,
    },
    {
      id: 3,
      name: "Mike Johnson",
      department: "Mathematics",
      progress: 82,
      status: "Ahead",
      lastUpdate: "2024-06-14",
      nextMilestone: "Thesis Writing",
      daysToDeadline: 90,
    },
  ]

  const performanceMetrics = [
    { metric: "Average Completion Time", value: "18.5 months", trend: "+2.3%" },
    { metric: "Success Rate", value: "94%", trend: "+5.1%" },
    { metric: "On-Time Completion", value: "87%", trend: "-1.2%" },
    { metric: "Supervisor Satisfaction", value: "4.6/5", trend: "+0.3" },
  ]

  const milestoneData = [
    { milestone: "Literature Review", completed: 22, total: 24, percentage: 92 },
    { milestone: "Research Proposal", completed: 20, total: 24, percentage: 83 },
    { milestone: "Data Collection", completed: 15, total: 24, percentage: 63 },
    { milestone: "Analysis & Results", completed: 8, total: 24, percentage: 33 },
    { milestone: "Thesis Writing", completed: 3, total: 24, percentage: 13 },
  ]

  const riskAssessment = [
    {
      scholar: "Jane Smith",
      risk: "High",
      reason: "Behind schedule on literature review",
      recommendation: "Additional supervision required",
      priority: "Urgent",
    },
    {
      scholar: "Robert Wilson",
      risk: "Medium",
      reason: "Slow progress on data collection",
      recommendation: "Resource allocation review",
      priority: "Medium",
    },
    {
      scholar: "Sarah Davis",
      risk: "Low",
      reason: "Minor delays in analysis phase",
      recommendation: "Monitor progress closely",
      priority: "Low",
    },
  ]

  const handleExportReport = () => {
    toast({
      title: "Report exported successfully!",
      description: "The report has been downloaded to your device.",
    })
  }

  const renderOverviewReport = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="dark:bg-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Total Scholars</p>
                <p className="text-2xl font-bold">{overviewData.totalScholars}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">On Track</p>
                <p className="text-2xl font-bold text-green-600">{overviewData.onTrack}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">At Risk</p>
                <p className="text-2xl font-bold text-red-600">{overviewData.atRisk}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Avg Progress</p>
                <p className="text-2xl font-bold">{overviewData.avgProgress}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Milestones</p>
                <p className="text-2xl font-bold">{overviewData.completedMilestones}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Deadlines</p>
                <p className="text-2xl font-bold text-orange-600">{overviewData.upcomingDeadlines}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderProgressReport = () => (
    <Card className="dark:bg-gray-800">
      <CardHeader>
        <CardTitle>Scholar Progress Report</CardTitle>
        <CardDescription>Detailed progress tracking for all scholars</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Scholar</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Next Milestone</TableHead>
              <TableHead>Days to Deadline</TableHead>
              <TableHead>Last Update</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {progressReportData.map((scholar) => (
              <TableRow key={scholar.id}>
                <TableCell className="font-medium">{scholar.name}</TableCell>
                <TableCell>{scholar.department}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Progress value={scholar.progress} className="w-16 h-2" />
                    <span className="text-sm">{scholar.progress}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      scholar.status === "On Track"
                        ? "bg-green-100 text-green-800"
                        : scholar.status === "Ahead"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-red-100 text-red-800"
                    }
                  >
                    {scholar.status}
                  </Badge>
                </TableCell>
                <TableCell>{scholar.nextMilestone}</TableCell>
                <TableCell>
                  <span
                    className={
                      scholar.daysToDeadline < 30
                        ? "text-red-600 font-medium"
                        : scholar.daysToDeadline < 60
                          ? "text-orange-600"
                          : "text-green-600"
                    }
                  >
                    {scholar.daysToDeadline} days
                  </span>
                </TableCell>
                <TableCell>{scholar.lastUpdate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )

  const renderPerformanceAnalysis = () => (
    <div className="space-y-6">
      <Card className="dark:bg-gray-800">
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
          <CardDescription>Key performance indicators across the program</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {performanceMetrics.map((metric, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-600">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{metric.metric}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                </div>
                <div className="text-right">
                  <p
                    className={`text-sm font-medium ${
                      metric.trend.startsWith("+") ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {metric.trend}
                  </p>
                  <p className="text-xs text-gray-500">vs last period</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderMilestoneReport = () => (
    <Card className="dark:bg-gray-800">
      <CardHeader>
        <CardTitle>Milestone Completion Report</CardTitle>
        <CardDescription>Progress across different research phases</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {milestoneData.map((milestone, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{milestone.milestone}</span>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {milestone.completed}/{milestone.total} ({milestone.percentage}%)
                </span>
              </div>
              <Progress value={milestone.percentage} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )

  const renderRiskAssessment = () => (
    <Card className="dark:bg-gray-800">
      <CardHeader>
        <CardTitle>Risk Assessment Report</CardTitle>
        <CardDescription>Scholars requiring attention and intervention</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Scholar</TableHead>
              <TableHead>Risk Level</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Recommendation</TableHead>
              <TableHead>Priority</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {riskAssessment.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{item.scholar}</TableCell>
                <TableCell>
                  <Badge
                    className={
                      item.risk === "High"
                        ? "bg-red-100 text-red-800"
                        : item.risk === "Medium"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-yellow-100 text-yellow-800"
                    }
                  >
                    {item.risk}
                  </Badge>
                </TableCell>
                <TableCell>{item.reason}</TableCell>
                <TableCell>{item.recommendation}</TableCell>
                <TableCell>
                  <Badge
                    variant={item.priority === "Urgent" ? "destructive" : "secondary"}
                    className={item.priority === "Medium" ? "bg-orange-100 text-orange-800" : ""}
                  >
                    {item.priority}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )

  const renderReportContent = () => {
    switch (selectedReport) {
      case "overview":
        return renderOverviewReport()
      case "progress":
        return renderProgressReport()
      case "performance":
        return renderPerformanceAnalysis()
      case "milestones":
        return renderMilestoneReport()
      case "alerts":
        return renderRiskAssessment()
      default:
        return renderOverviewReport()
    }
  }

  return (
    <div className="space-y-6">
      {/* Report Controls */}
      <Card className="dark:bg-gray-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <span>Reports & Analytics</span>
              </CardTitle>
              <CardDescription>Generate and view comprehensive reports</CardDescription>
            </div>
            <div className="flex items-center space-x-4">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-40 dark:bg-gray-700 dark:border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1month">Last Month</SelectItem>
                  <SelectItem value="3months">Last 3 Months</SelectItem>
                  <SelectItem value="6months">Last 6 Months</SelectItem>
                  <SelectItem value="1year">Last Year</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleExportReport} className="bg-green-600 hover:bg-green-700">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {reportTypes.map((report) => {
              const Icon = report.icon
              return (
                <Button
                  key={report.id}
                  variant={selectedReport === report.id ? "default" : "outline"}
                  onClick={() => setSelectedReport(report.id)}
                  className="flex items-center space-x-2"
                >
                  <Icon className="h-4 w-4" />
                  <span>{report.name}</span>
                </Button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Report Content */}
      {renderReportContent()}
    </div>
  )
}
