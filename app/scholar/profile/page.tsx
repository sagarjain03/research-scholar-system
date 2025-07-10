"use client"

import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  BookOpen, Award, Users, Link as LinkIcon, Calendar as CalendarIcon,
  CheckCircle, FileText, Star, Clock
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

type AcademicContribution = {
  title: string;
  type: string;
  date: string;
  description: string;
  journalOrEvent: string;
  impactFactor?: number;
  link?: string;
  isPublished?: boolean;
};

type AttendanceRecord = {
  scholarEmail: string;
  status: "Present" | "Absent" | "Leave";
  date: string;
};

export default function ScholarProfile() {
  const [profile, setProfile] = useState<any>(null);
  const [contributions, setContributions] = useState<AcademicContribution[]>([]);
  const [attendancePercentage, setAttendancePercentage] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfileAndAttendance = async () => {
      const email = localStorage.getItem("userEmail");
      if (!email) return;

      try {
        // Fetch profile data
        const profileRes = await fetch(`/api/scholars/profile?email=${email}`);
        const profileData = await profileRes.json();
        
        // Fetch attendance data
        const attendanceRes = await fetch('/api/attendance/get', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ scholarEmail: email })
        });
        const attendanceData = await attendanceRes.json();

        if (profileData.success) {
          setProfile(profileData.profile);
          setContributions(profileData.profile.academicContributions || []);
        }

        if (attendanceData.success) {
          // Calculate attendance percentage exactly like in admin reports
          const records: AttendanceRecord[] = attendanceData.attendance;
          if (records.length > 0) {
            const present = records.filter(r => r.status === "Present").length;
            const total = records.length;
            const percent = Math.round((present / total) * 100);
            setAttendancePercentage(percent);
          }
        }
      } catch (error) {
        toast({ title: "Error", description: "Failed to load data", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndAttendance();
  }, [toast]);

  const handleAddContribution = () => {
    setContributions([...contributions, {
      title: "",
      type: "Publication",
      date: new Date().toISOString().split('T')[0],
      description: "",
      journalOrEvent: "",
      isPublished: false
    }]);
  };

  const handleContributionChange = (index: number, field: string, value: any) => {
    const updated = [...contributions];
    updated[index] = { ...updated[index], [field]: value };
    setContributions(updated);
  };

  const handleRemoveContribution = (index: number) => {
    const updated = contributions.filter((_, i) => i !== index);
    setContributions(updated);
  };

  const handleSave = async () => {
    const email = localStorage.getItem("userEmail");
    if (!email) return;

    try {
      const res = await fetch('/api/scholars/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, academicContributions: contributions })
      });

      const data = await res.json();
      if (data.success) {
        toast({ title: "Success", description: "Profile updated successfully" });
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to update profile", variant: "destructive" });
    }
  };

  if (loading) return <div className="p-8 text-center">Loading profile...</div>;
  if (!profile) return <div className="p-8 text-center text-red-500">Profile not found</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Profile Header */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-gray-800 dark:to-gray-700">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-blue-800 dark:text-white">
              {profile.name}'s Academic Profile
            </CardTitle>
            <CardDescription className="text-blue-600 dark:text-blue-300">
              {profile.department} • {profile.researchArea}
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Admin Data - Read Only */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border border-blue-200">
            <CardHeader className="flex flex-row items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Attendance</CardTitle>
                <CardDescription>Overall attendance record</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Progress value={attendancePercentage || 0} className="h-2 w-24" />
                <span className="text-2xl font-bold">
                  {attendancePercentage !== null ? `${attendancePercentage}%` : 'N/A'}
                </span>
              </div>
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
              <div className="text-3xl font-bold">{profile.rating || 'N/A'}/10</div>
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
              <p className="text-sm">{profile.feedback || 'No feedback yet'}</p>
            </CardContent>
          </Card>

          <Card className="border border-orange-200">
            <CardHeader className="flex flex-row items-center space-x-4">
              <div className="p-3 bg-orange-100 rounded-full">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Current Phase</CardTitle>
                <CardDescription>Research stage</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{profile.researchArea}</div>
            </CardContent>
          </Card>
        </div>

        {/* Academic Contributions - Editable */}
        <Card className="shadow-xl">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl">Academic Contributions</CardTitle>
                <CardDescription>Manage your research outputs and achievements</CardDescription>
              </div>
              <Button onClick={handleAddContribution} variant="outline">
                Add Contribution
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {contributions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No contributions added yet
              </div>
            ) : (
              contributions.map((contribution, index) => (
                <div key={index} className="border rounded-lg p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Title</Label>
                      <Input
                        value={contribution.title}
                        onChange={(e) => handleContributionChange(index, 'title', e.target.value)}
                        placeholder="Research paper title"
                      />
                    </div>
                    <div>
                      <Label>Type</Label>
                      <select
                        value={contribution.type}
                        onChange={(e) => handleContributionChange(index, 'type', e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="Publication">Publication</option>
                        <option value="Conference">Conference</option>
                        <option value="Award">Award</option>
                        <option value="Collaboration">Collaboration</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Date</Label>
                      <Input
                        type="date"
                        value={contribution.date.split('T')[0]}
                        onChange={(e) => handleContributionChange(index, 'date', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Journal/Event</Label>
                      <Input
                        value={contribution.journalOrEvent}
                        onChange={(e) => handleContributionChange(index, 'journalOrEvent', e.target.value)}
                        placeholder="Journal or event name"
                      />
                    </div>
                    <div>
                      <Label>Impact Factor</Label>
                      <Input
                        type="number"
                        value={contribution.impactFactor || ''}
                        onChange={(e) => handleContributionChange(index, 'impactFactor', parseFloat(e.target.value))}
                        placeholder="Optional"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={contribution.description}
                      onChange={(e) => handleContributionChange(index, 'description', e.target.value)}
                      placeholder="Brief description of the contribution"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Link</Label>
                      <Input
                        value={contribution.link || ''}
                        onChange={(e) => handleContributionChange(index, 'link', e.target.value)}
                        placeholder="URL to publication or event"
                      />
                    </div>
                    <div className="flex items-center space-x-4 pt-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={contribution.isPublished || false}
                          onChange={(e) => handleContributionChange(index, 'isPublished', e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span>Published</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveContribution(index)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave} size="lg" className="bg-blue-600 hover:bg-blue-700">
            Save All Changes
          </Button>
        </div>
      </div>
    </div>
  );
}