"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Bar, Line, Pie } from "react-chartjs-2"
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
} from "chart.js"

ChartJS.register(
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
  PointElement
)

export function DashboardCharts({
  scholars,
  attendance,
}: {
  scholars: any[]
  attendance: any[]
}) {
  // 1. Progress Report (unchanged)
  const getProgressData = () => {
    const data = scholars.map((s) => {
      const completed = s.milestones?.filter((m: any) => m.status === "Completed").length || 0
      const total = s.milestones?.length || 1
      return {
        name: s.name,
        progress: Math.round((completed / total) * 100),
      }
    })
    return {
      labels: data.map((d) => d.name),
      datasets: [
        {
          label: "Progress %",
          data: data.map((d) => d.progress),
          backgroundColor: "#3b82f6",
          borderRadius: 6,
        },
      ],
    }
  }

  // 2. Attendance Report (unchanged)
  const getAttendanceData = () => {
    const grouped: Record<string, number> = { Present: 0, Absent: 0, Leave: 0 }
    attendance.forEach((a: any) => {
      grouped[a.status] += 1
    })
    return {
      labels: ["Present", "Absent", "Leave"],
      datasets: [
        {
          label: "Attendance",
          data: [grouped.Present, grouped.Absent, grouped.Leave],
          backgroundColor: ["#10b981", "#ef4444", "#f59e0b"],
          borderWidth: 1,
        },
      ],
    }
  }

  // 3. Performance Analysis - Now shows ratings
  const getPerformanceTrendData = () => {
    const ratings = scholars.map((s) => ({
      name: s.name,
      // Default to 0 if no rating exists
      rating: s.rating || 0,
    }))

    return {
      labels: ratings.map((r) => r.name),
      datasets: [
        {
          label: "Performance Rating",
          data: ratings.map((r) => r.rating),
          borderColor: "#8b5cf6",
          backgroundColor: "#c4b5fd",
          tension: 0.4,
          fill: true,
          pointRadius: 5,
        },
      ],
    }
  }

  // 4. New: Publication Status (replaces Milestone Overview)
  const getPublicationStats = () => {
    const statusCounts = {
      Published: 2,
      Submitted: 3,
      'In Progress': 1,
      'Not Started': 2
    }

    scholars.forEach((s) => {
      s.publications?.forEach((pub: any) => {
        statusCounts[pub.status] += 1
      })
    })

    return {
      labels: Object.keys(statusCounts),
      datasets: [
        {
          label: "Publication Status",
          data: Object.values(statusCounts),
          backgroundColor: [
            "#10b981", // Published - green
            "#3b82f6", // Submitted - blue
            "#f59e0b", // In Progress - yellow
            "#64748b"  // Not Started - gray
          ],
          borderWidth: 1,
        },
      ],
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="h-[400px] flex flex-col">
        <CardHeader>
          <CardTitle>Progress Report</CardTitle>
        </CardHeader>
        <CardContent className="flex-1">
          <Bar data={getProgressData()} options={{ maintainAspectRatio: false }} />
        </CardContent>
      </Card>

      <Card className="h-[400px] flex flex-col">
        <CardHeader>
          <CardTitle>Attendance Report</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-full">
          <div className="w-[250px] h-[250px]">
            <Pie
              data={getAttendanceData()}
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: true,
                    position: "top",
                    align: "center",
                    labels: {
                      boxWidth: 20,
                      padding: 15,
                    },
                  },
                },
              }}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="h-[400px] flex flex-col">
        <CardHeader>
          <CardTitle>Performance Ratings</CardTitle>
        </CardHeader>
        <CardContent className="flex-1">
          <Line 
            data={getPerformanceTrendData()} 
            options={{ 
              maintainAspectRatio: false,
              scales: {
                y: {
                  min: 0,
                  max: 10, // Assuming ratings are out of 10
                  title: {
                    display: true,
                    text: 'Rating (out of 10)'
                  }
                }
              }
            }} 
          />
        </CardContent>
      </Card>

      <Card className="h-[400px] flex flex-col">
        <CardHeader>
          <CardTitle>Publication Status</CardTitle>
        </CardHeader>
        <CardContent className="flex-1">
          <Bar 
            data={getPublicationStats()} 
            options={{ 
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false
                }
              }
            }} 
          />
        </CardContent>
      </Card>
    </div>
  )
}