"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts"

const progressData = [
  { name: "Jan", completed: 4, inProgress: 8, pending: 12 },
  { name: "Feb", completed: 7, inProgress: 10, pending: 7 },
  { name: "Mar", completed: 12, inProgress: 8, pending: 4 },
  { name: "Apr", completed: 15, inProgress: 6, pending: 3 },
  { name: "May", completed: 18, inProgress: 4, pending: 2 },
  { name: "Jun", completed: 20, inProgress: 3, pending: 1 },
]

const statusData = [
  { name: "On Track", value: 18, color: "hsl(var(--chart-1))" },
  { name: "At Risk", value: 6, color: "hsl(var(--chart-2))" },
]

const performanceData = [
  { month: "Jan", avgProgress: 45 },
  { month: "Feb", avgProgress: 52 },
  { month: "Mar", avgProgress: 58 },
  { month: "Apr", avgProgress: 61 },
  { month: "May", avgProgress: 64 },
  { month: "Jun", avgProgress: 68 },
]

// New data for average attendance
const attendanceData = [
  { month: "Jan", avgAttendance: 78 },
  { month: "Feb", avgAttendance: 81 },
  { month: "Mar", avgAttendance: 76 },
  { month: "Apr", avgAttendance: 83 },
  { month: "May", avgAttendance: 85 },
  { month: "Jun", avgAttendance: 88 },
]

export function ProgressOverviewChart() {
  return (
    <Card className="col-span-2 dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="dark:text-white">Progress Overview</CardTitle>
        <CardDescription className="dark:text-gray-300">Monthly progress tracking across all scholars</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            completed: {
              label: "Completed",
              color: "hsl(var(--chart-1))",
            },
            inProgress: {
              label: "In Progress",
              color: "hsl(var(--chart-2))",
            },
            pending: {
              label: "Pending",
              color: "hsl(var(--chart-3))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="name" className="text-muted-foreground" />
              <YAxis className="text-muted-foreground" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="completed" stackId="a" fill="var(--color-completed)" radius={[0, 0, 4, 4]} />
              <Bar dataKey="inProgress" stackId="a" fill="var(--color-inProgress)" />
              <Bar dataKey="pending" stackId="a" fill="var(--color-pending)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export function StatusDistributionChart() {
  return (
    <Card className="dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="dark:text-white">Status Distribution</CardTitle>
        <CardDescription className="dark:text-gray-300">Current status of all scholars</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            onTrack: {
              label: "On Track",
              color: "hsl(var(--chart-1))",
            },
            atRisk: {
              label: "At Risk",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
        <div className="flex justify-center space-x-4 mt-4">
          {statusData.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-sm text-muted-foreground dark:text-gray-300">
                {entry.name}: {entry.value}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function PerformanceTrendChart() {
  return (
    <Card className="col-span-2 dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="dark:text-white">Performance Trend</CardTitle>
        <CardDescription className="dark:text-gray-300">Average progress percentage over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            avgProgress: {
              label: "Average Progress",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" className="text-muted-foreground" />
              <YAxis className="text-muted-foreground" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="avgProgress"
                stroke="var(--color-avgProgress)"
                fill="var(--color-avgProgress)"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export function AverageAttendanceChart() {
  return (
    <Card className="dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="dark:text-white">Average Attendance</CardTitle>
        <CardDescription className="dark:text-gray-300">Monthly average attendance of all scholars</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            avgAttendance: {
              label: "Average Attendance",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" className="text-muted-foreground" />
              <YAxis className="text-muted-foreground" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="avgAttendance"
                stroke="var(--color-avgAttendance)"
                fill="var(--color-avgAttendance)"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
