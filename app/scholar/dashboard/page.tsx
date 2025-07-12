// app/components/scholar-dashboard.tsx
"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BookOpen, LogOut, Clock, CheckCircle, AlertCircle, 
  MessageSquare, Bell, TrendingUp, Calendar as CalendarIcon, 
  User, ArrowUp, ArrowDown, HelpCircle
} from "lucide-react";
import Link from "next/link";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

// Register ChartJS components
ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler
);

type PredictionData = {
  result: string;
  confidence: number;
  parameters: Record<string, number>;
};

type Milestone = {
  name: string;
  status: string;
  notes?: string;
  startDate: string;
  endDate: string;
};

type ScholarData = {
  name: string;
  email: string;
  milestones: Milestone[];
  academicContributions?: {
    isPublished: boolean;
    extensions?: { count: number };
    delay?: number;
  }[];
  rating?: number;
};

export default function ScholarDashboard() {
  const [scholarData, setScholarData] = useState<ScholarData | null>(null);
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [predictionData, setPredictionData] = useState<PredictionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedMilestone, setEditedMilestone] = useState<Milestone | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      const email = localStorage.getItem("userEmail");
      if (!email) {
        toast({ title: "Error", description: "No email found. Please log in again.", variant: "destructive" });
        setLoading(false);
        return;
      }

      try {
        // Fetch scholar data
        const scholarRes = await fetch("/api/scholars/get", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        const scholarResult = await scholarRes.json();
        if (!scholarResult.success || !scholarResult.scholar) {
          throw new Error(scholarResult.error || "Scholar not found");
        }

        setScholarData(scholarResult.scholar);

        // Fetch prediction
        const predictionRes = await fetch("/api/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        const predictionResult = await predictionRes.json();
        if (predictionResult.success) {
          setPredictionData(predictionResult.prediction);
        } else {
          toast({
            title: "Prediction Unavailable",
            description: predictionResult.error || "Could not load prediction",
            variant: "destructive",
          });
        }

        // Mock attendance data (replace with your actual API call)
        setAttendanceData([
          { date: new Date(2023, 5, 1), status: "Present" },
          { date: new Date(2023, 5, 2), status: "Present" },
          { date: new Date(2023, 5, 5), status: "Absent" },
          { date: new Date(2023, 5, 6), status: "Leave" },
          { date: new Date(2023, 5, 12), status: "Present" },
          { date: new Date(2023, 5, 13), status: "Present" },
          { date: new Date(2023, 5, 19), status: "Present" },
          { date: new Date(2023, 5, 20), status: "Absent" },
          { date: new Date(2023, 5, 26), status: "Present" },
          { date: new Date(2023, 5, 27), status: "Leave" },
        ]);

      } catch (error: any) {
        console.error(error);
        toast({
          title: "Error",
          description: error.message || "Failed to fetch data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    toast({ title: "Logged out", description: "You have been logged out." });
  };

  const handleFeedbackSubmit = () => {
    toast({ title: "Feedback submitted!", description: "Your feedback has been sent." });
    setFeedback("");
  };

  const handleMilestoneEdit = (index: number) => {
    if (!scholarData?.milestones) return;
    setEditingIndex(index);
    setEditedMilestone({ ...scholarData.milestones[index] });
  };

  const handleMilestoneSave = async () => {
    if (editingIndex === null || !editedMilestone || !scholarData) return;
    
    const email = localStorage.getItem("userEmail");
    if (!email) return;

    try {
      const res = await fetch("/api/scholars/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          milestoneIndex: editingIndex,
          updatedMilestone: editedMilestone,
        }),
      });

      const result = await res.json();
      if (result.success) {
        setScholarData(result.scholar);
        toast({ title: "Success", description: "Milestone updated successfully." });
        setEditingIndex(null);
        setEditedMilestone(null);
      } else {
        toast({ title: "Error", description: result.error || "Update failed", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to update milestone", variant: "destructive" });
    }
  };

  function PredictionGraph() {
    if (!predictionData) {
      return (
        <div className="h-64 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <HelpCircle className="mx-auto h-8 w-8 text-gray-400" />
            <p className="mt-2">Generating prediction insights...</p>
          </div>
        </div>
      );
    }

    const parameters = Object.entries(predictionData.parameters)
      .sort(([, a], [, b]) => Math.abs(b as number) - Math.abs(a as number))
      .slice(0, 6);

    const chartData = {
      labels: parameters.map(([key]) => key.replace(/([A-Z])/g, ' $1').trim()),
      datasets: [
        {
          label: "Impact Score",
          data: parameters.map(([, value]) => value),
          backgroundColor: (context: any) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, 200);
            gradient.addColorStop(0, 'rgba(59, 130, 246, 0.2)');
            gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
            return gradient;
          },
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(59, 130, 246, 1)',
          pointRadius: 5,
          fill: true,
          tension: 0.4,
        },
      ],
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              const value = context.raw.toFixed(3);
              const impact = context.raw > 0 ? "Positive" : "Negative";
              return [`Impact Score: ${value}`, `Effect: ${impact}`];
            },
          },
          displayColors: false,
          backgroundColor: 'rgba(17, 24, 39, 0.9)',
          titleFont: { size: 14, weight: 'bold' },
          bodyFont: { size: 12 },
          padding: 12,
          cornerRadius: 8,
        },
      },
      scales: {
        y: {
          beginAtZero: false,
          title: { 
            display: true, 
            text: "Impact Score", 
            color: "#6b7280",
            font: { size: 12 }
          },
          grid: { 
            color: "rgba(229, 231, 235, 0.5)",
            drawTicks: false
          },
          ticks: { 
            color: "#6b7280",
            padding: 8
          },
        },
        x: {
          title: { 
            display: true, 
            text: "Key Factors", 
            color: "#6b7280",
            font: { size: 12 }
          },
          grid: { display: false },
          ticks: { 
            color: "#6b7280",
            padding: 8
          },
        },
      },
    };

    return (
      <div className="h-64">
        <Line data={chartData} options={options} />
      </div>
    );
  }

  function ImpactFactor({ name, value }: { name: string; value: number }) {
    const impactPercentage = Math.abs(Math.round(value * 100));
    const isPositive = value > 0;
    const impactDescription = getImpactDescription(name, value);

    return (
      <div className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white capitalize flex items-center">
              <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mr-2">
                {isPositive ? (
                  <ArrowUp className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                ) : (
                  <ArrowDown className="h-3 w-3 text-red-600 dark:text-red-400" />
                )}
              </span>
              {name.replace(/([A-Z])/g, ' $1').trim()}
            </h4>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              {impactDescription}
            </p>
          </div>
          <span className={`text-sm font-medium px-2 py-1 rounded-full ${isPositive ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
            {impactPercentage}% {isPositive ? 'increase' : 'decrease'}
          </span>
        </div>
      </div>
    );
  }

  function getImpactDescription(factor: string, value: number): string {
    const impactLevel = Math.abs(value);
    const isPositive = value > 0;

    const descriptions: Record<string, string[]> = {
      attendance: [
        "Frequent absences are significantly delaying your progress",
        "Your attendance could be improved to help progress",
        "Consistent attendance is supporting your timely completion"
      ],
      progress: [
        "Significant delays in milestones are concerning",
        "Some progress delays are noticeable",
        "Steady progress is keeping you on track"
      ],
      published: [
        "Lack of publications is affecting your standing",
        "Publications are at expected levels",
        "Strong publication record is helping your progress"
      ],
      extensions: [
        "Multiple deadline extensions are problematic",
        "Some extensions have minor impact",
        "No extensions shows good time management"
      ],
      delay: [
        "Significant delays in submissions are concerning",
        "Some delays are noticeable in your work",
        "Minimal delays show good schedule adherence"
      ],
      score: [
        "Low evaluation scores are a major concern",
        "Average scores provide limited impact",
        "High scores are significantly helping your progress"
      ]
    };

    const level = impactLevel > 0.15 ? 0 : impactLevel > 0.05 ? 1 : 2;
    return descriptions[factor][level];
  }

  // Updated AttendanceCalendar component
function AttendanceCalendar({ attendance }: { attendance: any[] }) {
  const getTileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') return '';
    
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const record = attendance.find(
      (a) => new Date(a.date).toDateString() === date.toDateString()
    );
    
    let className = "bg-white text-black"; // Default white background with black text
    
    if (isWeekend) {
      className = "text-red-500"; // Red text for weekends
    }
    
    if (record) {
      if (record.status === "Present") className = "bg-green-100 text-green-800 font-medium";
      if (record.status === "Absent") className = "bg-red-100 text-red-800 font-medium";
      if (record.status === "Leave") className = "bg-yellow-100 text-yellow-800 font-medium";
    }
    
    return className;
  };

  return (
    <Card className="shadow-lg border border-gray-100 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg text-gray-800 dark:text-white">Attendance Calendar</CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">Monthly summary</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg overflow-hidden">
          <Calendar
            tileClassName={getTileClassName}
            className="w-full border-0 bg-white text-gray-900 [&_.react-calendar__tile]:hover:bg-blue-100 [&_.react-calendar__tile]:hover:text-blue-800 [&_.react-calendar__tile]:transition-colors"
            calendarType="gregory"
            showNeighboringMonth={false}
          />
        </div>
        <div className="flex justify-center gap-3 mt-4 text-xs font-medium">
          <span className="flex items-center">
            <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span>
            Present
          </span>
          <span className="flex items-center">
            <span className="w-2 h-2 rounded-full bg-red-500 mr-1"></span>
            Absent
          </span>
          <span className="flex items-center">
            <span className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></span>
            Leave
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!scholarData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <h2 className="mt-4 text-xl font-bold text-gray-800 dark:text-white">
            Scholar Data Not Found
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            We couldn't load your scholar information. Please try again later or contact support.
          </p>
          <Button className="mt-6" onClick={() => window.location.reload()}>
            Refresh Page
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-700 shadow-sm backdrop-blur-md px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
            Scholar Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline text-sm text-gray-700 dark:text-gray-300">
            Welcome, {scholarData.name}
          </span>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-1" />
            Sign Out
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Prediction Card */}
          <Card className="border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-xl text-gray-800 dark:text-white flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    Progress Prediction
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    AI-powered analysis of your research progress
                  </CardDescription>
                </div>
                {predictionData ? (
                  <Badge
                    variant={
                      predictionData.result === "On Time" ? "default" :
                      predictionData.result === "At Risk" ? "secondary" :
                      "destructive"
                    }
                    className="px-3 py-1 text-sm h-8 flex items-center"
                  >
                    {predictionData.result}
                    <span className="ml-2 font-normal bg-white/20 px-2 py-0.5 rounded">
                      {predictionData.confidence}% confidence
                    </span>
                  </Badge>
                ) : (
                  <Badge variant="outline" className="px-3 py-1 h-8">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mr-2 animate-pulse"></div>
                      Analyzing
                    </div>
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg bg-gray-50 dark:bg-gray-800/50 p-4 border border-gray-100 dark:border-gray-700">
                <PredictionGraph />
              </div>

              {predictionData && (
                <div>
                  <h3 className="font-medium text-lg mb-4 text-gray-800 dark:text-white flex items-center">
                    Key Performance Factors
                    <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
                      (Ordered by impact)
                    </span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(predictionData.parameters)
                      .sort(([, a], [, b]) => Math.abs(b as number) - Math.abs(a as number))
                      .slice(0, 4)
                      .map(([key, value]) => (
                        <ImpactFactor 
                          key={key} 
                          name={key} 
                          value={value as number} 
                        />
                      ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Milestones Card */}
          <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl text-gray-800 dark:text-white flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Research Milestones
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Track and update your research timeline
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {scholarData.milestones?.length > 0 ? (
                  scholarData.milestones.map((milestone, index) => (
                    <div key={index} className="flex items-start gap-4 group">
                      <div className="flex flex-col items-center pt-1">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          milestone.status === "Completed" ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" :
                          milestone.status === "In Progress" ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" :
                          "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                        }`}>
                          {milestone.status === "Completed" ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : milestone.status === "In Progress" ? (
                            <Clock className="h-4 w-4" />
                          ) : (
                            <AlertCircle className="h-4 w-4" />
                          )}
                        </div>
                        {index < scholarData.milestones.length - 1 && (
                          <div className="w-0.5 h-10 bg-gray-200 dark:bg-gray-700 mt-2"></div>
                        )}
                      </div>

                      <div className="flex-1">
                        {editingIndex === index ? (
                          <div className="space-y-3">
                            <Input
                              value={editedMilestone?.name || ""}
                              onChange={(e) => setEditedMilestone({...editedMilestone!, name: e.target.value})}
                              placeholder="Milestone name"
                            />
                            <div className="grid grid-cols-2 gap-3">
                              <Input
                                type="date"
                                value={editedMilestone?.startDate?.substring(0, 10) || ""}
                                onChange={(e) => setEditedMilestone({...editedMilestone!, startDate: e.target.value})}
                              />
                              <Input
                                type="date"
                                value={editedMilestone?.endDate?.substring(0, 10) || ""}
                                onChange={(e) => setEditedMilestone({...editedMilestone!, endDate: e.target.value})}
                              />
                            </div>
                            <Select
                              value={editedMilestone?.status || ""}
                              onValueChange={(value) => setEditedMilestone({...editedMilestone!, status: value})}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Not Started">Not Started</SelectItem>
                                <SelectItem value="In Progress">In Progress</SelectItem>
                                <SelectItem value="Completed">Completed</SelectItem>
                                <SelectItem value="Missed">Missed</SelectItem>
                                <SelectItem value="Delayed">Delayed</SelectItem>
                              </SelectContent>
                            </Select>
                            <div className="flex gap-2 pt-2">
                              <Button size="sm" onClick={handleMilestoneSave}>
                                Save Changes
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingIndex(null)}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="border border-transparent group-hover:border-gray-200 dark:group-hover:border-gray-700 rounded-lg p-3 transition-colors">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium text-gray-900 dark:text-white">
                                  {milestone.name}
                                </h3>
                                {milestone.notes && (
                                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    {milestone.notes}
                                  </p>
                                )}
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
                                onClick={() => handleMilestoneEdit(index)}
                              >
                                Edit
                              </Button>
                            </div>

                            <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-xs text-gray-500">Start Date</p>
                                <p className="text-gray-700 dark:text-gray-300">
                                  {new Date(milestone.startDate).toLocaleDateString()}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">End Date</p>
                                <p className="text-gray-700 dark:text-gray-300">
                                  {new Date(milestone.endDate).toLocaleDateString()}
                                </p>
                              </div>
                            </div>

                            {milestone.status === "In Progress" && (
                              <div className="mt-4">
                                <div className="flex justify-between text-xs text-gray-500 mb-1">
                                  <span>Progress</span>
                                  <span>50%</span>
                                </div>
                                <Progress value={50} className="h-2" />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No milestones have been added yet.</p>
                    <Button className="mt-4" size="sm">
                      Add First Milestone
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Feedback Card */}
          <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl text-gray-800 dark:text-white flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Submit Feedback
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Share your experience with the program
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="feedback">Your Feedback</Label>
                  <Textarea
                    id="feedback"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="mt-1 min-h-[120px]"
                    placeholder="What's working well? What could be improved?"
                  />
                </div>
                <Button 
                  onClick={handleFeedbackSubmit}
                  disabled={!feedback.trim()}
                  className="w-full sm:w-auto"
                >
                  Submit Feedback
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Notifications Card */}
          <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl text-gray-800 dark:text-white flex items-center gap-2">
                <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Upcoming Deadlines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-900/30">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-blue-800 dark:text-blue-200">
                        Paper Submission
                      </h4>
                      <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                        Due in 3 days
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-100 dark:border-yellow-900/30">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-yellow-800 dark:text-yellow-200">
                        Progress Report
                      </h4>
                      <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
                        Due in 1 week
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-gray-200">
                        Supervisor Meeting
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Scheduled for tomorrow
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Attendance Calendar */}
          <AttendanceCalendar attendance={attendanceData} />

          {/* Profile Card */}
          <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl text-gray-800 dark:text-white flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                My Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Link href="/scholar/profile">
                <Button variant="outline" className="w-full justify-start">
                  <User className="h-4 w-4 mr-2" />
                  View Profile
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}