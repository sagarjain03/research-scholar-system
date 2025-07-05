'use client'

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart,
  Line, CartesianGrid, PieChart, Pie, Cell, Legend, AreaChart, Area
} from 'recharts'

import { Card, CardContent } from '@/components/ui/card'

const COLORS = ['#00C49F', '#FF4444']
const milestoneColors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1']

const progressData = [
  { month: 'Jan', completed: 4, inProgress: 5, pending: 3 },
  { month: 'Feb', completed: 6, inProgress: 7, pending: 2 },
  { month: 'Mar', completed: 8, inProgress: 6, pending: 1 },
  { month: 'Apr', completed: 10, inProgress: 4, pending: 1 },
  { month: 'May', completed: 11, inProgress: 3, pending: 1 },
  { month: 'Jun', completed: 12, inProgress: 2, pending: 0 },
]

const statusData = [
  { name: 'On Track', value: 1 },
  { name: 'At Risk', value: 0 },
]

const performanceData = [
  { month: 'Jan', percent: 45 },
  { month: 'Feb', percent: 55 },
  { month: 'Mar', percent: 62 },
  { month: 'Apr', percent: 65 },
  { month: 'May', percent: 69 },
  { month: 'Jun', percent: 73 },
]

const milestoneData = [
  { phase: 'Literature Review', value: 100 },
  { phase: 'Research Proposal', value: 80 },
  { phase: 'Data Collection', value: 60 },
  { phase: 'Analysis', value: 40 },
  { phase: 'Thesis Writing', value: 20 },
]

const attendanceData = [
  { month: 'Jan', attendance: 22 },
  { month: 'Feb', attendance: 20 },
  { month: 'Mar', attendance: 21 },
  { month: 'Apr', attendance: 23 },
  { month: 'May', attendance: 24 },
  { month: 'Jun', attendance: 25 },
]

export function ScholarProfileView() {
  return (
    <div className="space-y-10 px-12 py-8 max-w-screen-2xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-10">My Research Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
        {/* Progress Overview */}
        <Card className="col-span-2">
          <CardContent>
            <h2 className="text-2xl font-semibold mb-4">Monthly Progress Overview</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={progressData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="completed" stackId="a" fill="#00C49F" />
                <Bar dataKey="inProgress" stackId="a" fill="#FFBB28" />
                <Bar dataKey="pending" stackId="a" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card>
          <CardContent>
            <h2 className="text-2xl font-semibold mb-4">Current Status</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  label
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance Trend */}
        <Card className="col-span-2">
          <CardContent>
            <h2 className="text-2xl font-semibold mb-4">Performance Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="percent" stroke="#00C49F" fill="#00C49F" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Milestone Completion */}
        <Card className="col-span-1">
          <CardContent>
            <h2 className="text-2xl font-semibold mb-4">Milestone Completion</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart layout="vertical" data={milestoneData}>
                <XAxis type="number" />
                <YAxis type="category" dataKey="phase" />
                <Tooltip />
                <Bar dataKey="value" fill="#4287f5">
                  {milestoneData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={milestoneColors[index % milestoneColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Attendance Stats */}
        <Card className="col-span-2">
          <CardContent>
            <h2 className="text-2xl font-semibold mb-4">Attendance Overview</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis label={{ value: 'Days Present', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Line type="monotone" dataKey="attendance" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Scholar Summary */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-white mb-6 border-b border-gray-600 pb-2">Scholar Summary</h2>
        <div className="space-y-4 text-lg text-white tracking-wide leading-relaxed">
          <p><span className="font-semibold text-white">Current Phase:</span> Data Collection</p>
          <p><span className="font-semibold text-white">Supervisor Feedback:</span> Positive and encouraging</p>
          <p><span className="font-semibold text-white">Meetings Attended:</span> 12 this semester</p>
          <p><span className="font-semibold text-white">Total Progress:</span> 73%</p>
          <p><span className="font-semibold text-white">Next Milestone Due:</span> August 2025</p>
        </div>
      </div>

      {/* Past Records Section */}
      <div className="bg-gradient-to-br from-indigo-900 to-indigo-700 rounded-xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-white mb-6 border-b border-indigo-400 pb-2">Past Academic Contributions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-white text-lg leading-relaxed">
          <div className="bg-indigo-800 bg-opacity-40 rounded-lg p-4 shadow">
            <p className="font-semibold">Research Papers Published:</p>
            <p className="text-xl font-bold mt-1">5</p>
          </div>
          <div className="bg-indigo-800 bg-opacity-40 rounded-lg p-4 shadow">
            <p className="font-semibold">Conferences Attended:</p>
            <p className="text-xl font-bold mt-1">3 International, 2 National</p>
          </div>
          <div className="bg-indigo-800 bg-opacity-40 rounded-lg p-4 shadow">
            <p className="font-semibold">Awards & Grants:</p>
            <p className="text-xl font-bold mt-1">2 Best Paper Awards, 1 Research Grant</p>
          </div>
          <div className="bg-indigo-800 bg-opacity-40 rounded-lg p-4 shadow">
            <p className="font-semibold">Previous Collaborations:</p>
            <p className="text-xl font-bold mt-1">With XYZ Lab, ABC University</p>
          </div>
          <div className="bg-indigo-800 bg-opacity-40 rounded-lg p-4 shadow">
            <p className="font-semibold">Former Advisors:</p>
            <p className="text-xl font-bold mt-1">Dr. Jane Doe, Dr. John Smith</p>
          </div>
        </div>
      </div>
    </div>
  )
}
