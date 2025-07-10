"use client"

import { useEffect, useState } from "react"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import {
  FileText, Download, TrendingUp, AlertTriangle,
  Users, Clock, CheckCircle, BarChart3, CalendarDays
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type Scholar = {
  name: string
  email: string
  department: string
  startDate: string
  expectedCompletion: string
  milestones: {
    name: string
    status: string
    startDate: string
    endDate: string
  }[]
  rating?: number
  feedback?: string
}

type Attendance = {
  scholarEmail: string
  status: "Present" | "Absent" | "Leave"
  date: string
}

export function ReportsSection() {
  const [selectedReport, setSelectedReport] = useState("overview")
  const [timeRange, setTimeRange] = useState("6months")
  const [scholars, setScholars] = useState<Scholar[]>([])
  const [attendance, setAttendance] = useState<Attendance[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const [createdBy, setCreatedBy] = useState("")

  useEffect(() => {
    const userEmail = typeof window !== "undefined" ? localStorage.getItem("userEmail") : ""
    setCreatedBy(userEmail || "")
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      if (!createdBy) return
      
      try {
        setLoading(true)
        const scholarRes = await fetch(`/api/scholars/get?createdBy=${createdBy}`)
        const scholarJson = await scholarRes.json()
        const attendanceRes = await fetch(`/api/attendance/get?createdBy=${createdBy}`)
        const attendanceJson = await attendanceRes.json()

        if (scholarJson.success) setScholars(scholarJson.scholars)
        if (attendanceJson.success) setAttendance(attendanceJson.attendance)
      } catch (error) {
        console.error("Error loading report data", error)
        toast({
          title: "Error",
          description: "Failed to load report data",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [createdBy, toast])

  const handleExportReport = () => {
    toast({ title: "Exported Successfully", description: "Report downloaded (placeholder)" })
  }

  const reportTypes = [
    { id: "overview", name: "Overview Report", icon: BarChart3 },
    { id: "progress", name: "Progress Report", icon: TrendingUp },
    { id: "attendance", name: "Attendance Report", icon: CalendarDays },
    { id: "performance", name: "Performance Analysis", icon: Users },
    { id: "milestones", name: "Milestone Report", icon: CheckCircle },
    { id: "alerts", name: "Risk Assessment", icon: AlertTriangle },
  ]

  const getAttendanceOverview = () => {
    const grouped: Record<string, Attendance[]> = {}
    attendance.forEach((a) => {
      if (!grouped[a.scholarEmail]) grouped[a.scholarEmail] = []
      grouped[a.scholarEmail].push(a)
    })

    const total = Object.keys(grouped).length
    const onTrack = Object.values(grouped).filter((records) => {
      const presentDays = records.filter((r) => r.status === "Present").length
      return (presentDays / records.length) >= 0.75
    }).length

    const atRisk = total - onTrack

    return {
      total,
      onTrack,
      atRisk,
      avgProgress: Math.round((onTrack / total) * 100),
      completedMilestones: scholars.reduce((acc, s) => acc + s.milestones.filter((m) => m.status === "Completed").length, 0),
      upcomingDeadlines: scholars.reduce((acc, s) => acc + s.milestones.filter((m) => {
        const date = new Date(m.endDate)
        return date > new Date() && m.status !== "Completed"
      }).length, 0),
    }
  }

  const getProgressReportData = () => {
    return scholars.map((s) => {
      const total = s.milestones.length
      const completed = s.milestones.filter((m) => m.status === "Completed").length
      const progress = Math.round((completed / total) * 100)
      const nextMilestone = s.milestones.find((m) => m.status === "Not Started" || m.status === "In Progress")
      const daysToDeadline = nextMilestone?.endDate
        ? Math.ceil((new Date(nextMilestone.endDate).getTime() - Date.now()) / (1000 * 3600 * 24))
        : "--"

      return {
        name: s.name,
        department: s.department,
        progress,
        status: progress >= 75 ? "Ahead" : progress >= 50 ? "On Track" : "At Risk",
        lastUpdate: new Date(s.startDate).toLocaleDateString(),
        nextMilestone: nextMilestone?.name || "-",
        daysToDeadline: typeof daysToDeadline === "number" ? daysToDeadline : "--",
      }
    })
  }

  const getPerformanceMetrics = () => {
    const now = new Date()
    const durations = scholars.map((s) => {
      const end = s.expectedCompletion ? new Date(s.expectedCompletion) : now
      const start = new Date(s.startDate)
      const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
      return months
    })

    const avgTime = durations.length ? durations.reduce((a, b) => a + b, 0) / durations.length : 0
    const successRate = scholars.filter((s) => s.milestones.every((m) => m.status === "Completed")).length
    const onTime = scholars.filter((s) =>
      s.milestones.every((m) =>
        m.status === "Completed" ? new Date(m.endDate) >= new Date(m.startDate) : true
      )
    ).length

    return [
      { metric: "Average Completion Time", value: `${avgTime.toFixed(1)} months`, trend: "+1.0%" },
      { metric: "Success Rate", value: `${Math.round((successRate / scholars.length) * 100)}%`, trend: "+4.2%" },
      { metric: "On-Time Completion", value: `${Math.round((onTime / scholars.length) * 100)}%`, trend: "-2.1%" },
      { metric: "Total Scholars", value: scholars.length.toString(), trend: "" },
    ]
  }

  const getRiskAssessment = () => {
    return scholars
      .filter((s) => s.milestones.some((m) => m.status === "Missed" || m.status === "Delayed"))
      .map((s) => {
        const riskMilestone = s.milestones.find((m) => m.status === "Missed" || m.status === "Delayed")
        return {
          scholar: s.name,
          risk: riskMilestone?.status === "Missed" ? "High" : "Medium",
          reason: `${riskMilestone?.name} is ${riskMilestone?.status}`,
          recommendation: "Follow up required",
          priority: riskMilestone?.status === "Missed" ? "Urgent" : "Medium",
        }
      })
  }

  const renderAttendanceReport = () => {
    const grouped: Record<string, Attendance[]> = {}
    attendance.forEach((a) => {
      if (!grouped[a.scholarEmail]) grouped[a.scholarEmail] = []
      grouped[a.scholarEmail].push(a)
    })

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Scholar Attendance Summary</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Present</TableHead>
                  <TableHead>Absent</TableHead>
                  <TableHead>Leave</TableHead>
                  <TableHead>Attendance %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scholars.map((s, i) => {
                  const records = grouped[s.email] || []
                  const total = records.length || 1
                  const present = records.filter((r) => r.status === "Present").length
                  const absent = records.filter((r) => r.status === "Absent").length
                  const leave = records.filter((r) => r.status === "Leave").length
                  const percent = Math.round((present / total) * 100)
                  return (
                    <TableRow key={i}>
                      <TableCell>{s.name}</TableCell>
                      <TableCell>{present}</TableCell>
                      <TableCell>{absent}</TableCell>
                      <TableCell>{leave}</TableCell>
                      <TableCell>
                        <Progress value={percent} className="h-2 w-24" />
                        <span className="ml-2">{percent}%</span>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Date-wise Attendance Records</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Scholar</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendance
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((record, index) => {
                    const scholar = scholars.find(s => s.email === record.scholarEmail)
                    return (
                      <TableRow key={index}>
                        <TableCell>{scholar?.name || "Unknown"}</TableCell>
                        <TableCell>{record.scholarEmail}</TableCell>
                        <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              record.status === "Present" ? "default"
                                : record.status === "Absent" ? "destructive"
                                : "outline"
                            }
                          >
                            {record.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    )
                  })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderMilestoneReport = () => {
    return (
      <Card>
        <CardHeader><CardTitle>Milestones by Scholar</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          {scholars.map((s, i) => (
            <div key={i} className="space-y-2">
              <h3 className="font-semibold text-lg">{s.name} <span className="text-sm text-muted-foreground">({s.email})</span></h3>
              {s.milestones.map((m, j) => (
                <div key={j} className="border p-2 rounded-md shadow-sm bg-muted/20">
                  <div className="flex justify-between text-sm">
                    <div>
                      <p className="font-medium">{m.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(m.startDate).toLocaleDateString()} - {new Date(m.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <Badge variant="outline">{m.status}</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  const renderPerformanceAnalysis = () => {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Scholar Performance Evaluation</CardTitle>
          <CardDescription>Rate and provide feedback for each scholar</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Scholar</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Rating (1-10)</TableHead>
                <TableHead>Feedback</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scholars.map((scholar) => (
                <TableRow key={scholar.email}>
                  <TableCell className="font-medium">{scholar.name}</TableCell>
                  <TableCell>{scholar.department}</TableCell>
                  <TableCell>
                    <Select
                      value={scholar.rating?.toString() || ""}
                      onValueChange={async (value) => {
                        try {
                          const response = await fetch('/api/scholars', {
                            method: 'PUT',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                              email: scholar.email,
                              rating: parseInt(value),
                            }),
                          });
                          
                          if (response.ok) {
                            const updatedScholar = await response.json();
                            setScholars(scholars.map(s => 
                              s.email === scholar.email ? updatedScholar.scholar : s
                            ));
                            toast({
                              title: "Success",
                              description: "Rating updated successfully",
                            });
                          }
                        } catch (error) {
                          console.error("Error updating rating:", error);
                          toast({
                            title: "Error",
                            description: "Failed to update rating",
                            variant: "destructive",
                          });
                        }
                      }}
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <textarea
                      className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Enter feedback..."
                      value={scholar.feedback || ""}
                      onChange={(e) => {
                        setScholars(scholars.map(s => 
                          s.email === scholar.email ? {...s, feedback: e.target.value} : s
                        ));
                      }}
                      onBlur={async (e) => {
                        try {
                          const response = await fetch('/api/scholars', {
                            method: 'PUT',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                              email: scholar.email,
                              feedback: e.target.value,
                            }),
                          });
                          
                          if (!response.ok) {
                            throw new Error("Failed to update feedback");
                          }
                          toast({
                            title: "Success",
                            description: "Feedback saved successfully",
                          });
                        } catch (error) {
                          console.error("Error updating feedback:", error);
                          toast({
                            title: "Error",
                            description: "Failed to save feedback",
                            variant: "destructive",
                          });
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        try {
                          const response = await fetch('/api/scholars', {
                            method: 'PUT',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                              email: scholar.email,
                              rating: null,
                              feedback: "",
                            }),
                          });
                          
                          if (response.ok) {
                            const updatedScholar = await response.json();
                            setScholars(scholars.map(s => 
                              s.email === scholar.email ? updatedScholar.scholar : s
                            ));
                            toast({
                              title: "Success",
                              description: "Evaluation cleared",
                            });
                          }
                        } catch (error) {
                          console.error("Error clearing evaluation:", error);
                          toast({
                            title: "Error",
                            description: "Failed to clear evaluation",
                            variant: "destructive",
                          });
                        }
                      }}
                    >
                      Clear
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    )
  }

  const renderContent = () => {
    if (loading) return <p className="text-muted-foreground">Loading reports...</p>
    if (selectedReport === "overview") {
      const data = getAttendanceOverview()
      return (
        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card><CardContent className="p-4"><Users className="text-blue-600" /><p>Total Scholars</p><p className="text-2xl font-bold">{data.total}</p></CardContent></Card>
          <Card><CardContent className="p-4"><CheckCircle className="text-green-600" /><p>On Track</p><p className="text-2xl font-bold text-green-600">{data.onTrack}</p></CardContent></Card>
          <Card><CardContent className="p-4"><AlertTriangle className="text-red-600" /><p>At Risk</p><p className="text-2xl font-bold text-red-600">{data.atRisk}</p></CardContent></Card>
          <Card><CardContent className="p-4"><TrendingUp className="text-blue-600" /><p>Avg Progress</p><p className="text-2xl font-bold">{data.avgProgress}%</p></CardContent></Card>
          <Card><CardContent className="p-4"><CheckCircle className="text-green-600" /><p>Milestones</p><p className="text-2xl font-bold">{data.completedMilestones}</p></CardContent></Card>
          <Card><CardContent className="p-4"><Clock className="text-orange-600" /><p>Deadlines</p><p className="text-2xl font-bold text-orange-600">{data.upcomingDeadlines}</p></CardContent></Card>
        </div>
      )
    }
    if (selectedReport === "progress") {
      const data = getProgressReportData()
      return (
        <Card>
          <CardHeader><CardTitle>Scholar Progress</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Next Milestone</TableHead>
                  <TableHead>Days to Deadline</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((s, i) => (
                  <TableRow key={i}>
                    <TableCell>{s.name}</TableCell>
                    <TableCell>{s.department}</TableCell>
                    <TableCell><Progress value={s.progress} className="h-2 w-20" /> <span>{s.progress}%</span></TableCell>
                    <TableCell><Badge>{s.status}</Badge></TableCell>
                    <TableCell>{s.nextMilestone}</TableCell>
                    <TableCell>{s.daysToDeadline}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )
    }
    if (selectedReport === "performance") return renderPerformanceAnalysis()
    if (selectedReport === "attendance") return renderAttendanceReport()
    if (selectedReport === "milestones") return renderMilestoneReport()
    if (selectedReport === "alerts") {
      const data = getRiskAssessment()
      return (
        <Card>
          <CardHeader><CardTitle>Risk Assessment</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Scholar</TableHead>
                  <TableHead>Risk</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Recommendation</TableHead>
                  <TableHead>Priority</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((r, i) => (
                  <TableRow key={i}>
                    <TableCell>{r.scholar}</TableCell>
                    <TableCell><Badge variant="destructive">{r.risk}</Badge></TableCell>
                    <TableCell>{r.reason}</TableCell>
                    <TableCell>{r.recommendation}</TableCell>
                    <TableCell><Badge>{r.priority}</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2"><FileText /> Reports & Analytics</CardTitle>
              <CardDescription>Dynamic reports based on scholar data</CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1month">Last Month</SelectItem>
                  <SelectItem value="3months">Last 3 Months</SelectItem>
                  <SelectItem value="6months">Last 6 Months</SelectItem>
                  <SelectItem value="1year">Last Year</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleExportReport}><Download className="mr-2" /> Export</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {reportTypes.map((r) => {
            const Icon = r.icon
            return (
              <Button key={r.id} onClick={() => setSelectedReport(r.id)} variant={selectedReport === r.id ? "default" : "outline"}>
                <Icon className="mr-2 h-4 w-4" /> {r.name}
              </Button>
            )
          })}
        </CardContent>
      </Card>
      {renderContent()}
    </div>
  )
}