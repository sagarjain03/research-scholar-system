"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, UserPlus, PlusCircle, Save } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface Milestone {
  name: string
  startDate?: Date
  endDate?: Date
  status: string
  notes: string
}

interface AddScholarFormProps {
  onSuccess?: (formData: any, milestones: Milestone[]) => void
  initialData?: {
    name: string
    email: string
    phone: string
    department: string
    supervisor: string
    researchArea: string
    startDate?: Date
    expectedCompletion?: Date
    description: string
    milestones?: Milestone[]
  }
  editMode?: boolean
}

export function AddScholarForm({ onSuccess, initialData, editMode = false }: AddScholarFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    department: initialData?.department || "",
    supervisor: initialData?.supervisor || "",
    researchArea: initialData?.researchArea || "",
    startDate: initialData?.startDate || undefined,
    expectedCompletion: initialData?.expectedCompletion || undefined,
    description: initialData?.description || "",
  })

  const [milestones, setMilestones] = useState<Milestone[]>(initialData?.milestones || [])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      if (editMode) {
        // In edit mode, we call the onSuccess callback with the form data
        onSuccess?.(formData, milestones)
      } else {
        // In add mode, we make the API call to create a new scholar
        const createdBy = localStorage.getItem("userEmail")
        const res = await fetch("/api/scholars/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, milestones, createdBy }),
        })

        const result = await res.json()

        if (result.success) {
          toast({
            title: "Scholar added successfully!",
            description: `${formData.name} has been added.`,
          })
          // Reset form only in add mode
          setFormData({ 
            name: "",
            email: "",
            phone: "",
            department: "",
            supervisor: "",
            researchArea: "",
            startDate: undefined,
            expectedCompletion: undefined,
            description: "",
          })
          setMilestones([])
          onSuccess?.(formData, milestones)
        } else {
          throw new Error(result.error || "Failed to add scholar.")
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    if (editMode) {
      // In edit mode, reset to initial data
      setFormData({
        name: initialData?.name || "",
        email: initialData?.email || "",
        phone: initialData?.phone || "",
        department: initialData?.department || "",
        supervisor: initialData?.supervisor || "",
        researchArea: initialData?.researchArea || "",
        startDate: initialData?.startDate || undefined,
        expectedCompletion: initialData?.expectedCompletion || undefined,
        description: initialData?.description || "",
      })
      setMilestones(initialData?.milestones || [])
    } else {
      // In add mode, reset to empty form
      setFormData({
        name: "",
        email: "",
        phone: "",
        department: "",
        supervisor: "",
        researchArea: "",
        startDate: undefined,
        expectedCompletion: undefined,
        description: "",
      })
      setMilestones([])
    }
  }

  return (
    <Card className="dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          {editMode ? (
            <Save className="h-5 w-5 text-blue-600" />
          ) : (
            <UserPlus className="h-5 w-5 text-blue-600" />
          )}
          <span>{editMode ? "Edit Scholar" : "Add New Scholar"}</span>
        </CardTitle>
        <CardDescription>
          {editMode ? "Update the details of this research scholar" : "Enter the details of the new research scholar"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter scholar's full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="dark:bg-gray-700 dark:border-gray-600"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="scholar@university.edu"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="dark:bg-gray-700 dark:border-gray-600"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department *</Label>
              <Select 
                value={formData.department}
                onValueChange={(value) => setFormData({ ...formData, department: value })}
              >
                <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="computer-science">Computer Science</SelectItem>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="mathematics">Mathematics</SelectItem>
                  <SelectItem value="physics">Physics</SelectItem>
                  <SelectItem value="chemistry">Chemistry</SelectItem>
                  <SelectItem value="biology">Biology</SelectItem>
                  <SelectItem value="psychology">Psychology</SelectItem>
                  <SelectItem value="economics">Economics</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="supervisor">Supervisor *</Label>
              <Select
                value={formData.supervisor}
                onValueChange={(value) => setFormData({ ...formData, supervisor: value })}
              >
                <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600">
                  <SelectValue placeholder="Select supervisor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dr-smith">Dr. Sarah Smith</SelectItem>
                  <SelectItem value="prof-johnson">Prof. Michael Johnson</SelectItem>
                  <SelectItem value="dr-williams">Dr. Emily Williams</SelectItem>
                  <SelectItem value="prof-brown">Prof. David Brown</SelectItem>
                  <SelectItem value="dr-davis">Dr. Lisa Davis</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="researchArea">Research Area *</Label>
              <Input
                id="researchArea"
                type="text"
                placeholder="e.g., Machine Learning, Quantum Computing"
                value={formData.researchArea}
                onChange={(e) => setFormData({ ...formData, researchArea: e.target.value })}
                required
                className="dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal dark:bg-gray-700 dark:border-gray-600",
                      !formData.startDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.startDate ? format(formData.startDate, "PPP") : "Select start date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.startDate}
                    onSelect={(date) => setFormData({ ...formData, startDate: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Expected Completion *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal dark:bg-gray-700 dark:border-gray-600",
                      !formData.expectedCompletion && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.expectedCompletion
                      ? format(formData.expectedCompletion, "PPP")
                      : "Select completion date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.expectedCompletion}
                    onSelect={(date) => setFormData({ ...formData, expectedCompletion: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Research Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of the research project..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="min-h-[100px] dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          {/* Milestones Section */}
          <div className="space-y-4 border-t border-gray-600 pt-6 mt-6">
            <h3 className="text-lg font-semibold text-blue-400">Milestones</h3>

            {milestones.map((milestone, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-md dark:border-gray-600 dark:bg-gray-700">
                <div className="space-y-2">
                  <Label>Milestone Name</Label>
                  <Input
                    value={milestone.name}
                    onChange={(e) => {
                      const updated = [...milestones]
                      updated[index].name = e.target.value
                      setMilestones(updated)
                    }}
                    className="dark:bg-gray-800 dark:border-gray-600"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={milestone.status}
                    onValueChange={(value) => {
                      const updated = [...milestones]
                      updated[index].status = value
                      setMilestones(updated)
                    }}
                  >
                    <SelectTrigger className="dark:bg-gray-800 dark:border-gray-600">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="not-started">Not Started</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="missed">Missed</SelectItem>
                      <SelectItem value="delayed">Delayed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal dark:bg-gray-800 dark:border-gray-600",
                          !milestone.startDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {milestone.startDate ? format(milestone.startDate, "PPP") : "Select start date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={milestone.startDate}
                        onSelect={(date) => {
                          const updated = [...milestones]
                          updated[index].startDate = date
                          setMilestones(updated)
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal dark:bg-gray-800 dark:border-gray-600",
                          !milestone.endDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {milestone.endDate ? format(milestone.endDate, "PPP") : "Select end date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={milestone.endDate}
                        onSelect={(date) => {
                          const updated = [...milestones]
                          updated[index].endDate = date
                          setMilestones(updated)
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label>Notes</Label>
                  <Textarea
                    value={milestone.notes}
                    onChange={(e) => {
                      const updated = [...milestones]
                      updated[index].notes = e.target.value
                      setMilestones(updated)
                    }}
                    placeholder="Optional notes or feedback..."
                    className="dark:bg-gray-800 dark:border-gray-600"
                  />
                </div>

                <div className="md:col-span-2 flex justify-end">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      const updated = [...milestones]
                      updated.splice(index, 1)
                      setMilestones(updated)
                    }}
                  >
                    Remove Milestone
                  </Button>
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="ghost"
              className="flex items-center space-x-2 text-blue-500 hover:text-blue-600"
              onClick={() =>
                setMilestones([
                  ...milestones,
                  { name: "", startDate: undefined, endDate: undefined, status: "not-started", notes: "" },
                ])
              }
            >
              <PlusCircle className="w-5 h-5" />
              <span>Add Milestone</span>
            </Button>
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={resetForm}
            >
              Reset
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading} 
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                editMode ? "Updating..." : "Adding..."
              ) : (
                editMode ? "Update Scholar" : "Add Scholar"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}