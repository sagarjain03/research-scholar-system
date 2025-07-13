"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { AddScholarForm } from "@/components/add-scholar-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface Milestone {
  name: string
  startDate?: Date
  endDate?: Date
  status: string
  notes: string
}

interface ScholarData {
  name: string
  email: string
  phone: string
  department: string
  supervisor: string
  researchArea: string
  startDate?: Date
  expectedCompletion?: Date
  description: string
  milestones: Milestone[]
}

export default function EditScholarPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [scholarData, setScholarData] = useState<ScholarData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchScholar = async () => {
      try {
        const res = await fetch(`/api/scholars/get-by-id?id=${params.id}`)
        const data = await res.json()
        if (data.success) {
          const formattedData = {
            ...data.scholar,
            startDate: data.scholar.startDate ? new Date(data.scholar.startDate) : undefined,
            expectedCompletion: data.scholar.expectedCompletion ? new Date(data.scholar.expectedCompletion) : undefined,
            milestones: data.scholar.milestones?.map((m: any) => ({
              ...m,
              startDate: m.startDate ? new Date(m.startDate) : undefined,
              endDate: m.endDate ? new Date(m.endDate) : undefined,
              status: m.status || "not-started"
            })) || []
          }
          setScholarData(formattedData)
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

  const handleSubmit = async (formData: any, milestones: Milestone[]) => {
    try {
      const payload = {
        email: scholarData?.email, // Using email as the unique identifier
        ...formData,
        milestones: milestones.map(m => ({
          ...m,
          startDate: m.startDate?.toISOString(),
          endDate: m.endDate?.toISOString()
        })),
        startDate: formData.startDate?.toISOString(),
        expectedCompletion: formData.expectedCompletion?.toISOString()
      }

      const res = await fetch('/api/scholars/update-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.error || "Failed to update scholar")
      }

      toast({
        title: "Success",
        description: "Scholar updated successfully!",
      })
      // router.push(`/admin/scholars/${params.id}`)
      
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update scholar",
        variant: "destructive",
      })
    }
  }

  if (loading) return <div className="p-8 text-center">Loading scholar data...</div>
  if (!scholarData) return <div className="p-8 text-center text-red-500">Scholar not found</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <Button variant="outline" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Profile
        </Button>

        <h1 className="text-3xl font-bold text-blue-800 dark:text-white">
          Edit Scholar Profile
        </h1>
        
        <AddScholarForm 
          initialData={scholarData}
          onSuccess={(data, milestones) => handleSubmit(data, milestones)}
          editMode={true}
        />
      </div>
    </div>
  )
}