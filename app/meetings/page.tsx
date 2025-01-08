'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';

interface Meeting {
  id: number;
  meeting_date: string;
  meeting_time: string;
  subject: string;
  parent_name: string;
  teacher_name: string;
  student_name: string;
}

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const response = await fetch('/api/meetings/public');
        const data = await response.json();
        if (data.success) {
          setMeetings(data.meetings);
        }
      } catch (error) {
        console.error('Error fetching meetings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-8">
        <div className="max-w-6xl mx-auto">
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              Loading meetings...
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-8">
      <div className="max-w-6xl mx-auto">
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Scheduled Meetings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Parent</TableHead>
                    <TableHead>Teacher</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Subject</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {meetings.map((meeting) => (
                    <TableRow key={meeting.id}>
                      <TableCell>
                        {format(new Date(meeting.meeting_date), 'PPP')}
                      </TableCell>
                      <TableCell>{meeting.meeting_time}</TableCell>
                      <TableCell>{meeting.parent_name}</TableCell>
                      <TableCell>{meeting.teacher_name}</TableCell>
                      <TableCell>{meeting.student_name}</TableCell>
                      <TableCell>{meeting.subject}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}