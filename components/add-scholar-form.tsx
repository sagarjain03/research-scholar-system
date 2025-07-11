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
import { CalendarIcon, UserPlus, PlusCircle, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"

interface AddScholarFormProps {
  onSuccess?: () => void
}

interface Milestone {
  name: string
  startDate?: Date
  endDate?: Date
  status: string
  notes: string
}

export function AddScholarForm({ onSuccess }: AddScholarFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    supervisor: "",
    researchArea: "",
    startDate: undefined as Date | undefined,
    expectedCompletion: undefined as Date | undefined,
    description: "",
  })

  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
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
          description: `${formData.name} has been added to the system.`,
          className: "bg-green-600 text-white border-0"
        })

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
        onSuccess?.()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to add scholar.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const removeMilestone = (index: number) => {
    setMilestones(milestones.filter((_, i) => i !== index))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="dark:bg-gray-900/80 backdrop-blur-sm border border-gray-800 shadow-xl">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-full bg-blue-500/10">
              <UserPlus className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-blue-400">Add New Scholar</CardTitle>
              <CardDescription className="text-gray-400">
                Register a new research scholar to the system
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-blue-400 border-b border-gray-800 pb-2">
                Basic Information
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="name" className="text-gray-300 flex items-center">
                    Full Name <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="dark:bg-gray-800/50 dark:border-gray-700 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="email" className="text-gray-300 flex items-center">
                    Email <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john.doe@university.edu"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="dark:bg-gray-800/50 dark:border-gray-700 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="phone" className="text-gray-300">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="dark:bg-gray-800/50 dark:border-gray-700 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="department" className="text-gray-300 flex items-center">
                    Department <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Select 
                    onValueChange={(value) => setFormData({ ...formData, department: value })}
                    required
                  >
                    <SelectTrigger className="dark:bg-gray-800/50 dark:border-gray-700 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-900 border-gray-800 shadow-lg">
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
            </div>

            {/* Research Information Section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-blue-400 border-b border-gray-800 pb-2">
                Research Information
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="supervisor" className="text-gray-300 flex items-center">
                    Supervisor <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Select 
                    onValueChange={(value) => setFormData({ ...formData, supervisor: value })}
                    required
                  >
                    <SelectTrigger className="dark:bg-gray-800/50 dark:border-gray-700 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all">
                      <SelectValue placeholder="Select supervisor" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-900 border-gray-800 shadow-lg">
                      <SelectItem value="dr-smith">Dr. Sarah Smith</SelectItem>
                      <SelectItem value="prof-johnson">Prof. Michael Johnson</SelectItem>
                      <SelectItem value="dr-williams">Dr. Emily Williams</SelectItem>
                      <SelectItem value="prof-brown">Prof. David Brown</SelectItem>
                      <SelectItem value="dr-davis">Dr. Lisa Davis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="researchArea" className="text-gray-300 flex items-center">
                    Research Area <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Input
                    id="researchArea"
                    type="text"
                    placeholder="Machine Learning, Quantum Computing, etc."
                    value={formData.researchArea}
                    onChange={(e) => setFormData({ ...formData, researchArea: e.target.value })}
                    required
                    className="dark:bg-gray-800/50 dark:border-gray-700 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-gray-300 flex items-center">
                    Start Date <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal dark:bg-gray-800/50 dark:border-gray-700 hover:bg-gray-800/70 transition-all",
                          !formData.startDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 text-blue-400" />
                        {formData.startDate ? format(formData.startDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 border-gray-800 shadow-xl" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.startDate}
                        onSelect={(date) => setFormData({ ...formData, startDate: date })}
                        initialFocus
                        className="dark:bg-gray-900"
                        fromDate={new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-3">
                  <Label className="text-gray-300 flex items-center">
                    Expected Completion <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal dark:bg-gray-800/50 dark:border-gray-700 hover:bg-gray-800/70 transition-all",
                          !formData.expectedCompletion && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 text-blue-400" />
                        {formData.expectedCompletion
                          ? format(formData.expectedCompletion, "PPP")
                          : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 border-gray-800 shadow-xl" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.expectedCompletion}
                        onSelect={(date) => setFormData({ ...formData, expectedCompletion: date })}
                        initialFocus
                        className="dark:bg-gray-900"
                        fromDate={formData.startDate || new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="md:col-span-2 space-y-3">
                  <Label htmlFor="description" className="text-gray-300">Research Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the research focus, objectives, and methodology..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="min-h-[120px] dark:bg-gray-800/50 dark:border-gray-700 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Milestones Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                <h3 className="text-lg font-semibold text-blue-400">Research Milestones</h3>
                <Button
                  type="button"
                  variant="ghost"
                  className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 transition-all"
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

              {milestones.length === 0 && (
                <div className="text-center py-8 text-gray-500 border border-dashed border-gray-800 rounded-lg">
                  No milestones added yet
                </div>
              )}

              <div className="space-y-4">
                {milestones.map((milestone, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="relative grid grid-cols-1 md:grid-cols-2 gap-4 p-5 rounded-lg border border-gray-800 dark:bg-gray-800/30"
                  >
                    <button
                      type="button"
                      onClick={() => removeMilestone(index)}
                      className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-700/50 text-gray-400 hover:text-red-400 transition-colors"
                      title="Remove milestone"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                    <div className="space-y-2">
                      <Label className="text-gray-300">Milestone Name</Label>
                      <Input
                        value={milestone.name}
                        onChange={(e) => {
                          const updated = [...milestones]
                          updated[index].name = e.target.value
                          setMilestones(updated)
                        }}
                        placeholder="Thesis Proposal, Data Collection, etc."
                        className="dark:bg-gray-800/70 dark:border-gray-700 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-300">Status</Label>
                      <Select
                        value={milestone.status}
                        onValueChange={(value) => {
                          const updated = [...milestones]
                          updated[index].status = value
                          setMilestones(updated)
                        }}
                      >
                        <SelectTrigger className="dark:bg-gray-800/70 dark:border-gray-700 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-gray-900 border-gray-800 shadow-lg">
                          <SelectItem value="not-started">Not Started</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="missed">Missed</SelectItem>
                          <SelectItem value="delayed">Delayed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-300">Start Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal dark:bg-gray-800/70 dark:border-gray-700 hover:bg-gray-800/90 transition-all",
                              !milestone.startDate && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4 text-blue-400" />
                            {milestone.startDate ? format(milestone.startDate, "PPP") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 border-gray-800 shadow-xl" align="start">
                          <Calendar
                            mode="single"
                            selected={milestone.startDate}
                            onSelect={(date) => {
                              const updated = [...milestones]
                              updated[index].startDate = date
                              setMilestones(updated)
                            }}
                            className="dark:bg-gray-900"
                            fromDate={formData.startDate || new Date()}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-300">End Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal dark:bg-gray-800/70 dark:border-gray-700 hover:bg-gray-800/90 transition-all",
                              !milestone.endDate && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4 text-blue-400" />
                            {milestone.endDate ? format(milestone.endDate, "PPP") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 border-gray-800 shadow-xl" align="start">
                          <Calendar
                            mode="single"
                            selected={milestone.endDate}
                            onSelect={(date) => {
                              const updated = [...milestones]
                              updated[index].endDate = date
                              setMilestones(updated)
                            }}
                            className="dark:bg-gray-900"
                            fromDate={milestone.startDate || formData.startDate || new Date()}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <Label className="text-gray-300">Notes</Label>
                      <Textarea
                        value={milestone.notes}
                        onChange={(e) => {
                          const updated = [...milestones]
                          updated[index].notes = e.target.value
                          setMilestones(updated)
                        }}
                        placeholder="Additional details or comments..."
                        className="dark:bg-gray-800/70 dark:border-gray-700 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-800">
              <Button
                type="button"
                variant="outline"
                className="border-gray-700 text-gray-300 hover:text-gray-100 hover:bg-gray-800/50 transition-colors"
                onClick={() => {
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
                }}
              >
                Clear Form
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading} 
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md hover:shadow-blue-500/20 transition-all"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : "Register Scholar"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}