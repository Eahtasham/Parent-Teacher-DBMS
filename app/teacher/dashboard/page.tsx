'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { LogOut, Clock, User, BookOpen, Calendar, MessageCircle } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface Meeting {
  id: number;
  student_name: string;
  subject: string;
  meeting_date: string;
  meeting_time: string;
  reason: string;
  status: 'pending' | 'accept' | 'rejected';
  parent_name: string;
  message?: string;
}

const MeetingCard = ({ meeting, onAction }: { meeting: Meeting; onAction?: (id: number, action: 'accept' | 'reject') => void }) => (
  <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
    <CardContent className="p-4">
      <div className="flex flex-col space-y-3">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg text-indigo-900">
            Meeting with {meeting.student_name}
          </h3>
          <span className={cn(
            "px-3 py-1 rounded-full text-sm font-medium",
            {
              "bg-green-300 text-green-800": meeting.status === 'accept',
              "bg-red-300 text-red-800": meeting.status === 'rejected',
              "bg-yellow-300 text-yellow-800": meeting.status === 'pending'
            }
          )}>
            {meeting.status === 'accept' ? "Accepted" : 
             meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
          <div className="flex items-center">
            <User className="h-4 w-4 mr-2" />
            <span>{meeting.parent_name}</span>
          </div>
          <div className="flex items-center">
            <BookOpen className="h-4 w-4 mr-2" />
            <span>{meeting.subject}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{format(new Date(meeting.meeting_date), 'PP')}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            <span>{meeting.meeting_time}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <MessageCircle className="h-4 w-4 text-gray-500" />
          <p className="text-sm text-gray-600">{meeting.reason}</p>
        </div>

        {meeting.status === 'rejected' && meeting.message && (
          <p className="text-red-600 text-sm bg-red-50 p-2 rounded">
            {meeting.message}
          </p>
        )}

        {meeting.status === 'pending' && onAction && (
          <div className="flex gap-3 mt-2">
            <Button
              onClick={() => onAction(meeting.id, 'accept')}
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
            >
              Accept
            </Button>
            <Button
              onClick={() => onAction(meeting.id, 'reject')}
              variant="destructive"
              className="flex-1"
            >
              Reject
            </Button>
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);

export default function TeacherDashboard() {
  const { user, loading, logout } = useAuth();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [rejectionDialog, setRejectionDialog] = useState({
    isOpen: false,
    meetingId: 0,
    reason: ''
  });

  useEffect(() => {
    const fetchMeetings = async () => {
      if (!user?.id) return;

      try {
        const response = await fetch(`/api/meetings?teacherId=${user.id}`);
        const data = await response.json();
        if (data.success) {
          setMeetings(data.meetings);
        }
      } catch (error) {
        console.error('Error fetching meetings:', error);
      }
    };

    fetchMeetings();
  }, [user?.id]);

  const handleAction = async (meetingId: number, action: 'accept' | 'reject') => {
    if (action === 'reject') {
      setRejectionDialog({
        isOpen: true,
        meetingId,
        reason: ''
      });
      return;
    }

    try {
      const response = await fetch('/api/meetings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          meetingId,
          status: action,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success(`Meeting ${action}ed successfully`);
        setMeetings(meetings.map(m => 
          m.id === meetingId ? { ...m, status: action } : m
        ));
      }
    } catch (error) {
      console.error(`Error ${action}ing meeting:`, error);
      toast.error(`Failed to ${action} meeting`);
    }
  };

  const handleReject = async () => {
    try {
      const response = await fetch('/api/meetings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          meetingId: rejectionDialog.meetingId,
          status: 'rejected',
          message: rejectionDialog.reason,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Meeting rejected successfully');
        setMeetings(meetings.map(m => 
          m.id === rejectionDialog.meetingId ? { 
            ...m, 
            status: 'rejected',
            message: rejectionDialog.reason 
          } : m
        ));
        setRejectionDialog({ isOpen: false, meetingId: 0, reason: '' });
      }
    } catch (error) {
      console.error('Error rejecting meeting:', error);
      toast.error('Failed to reject meeting');
    }
  };


  const pendingMeetings = meetings.filter(m => m.status === 'pending');
  const acceptedMeetings = meetings.filter(m => m.status === 'accept');
  const rejectedMeetings = meetings.filter(m => m.status === 'rejected');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-4 md:p-8">
      {/* Header */}
      <header className="max-w-7xl mx-auto bg-white/80 backdrop-blur-sm shadow-sm mb-5 rounded-lg">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-indigo-600 text-white">
                  {user?.username?.charAt(0).toUpperCase() || 'T'}
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
        {/* Pending Meetings Section */}
        <div className="w-full lg:w-3/5">
          <Card className="bg-white/90 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-indigo-900">Pending Requests</CardTitle>
              <CardDescription className="flex justify-between items-center">
                Review and manage incoming meeting requests
                <Badge variant="secondary" className="ml-2">
                  {pendingMeetings.length} Pending
                </Badge>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingMeetings.map((meeting) => (
                  <MeetingCard 
                    key={meeting.id} 
                    meeting={meeting} 
                    onAction={handleAction}
                  />
                ))}
                {pendingMeetings.length === 0 && (
                  <div className="text-center py-6 text-gray-500">
                    No pending meeting requests
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Completed Meetings Section */}
        <div className="w-full lg:w-2/5 space-y-6">
          {/* Accepted Meetings */}
          <Card className="bg-white/90 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-indigo-900">Accepted Meetings</CardTitle>
              <CardDescription className="flex justify-between items-center">
                Confirmed appointments
                <Badge variant="secondary" className="ml-2">
                  {acceptedMeetings.length} Accepted
                </Badge>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {acceptedMeetings.map((meeting) => (
                  <MeetingCard 
                    key={meeting.id} 
                    meeting={meeting}
                  />
                ))}
                {acceptedMeetings.length === 0 && (
                  <div className="text-center py-6 text-gray-500">
                    No accepted meetings
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Rejected Meetings */}
          <Card className="bg-white/90 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-indigo-900">Rejected Meetings</CardTitle>
              <CardDescription className="flex justify-between items-center">
                Declined appointments
                <Badge variant="secondary" className="ml-2">
                  {rejectedMeetings.length} Rejected
                </Badge>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rejectedMeetings.map((meeting) => (
                  <MeetingCard 
                    key={meeting.id} 
                    meeting={meeting}
                  />
                ))}
                {rejectedMeetings.length === 0 && (
                  <div className="text-center py-6 text-gray-500">
                    No rejected meetings
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Dialog
        open={rejectionDialog.isOpen}
        onOpenChange={(open) => !open && setRejectionDialog({ isOpen: false, meetingId: 0, reason: '' })}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Reject Meeting Request</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Textarea
              placeholder="Please provide a reason for rejection..."
              value={rejectionDialog.reason}
              onChange={(e) => setRejectionDialog({ ...rejectionDialog, reason: e.target.value })}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRejectionDialog({ isOpen: false, meetingId: 0, reason: '' })}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={!rejectionDialog.reason.trim()}
            >
              Reject Meeting
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}