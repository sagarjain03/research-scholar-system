'use client'

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart,
  Line, CartesianGrid, PieChart, Pie, Cell, Legend, AreaChart, Area
} from 'recharts'

import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Clock, Trophy, Users, FileText, Award, Calendar, TrendingUp, Star, BookOpen, Target, Zap } from 'lucide-react'

const COLORS = ['#10b981', '#ef4444']
const milestoneColors = ['#8b5cf6', '#06b6d4', '#f59e0b', '#ef4444', '#10b981']

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
  { phase: 'Research Proposal', value: 85 },
  { phase: 'Data Collection', value: 68 },
  { phase: 'Analysis', value: 45 },
  { phase: 'Thesis Writing', value: 20 },
]

const attendancePercent = 94
const supervisorRating = 8.7

export function ScholarProfileView() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden  text-white">
        <div className="relative px-6 py-16 md:px-12 lg:px-16">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm">
                <Star className="h-5 w-5 text-yellow-300" />
                <span className="text-sm font-medium">PhD Research Scholar</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                My Research Dashboard
              </h1>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Track your academic journey with comprehensive insights and analytics
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-12 md:px-12 lg:px-16 max-w-7xl mx-auto space-y-12">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="relative overflow-hidden border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50 to-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 mb-1">Attendance</p>
                  <p className="text-3xl font-bold text-blue-800">{attendancePercent}%</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-l-4 border-l-green-500 bg-gradient-to-br from-green-50 to-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 mb-1">Total Progress</p>
                  <p className="text-3xl font-bold text-green-800">73%</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-l-4 border-l-purple-500 bg-gradient-to-br from-purple-50 to-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600 mb-1">Publications</p>
                  <p className="text-3xl font-bold text-purple-800">5</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <BookOpen className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-l-4 border-l-orange-500 bg-gradient-to-br from-orange-50 to-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600 mb-1">Rating</p>
                  <p className="text-3xl font-bold text-orange-800">{supervisorRating}/10</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <Award className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Progress Overview */}
          <Card className="lg:col-span-2 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BarChart className="h-6 w-6 text-blue-600" />
                </div>
                Monthly Progress Overview
              </h2>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={progressData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: 'none', 
                      borderRadius: '12px', 
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)' 
                    }} 
                  />
                  <Legend />
                  <Bar dataKey="completed" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} />
                  <Bar dataKey="inProgress" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="pending" stackId="a" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Current Status */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Target className="h-6 w-6 text-green-600" />
                </div>
                Current Status
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Performance and Milestones */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Performance Trend */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                Performance Trend
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={performanceData}>
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: 'none', 
                      borderRadius: '12px', 
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)' 
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="percent" 
                    stroke="#8b5cf6" 
                    strokeWidth={3}
                    fill="url(#colorGradient)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Milestone Completion */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Trophy className="h-6 w-6 text-indigo-600" />
                </div>
                Milestone Progress
              </h2>
              <div className="space-y-4">
                {milestoneData.map((milestone, index) => (
                  <div key={milestone.phase} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">{milestone.phase}</span>
                      <span className="text-sm font-bold text-gray-800">{milestone.value}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="h-3 rounded-full transition-all duration-1000 ease-out"
                        style={{ 
                          width: `${milestone.value}%`,
                          backgroundColor: milestoneColors[index]
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Attendance Display */}
        <Card className="shadow-2xl border-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 overflow-hidden">
          <CardContent className="p-12">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-emerald-500 rounded-xl shadow-lg">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-emerald-800">Attendance Analytics</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Enhanced Circular Progress */}
              <div className="flex justify-center">
                <div className="relative w-64 h-64">
                  <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 100 100">
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="35" 
                      stroke="#e5e7eb" 
                      strokeWidth="6" 
                      fill="none"
                      className="opacity-20" 
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="35"
                      stroke="url(#attendanceGradient)"
                      strokeWidth="6"
                      fill="none"
                      strokeDasharray={`${attendancePercent * 2.2} 999`}
                      strokeLinecap="round"
                      className="transition-all duration-2000 ease-out drop-shadow-sm"
                    />
                    <defs>
                      <linearGradient id="attendanceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="50%" stopColor="#34d399" />
                        <stop offset="100%" stopColor="#6ee7b7" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-bold text-emerald-600 mb-2">{attendancePercent}%</span>
                    <span className="text-lg text-emerald-700 font-semibold">Present</span>
                    <div className="flex mt-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 mx-0.5 ${
                            i < Math.floor(attendancePercent / 20) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Enhanced Attendance Stats */}
              <div className="space-y-6">
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-emerald-700 font-semibold text-lg">Days Present</span>
                    <span className="text-3xl font-bold text-emerald-600">23</span>
                  </div>
                  <Progress value={92} className="h-3 bg-emerald-100" />
                  <p className="text-sm text-emerald-600 mt-2">Excellent attendance record</p>
                </div>
                
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-red-700 font-semibold text-lg">Days Absent</span>
                    <span className="text-3xl font-bold text-red-500">2</span>
                  </div>
                  <Progress value={8} className="h-3 bg-red-100" />
                  <p className="text-sm text-red-600 mt-2">Within acceptable limits</p>
                </div>
                
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-blue-700 font-semibold text-lg">Official Leaves</span>
                    <span className="text-3xl font-bold text-blue-600">6</span>
                  </div>
                  <Progress value={24} className="h-3 bg-blue-100" />
                  <p className="text-sm text-blue-600 mt-2">Approved leave days</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Scholar Summary */}
        <Card className="shadow-2xl border-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
          <CardContent className="relative p-12">
            <div className="flex items-center gap-4 mb-10">
              <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl shadow-xl">
                <TrendingUp className="h-10 w-10 text-white" />
              </div>
              <div>
                <h2 className="text-4xl font-bold text-white mb-2">Scholar Performance Summary</h2>
                <p className="text-blue-200">Comprehensive overview of your academic journey</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="group bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-blue-500/20 rounded-xl">
                    <Target className="w-7 h-7 text-blue-300" />
                  </div>
                  <span className="text-blue-200 font-semibold text-lg">Current Phase</span>
                </div>
                <p className="text-white text-2xl font-bold mb-2">Data Collection</p>
                <p className="text-blue-200 text-sm">On track with research timeline</p>
              </div>
              
              <div className="group bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-yellow-500/20 rounded-xl">
                    <Award className="w-7 h-7 text-yellow-300" />
                  </div>
                  <span className="text-yellow-200 font-semibold text-lg">Supervisor Rating</span>
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-white text-3xl font-bold">{supervisorRating}</span>
                  <span className="text-yellow-300 text-xl">/10</span>
                </div>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(supervisorRating / 2) ? 'text-yellow-400 fill-current' : 'text-gray-500'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              <div className="group bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-green-500/20 rounded-xl">
                    <TrendingUp className="w-7 h-7 text-green-300" />
                  </div>
                  <span className="text-green-200 font-semibold text-lg">Overall Progress</span>
                </div>
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-white text-3xl font-bold">73%</span>
                  <Progress value={73} className="flex-1 h-2 bg-white/20" />
                </div>
                <p className="text-green-200 text-sm">Ahead of schedule</p>
              </div>
              
              <div className="group bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-purple-500/20 rounded-xl">
                    <Users className="w-7 h-7 text-purple-300" />
                  </div>
                  <span className="text-purple-200 font-semibold text-lg">Meetings</span>
                </div>
                <p className="text-white text-2xl font-bold mb-2">12</p>
                <p className="text-purple-200 text-sm">This semester</p>
              </div>
              
              <div className="group bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-indigo-500/20 rounded-xl">
                    <FileText className="w-7 h-7 text-indigo-300" />
                  </div>
                  <span className="text-indigo-200 font-semibold text-lg">Feedback</span>
                </div>
                <p className="text-white text-lg font-bold mb-2">Excellent</p>
                <p className="text-indigo-200 text-sm">Consistently positive reviews</p>
              </div>
              
              <div className="group bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-red-500/20 rounded-xl">
                    <Calendar className="w-7 h-7 text-red-300" />
                  </div>
                  <span className="text-red-200 font-semibold text-lg">Next Milestone</span>
                </div>
                <p className="text-white text-xl font-bold mb-2">Aug 2025</p>
                <p className="text-red-200 text-sm">Analysis completion</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Academic Contributions */}
        <Card className="shadow-2xl border-0 bg-gradient-to-br from-violet-900 via-purple-900 to-fuchsia-900 text-white overflow-hidden">
          <CardContent className="relative p-12">
            <div className="flex items-center gap-4 mb-10">
              <div className="p-4 bg-gradient-to-r from-violet-500 to-purple-500 rounded-2xl shadow-xl">
                <Trophy className="h-10 w-10 text-white" />
              </div>
              <div>
                <h2 className="text-4xl font-bold text-white mb-2">Past Academic Contributions</h2>
                <p className="text-purple-200">A showcase of your research achievements and impact</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              <div className="group bg-gradient-to-br from-violet-800/40 to-purple-900/40 rounded-2xl p-8 border border-violet-500/30 backdrop-blur-sm hover:from-violet-700/50 hover:to-purple-800/50 transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:shadow-purple-500/25">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-blue-500/30 rounded-xl group-hover:bg-blue-400/40 transition-colors">
                    <FileText className="w-8 h-8 text-blue-300 group-hover:text-blue-200 transition-colors" />
                  </div>
                  <span className="text-blue-200 font-bold text-lg">Publications</span>
                </div>
                <p className="text-5xl font-bold text-white mb-3">5</p>
                <p className="text-blue-200 text-sm mb-2">Research Papers</p>
                <div className="flex items-center gap-2 text-xs text-blue-300">
                  <Star className="w-3 h-3 fill-current" />
                  <span>High impact journals</span>
                </div>
              </div>
              
              <div className="group bg-gradient-to-br from-emerald-800/40 to-teal-900/40 rounded-2xl p-8 border border-emerald-500/30 backdrop-blur-sm hover:from-emerald-700/50 hover:to-teal-800/50 transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:shadow-emerald-500/25">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-green-500/30 rounded-xl group-hover:bg-green-400/40 transition-colors">
                    <Users className="w-8 h-8 text-green-300 group-hover:text-green-200 transition-colors" />
                  </div>
                  <span className="text-green-200 font-bold text-lg">Conferences</span>
                </div>
                <p className="text-3xl font-bold text-white mb-1">3 Int'l</p>
                <p className="text-2xl font-bold text-white mb-2">2 National</p>
                <p className="text-green-200 text-sm">Presentations delivered</p>
              </div>
              
              <div className="group bg-gradient-to-br from-amber-800/40 to-orange-900/40 rounded-2xl p-8 border border-amber-500/30 backdrop-blur-sm hover:from-amber-700/50 hover:to-orange-800/50 transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:shadow-amber-500/25">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-yellow-500/30 rounded-xl group-hover:bg-yellow-400/40 transition-colors">
                    <Award className="w-8 h-8 text-yellow-300 group-hover:text-yellow-200 transition-colors" />
                  </div>
                  <span className="text-yellow-200 font-bold text-lg">Recognition</span>
                </div>
                <p className="text-2xl font-bold text-white mb-2">2 Awards</p>
                <p className="text-xl font-bold text-white mb-3">1 Grant</p>
                <p className="text-yellow-200 text-sm">Research excellence</p>
              </div>
              
              <div className="group bg-gradient-to-br from-cyan-800/40 to-blue-900/40 rounded-2xl p-8 border border-cyan-500/30 backdrop-blur-sm hover:from-cyan-700/50 hover:to-blue-800/50 transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:shadow-cyan-500/25">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-teal-500/30 rounded-xl group-hover:bg-teal-400/40 transition-colors">
                    <Users className="w-8 h-8 text-teal-300 group-hover:text-teal-200 transition-colors" />
                  </div>
                  <span className="text-teal-200 font-bold text-lg">Collaborations</span>
                </div>
                <p className="text-lg font-bold text-white mb-1">XYZ Lab</p>
                <p className="text-lg font-bold text-white mb-3">ABC University</p>
                <p className="text-teal-200 text-sm">Active partnerships</p>
              </div>
              
              <div className="group bg-gradient-to-br from-pink-800/40 to-rose-900/40 rounded-2xl p-8 border border-pink-500/30 backdrop-blur-sm hover:from-pink-700/50 hover:to-rose-800/50 transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:shadow-pink-500/25">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-pink-500/30 rounded-xl group-hover:bg-pink-400/40 transition-colors">
                    <Users className="w-8 h-8 text-pink-300 group-hover:text-pink-200 transition-colors" />
                  </div>
                  <span className="text-pink-200 font-bold text-lg">Mentorship</span>
                </div>
                <p className="text-lg font-bold text-white mb-1">Dr. Jane Doe</p>
                <p className="text-lg font-bold text-white mb-3">Dr. John Smith</p>
                <p className="text-pink-200 text-sm">Former advisors</p>
              </div>
              
              <div className="group bg-gradient-to-br from-red-800/40 to-red-900/40 rounded-2xl p-8 border border-red-500/30 backdrop-blur-sm hover:from-red-700/50 hover:to-red-800/50 transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:shadow-red-500/25">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-red-500/30 rounded-xl group-hover:bg-red-400/40 transition-colors">
                    <Clock className="w-8 h-8 text-red-300 group-hover:text-red-200 transition-colors" />
                  </div>
                  <span className="text-red-200 font-bold text-lg">Extensions</span>
                </div>
                <p className="text-2xl font-bold text-white mb-3">2 times</p>
                <p className="text-red-200 text-sm mb-2">1 week, 2 months</p>
                <p className="text-red-300 text-xs">Within normal range</p>
              </div>
              
              <div className="group bg-gradient-to-br from-orange-800/40 to-red-900/40 rounded-2xl p-8 border border-orange-500/30 backdrop-blur-sm hover:from-orange-700/50 hover:to-red-800/50 transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:shadow-orange-500/25">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-orange-500/30 rounded-xl group-hover:bg-orange-400/40 transition-colors">
                    <TrendingUp className="w-8 h-8 text-orange-300 group-hover:text-orange-200 transition-colors" />
                  </div>
                  <span className="text-orange-200 font-bold text-lg">Efficiency</span>
                </div>
                <p className="text-4xl font-bold text-white mb-3">12</p>
                <p className="text-orange-200 text-sm mb-2">Average delay (days)</p>
                <p className="text-orange-300 text-xs">Improving trend</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
