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
  const getProgressData = () => {
    const data = scholars.map((s) => {
      const completed = s.milestones.filter((m: any) => m.status === "Completed").length
      const total = s.milestones.length || 1
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

  const getPerformanceTrendData = () => {
    const durations = scholars.map((s) => {
      const end = new Date(s.expectedCompletion)
      const start = new Date(s.startDate)
      return (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
    })

    return {
      labels: scholars.map((s) => s.name),
      datasets: [
        {
          label: "Duration (months)",
          data: durations,
          borderColor: "#8b5cf6",
          backgroundColor: "#c4b5fd",
          tension: 0.4,
          fill: true,
          pointRadius: 5,
        },
      ],
    }
  }

  const getMilestoneStats = () => {
    const milestoneCounts: Record<string, number> = {}
    scholars.forEach((s) => {
      s.milestones.forEach((m: any) => {
        if (!milestoneCounts[m.name]) milestoneCounts[m.name] = 0
        milestoneCounts[m.name] += 1
      })
    })
    const labels = Object.keys(milestoneCounts)
    const counts = Object.values(milestoneCounts)

    return {
      labels,
      datasets: [
        {
          label: "Milestone Frequency",
          data: counts,
          borderColor: "#ec4899",
          backgroundColor: "rgba(236, 72, 153, 0.2)",
          tension: 0.3,
          fill: true,
          pointBackgroundColor: "#ec4899",
          pointBorderColor: "#ec4899",
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
          <CardTitle>Performance Analysis</CardTitle>
        </CardHeader>
        <CardContent className="flex-1">
          <Line data={getPerformanceTrendData()} options={{ maintainAspectRatio: false }} />
        </CardContent>
      </Card>

      <Card className="h-[400px] flex flex-col">
        <CardHeader>
          <CardTitle>Milestone Overview</CardTitle>
        </CardHeader>
        <CardContent className="flex-1">
          <Line data={getMilestoneStats()} options={{ maintainAspectRatio: false }} />
        </CardContent>
      </Card>
    </div>
  )
}
