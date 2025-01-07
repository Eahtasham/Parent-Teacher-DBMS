'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Book, Calendar as CalendarIcon, CheckCircle2, ChevronRight, Clock, LogOut, MessageSquare, User } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface Teacher {
  id: number;
  username: string;
  subject: string;
}

interface Student {
  id: number;
  roll_number: string;
  name: string;
  class:string;
  parent_id:number;
}

interface Meeting {
  id: number;
  subject: string;
  meeting_date: string;
  meeting_time: string;
  status: string;
  message?: string;
  teacher_name: string;
}

const subjects = [
  'Mathematics',
  'Science',
  'English',
  'History',
  'Geography',
  'Computer Science',
];


export default function ParentDashboard() {
  const { user, loading,logout } = useAuth();
  const [date, setDate] = useState<Date>();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [formData, setFormData] = useState({
    subject: '',
    teacher_id: '',
    reason: '',
    meeting_time: '',
    student_id:'',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetch('/api/teachers');
        const data = await response.json();
        if (data.success) {
          setTeachers(data.teachers);
        }
      } catch (error) {
        console.error('Error fetching teachers:', error);
      }
    };

    fetchTeachers();
  }, []);


  useEffect(() => {
    const fetchStudents = async () => {
      if (!user?.id) return;
  
      try {
        const response = await fetch(`/api/students?parentId=${user.id}`);
        const data = await response.json();
        if (data.success) {
          setStudents(data.students);
        } else {
          toast.error(data.message || 'Failed to fetch students');
        }
      } catch (error) {
        console.error('Error fetching students:', error);
        toast.error('Failed to fetch students');
      }
    };
  
    fetchStudents();
  }, [user?.id]);
  


  useEffect(() => {
    const fetchMeetings = async () => {
      if (!user?.id) return;

      try {
        const response = await fetch(`/api/meetings?parentId=${user.id}`);
        const data = await response.json();
        if (data.success) {
          setMeetings(data.meetings);
        }
      } catch (error) {
        console.error('Error fetching meetings:', error);
      }
    };

    const interval = setInterval(() => {
      const pendingMeetings = meetings.some(m => m.status === 'pending');
      if (pendingMeetings) {
        fetchMeetings();
      }
    }, 30000);

    fetchMeetings();
    return () => clearInterval(interval);
  }, [user?.id, meetings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !date) return;

    // console.log('Form Data:', formData);

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/meetings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          parent_id: user.id,
          meeting_date: format(date, 'yyyy-MM-dd'),
        }),
      });
      
      const data = await response.json();

      // console.log(data);
      if (data.success) {
        toast.success('Meeting request submitted successfully');
        setMeetings([...meetings, data.meeting]);
        // Reset form
        setIsSubmitting(false);
        setShowSuccessDialog(true);
        setFormData({ subject: '', teacher_id: '', reason: '', meeting_time: '', student_id:'' });
        setDate(undefined);
      } else {
        toast.error(data.message || 'Failed to submit meeting request');
      }
    } catch (error) {
      console.error('Error submitting meeting request:', error);
      toast.error('Failed to submit meeting request');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-4 md:p-8">
      <header className="max-w-7xl mx-auto bg-white/80 backdrop-blur-sm shadow-sm mb-5">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-indigo-600 text-white">
                  {user?.username?.charAt(0).toUpperCase() || 'P'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold text-gray-800">{user?.username}</h2>
                <p className="text-sm text-gray-500">Teacher</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="flex items-center space-x-2"
              onClick={() => logout?.()}
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </header>


      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
        {/* Schedule Meeting Section */}
        <div className="w-full lg:w-3/5">
          <Card className="bg-white/90 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-indigo-900">Schedule a Meeting</CardTitle>
              <CardDescription>Book an appointment with your child's teacher</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-sm font-medium">
                      <Book className="w-4 h-4 inline-block mr-2" />
                      Subject
                    </Label>
                    <Select onValueChange={(value) => setFormData({ ...formData, subject: value })}>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map(subject => (
                          <SelectItem key={subject} value={subject}>
                            {subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="student" className="text-sm font-medium">
                      <User className="w-4 h-4 inline-block mr-2" />
                      Student
                    </Label>
                    <Select onValueChange={(value) => setFormData({ ...formData, student_id: value })}>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select a student" />
                      </SelectTrigger>
                      <SelectContent>
                        {students.map(student => (
                          <SelectItem key={student.id} value={String(student.id)}>
                            {student.name} - Class {student.class}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    <User className="w-4 h-4 inline-block mr-2" />
                    Teacher
                  </Label>
                  <Select onValueChange={(value) => setFormData({ ...formData, teacher_id: value })}>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select a teacher" />
                    </SelectTrigger>
                    <SelectContent>
                      {teachers.map(teacher => (
                        <SelectItem key={teacher.id} value={String(teacher.id)}>
                          {teacher.username} - {teacher.subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      <CalendarIcon className="w-4 h-4 inline-block mr-2" />
                      Preferred Date
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal bg-white">
                          {date ? format(date, 'PPP') : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                          className="rounded-md border"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time" className="text-sm font-medium">
                      <Clock className="w-4 h-4 inline-block mr-2" />
                      Preferred Time
                    </Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.meeting_time}
                      onChange={(e) => setFormData({ ...formData, meeting_time: e.target.value })}
                      className="bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason" className="text-sm font-medium">
                    <MessageSquare className="w-4 h-4 inline-block mr-2" />
                    Reason for Meeting
                  </Label>
                  <Textarea
                    id="reason"
                    placeholder="Please describe the reason for requesting this meeting..."
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    className="h-32 bg-white"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg transition-all duration-200 hover:shadow-xl"
                >
                  {isSubmitting ? 'Submitting...' : 'Schedule Meeting'}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Meeting Requests Section */}
        <div className="w-full lg:w-2/5">
          <Card className="bg-white/90 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-indigo-900">Meeting Requests</CardTitle>
              <CardDescription>Track your meeting request status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {meetings.map(meeting => (
                  <Card key={meeting.id} className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <CardContent className="p-4">
                      <div className="flex flex-col space-y-3">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-lg text-indigo-900">{meeting.subject}</h3>
                          <span className={cn(
                            "px-3 py-1 rounded-full text-sm font-medium",
                            {
                              "bg-green-300 text-green-800": meeting.status === 'accept',
                              "bg-red-300 text-red-800": meeting.status === 'rejected',
                              "bg-yellow-300 text-yellow-800": meeting.status === 'pending'
                            }
                          )}>
                            {meeting.status=== 'accept'? 'Accepted' : meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-2" />
                            {meeting.teacher_name}
                          </div>
                          <div className="flex items-center">
                            <CalendarIcon className="w-4 h-4 mr-2" />
                            {format(new Date(meeting.meeting_date), 'PP')}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            {meeting.meeting_time}
                          </div>
                        </div>
                        {meeting.status === 'rejected' && meeting.message && (
                          <p className="text-red-600 text-sm bg-red-50 p-2 rounded">
                            {meeting.message}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {meetings.length === 0 && (
                  <div className="text-center py-6 text-gray-500">
                    No meeting requests yet
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="w-6 h-6" />
              Meeting Scheduled Successfully
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <p className="text-gray-600">
                Your meeting request has been successfully submitted. The teacher will be notified and will respond to your request shortly.
              </p>
              <div className="bg-green-50 p-4 rounded-lg space-y-2">
                <div className="flex items-center gap-2 text-green-800">
                  <CalendarIcon className="w-4 h-4" />
                  <span>Meeting Details Sumbitted</span>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                You can track the status of your meeting request in the dashboard. You'll receive a notification once the teacher responds.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button 
              onClick={() => setShowSuccessDialog(false)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Got it, thanks!
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
