"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  BookOpen, Award, Users, Link as LinkIcon, Calendar as CalendarIcon,
  CheckCircle, TrendingUp, FileText, Star, Clock, ArrowLeft, AlertCircle
} from "lucide-react"

export default function AdminScholarProfile({ params }: { params: { id: string } }) {
  const [scholar, setScholar] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()
  const [progressPercentage, setProgressPercentage] = useState(0)

  useEffect(() => {
    const fetchScholar = async () => {
      try {
        const res = await fetch(`/api/scholars/get-by-id?id=${params.id}`)
        const data = await res.json()
        if (data.success) {
          setScholar(data.scholar)
          // Calculate progress percentage based on completed milestones
          if (data.scholar.milestones?.length > 0) {
            const completed = data.scholar.milestones.filter((m: any) => m.status === "Completed").length
            const total = data.scholar.milestones.length
            const percentage = Math.round((completed / total) * 100)
            setProgressPercentage(percentage)
          }
        } else {
          throw new Error(data.error || "Failed to fetch scholar")
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load scholar data",
          variant: "destructive"
        })
        router.push("/admin")
      } finally {
        setLoading(false)
      }
    }

    fetchScholar()
  }, [params.id, router, toast])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  }

  if (loading) return <div className="p-8 text-center">Loading scholar data...</div>
  if (!scholar) return <div className="p-8 text-center text-red-500">Scholar not found</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Back Button */}
        <Button variant="outline" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        {/* Profile Header */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-gray-800 dark:to-gray-700">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-blue-800 dark:text-white">
              {scholar.name}'s Profile
            </CardTitle>
            <CardDescription className="text-blue-600 dark:text-blue-300">
              {scholar.department} • {scholar.researchArea}
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border border-blue-200">
            <CardHeader className="flex flex-row items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Progress</CardTitle>
                <CardDescription>Milestone completion</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <Progress value={progressPercentage} className="h-2" />
              <div className="text-xl font-bold mt-2">{progressPercentage}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                {scholar.milestones?.filter((m: any) => m.status === "Completed").length || 0} of {scholar.milestones?.length || 0} milestones completed
              </p>
            </CardContent>
          </Card>

          <Card className="border border-green-200">
            <CardHeader className="flex flex-row items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-full">
                <Star className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Rating</CardTitle>
                <CardDescription>Supervisor evaluation</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{scholar.rating || 'N/A'}/10</div>
              <div className="flex mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 mx-0.5 ${
                      i < Math.floor((scholar.rating || 0) / 2) 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border border-purple-200">
            <CardHeader className="flex flex-row items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Feedback</CardTitle>
                <CardDescription>Supervisor comments</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{scholar.feedback || 'No feedback yet'}</p>
            </CardContent>
          </Card>

          <Card className="border border-orange-200">
            <CardHeader className="flex flex-row items-center space-x-4">
              <div className="p-3 bg-orange-100 rounded-full">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Timeline</CardTitle>
                <CardDescription>Research duration</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                <div>Start: {formatDate(scholar.startDate)}</div>
                <div>End: {formatDate(scholar.expectedCompletion)}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Academic Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Milestones */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Research Milestones</CardTitle>
              <CardDescription>Key progress markers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {scholar.milestones?.length > 0 ? (
                scholar.milestones.map((m: any, i: number) => (
                  <div key={i} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{m.name}</h4>
                        <p className="text-sm text-gray-500">{m.notes}</p>
                      </div>
                      <Badge variant={
                        m.status === "Completed" ? "default" :
                        m.status === "In Progress" ? "secondary" : "outline"
                      }>
                        {m.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                      <div>
                        <span className="text-gray-500">Start:</span> {formatDate(m.startDate)}
                      </div>
                      <div>
                        <span className="text-gray-500">End:</span> {formatDate(m.endDate)}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No milestones defined</p>
              )}
            </CardContent>
          </Card>

          {/* Academic Contributions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Academic Contributions</CardTitle>
              <CardDescription>Publications and achievements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {scholar.academicContributions?.length > 0 ? (
                scholar.academicContributions.map((c: any, i: number) => (
                  <div key={i} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between">
                      <h4 className="font-medium">{c.title}</h4>
                      <Badge variant="outline">{c.type}</Badge>
                    </div>
                    <p className="text-sm mt-1">{c.journalOrEvent}</p>
                    <p className="text-sm text-gray-500">{formatDate(c.date)}</p>
                    
                    {/* Extension and Delay Information */}
                    {(c.extensions?.count > 0 || c.delay > 0) && (
                      <div className="mt-2 pt-2 border-t">
                        <div className="flex items-center text-sm text-orange-600">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          <span>Extension Information</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-1 text-sm">
                          <div>
                            <span className="text-gray-500">Extensions:</span> {c.extensions?.count || 0}
                          </div>
                          <div>
                            <span className="text-gray-500">Delay:</span> {c.delay || 0} months
                          </div>
                        </div>
                        {c.extensions?.details && (
                          <div className="mt-1">
                            <p className="text-xs text-gray-500">
                              <span className="font-medium">Details:</span> {c.extensions.details}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {c.link && (
                      <a 
                        href={c.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline flex items-center mt-1"
                      >
                        <LinkIcon className="h-3 w-3 mr-1" /> View
                      </a>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No contributions recorded</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Supervisor Notes Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Supervisor Notes</CardTitle>
            <CardDescription>Private observations and comments</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 dark:text-gray-300">
              {scholar.supervisorNotes || "No notes available"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}