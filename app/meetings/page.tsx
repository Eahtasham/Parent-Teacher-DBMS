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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

interface Meeting {
  id: number;
  meeting_date: string;
  meeting_time: string;
  subject: string;
  parent_name: string;
  teacher_name: string;
  student_name: string;
}

type SortKey = 'date' | 'subject' | 'teacher_name' | 'parent_name';

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const { theme, setTheme } = useTheme();

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

  useEffect(() => {
    // Set dark theme by default
    setTheme('dark');
  }, [setTheme]);

  const sortMeetings = (meetings: Meeting[]) => {
    return [...meetings].sort((a, b) => {
      if (sortKey === 'date') {
        const dateA = new Date(`${a.meeting_date} ${a.meeting_time}`);
        const dateB = new Date(`${b.meeting_date} ${b.meeting_time}`);
        return sortOrder === 'asc' 
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime();
      }
      
      const valueA = a[sortKey];
      const valueB = b[sortKey];
      return sortOrder === 'asc'
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-8">
        <div className="max-w-6xl mx-auto">
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardContent className="p-6">
              Loading meetings...
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <Card className="bg-white dark:bg-stone-800 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between border-b dark:border-gray-700">
            <CardTitle className="text-2xl font-bold dark:text-white">Scheduled Meetings</CardTitle>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Select
                  value={sortKey}
                  onValueChange={(value) => setSortKey(value as SortKey)}
                >
                  <SelectTrigger className="w-[180px] dark:bg-gray-700">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="subject">Subject</SelectItem>
                    <SelectItem value="teacher_name">Teacher</SelectItem>
                    <SelectItem value="parent_name">Parent</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={sortOrder}
                  onValueChange={(value) => setSortOrder(value as 'asc' | 'desc')}
                >
                  <SelectTrigger className="w-[120px] dark:bg-gray-700">
                    <SelectValue placeholder="Order" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">Ascending</SelectItem>
                    <SelectItem value="desc">Descending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="dark:border-gray-700 dark:bg-gray-700"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="rounded-md border dark:border-gray-700">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 dark:bg-gray-900/50">
                    <TableHead className="font-bold text-gray-900 dark:text-gray-100">Date</TableHead>
                    <TableHead className="font-bold text-gray-900 dark:text-gray-100">Time</TableHead>
                    <TableHead className="font-bold text-gray-900 dark:text-gray-100">Parent</TableHead>
                    <TableHead className="font-bold text-gray-900 dark:text-gray-100">Teacher</TableHead>
                    <TableHead className="font-bold text-gray-900 dark:text-gray-100">Student</TableHead>
                    <TableHead className="font-bold text-gray-900 dark:text-gray-100">Subject</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortMeetings(meetings).map((meeting) => (
                    <TableRow key={meeting.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                      <TableCell className="dark:text-gray-300">
                        {format(new Date(meeting.meeting_date), 'PPP')}
                      </TableCell>
                      <TableCell className="dark:text-gray-300">{meeting.meeting_time}</TableCell>
                      <TableCell className="dark:text-gray-300">{meeting.parent_name}</TableCell>
                      <TableCell className="dark:text-gray-300">{meeting.teacher_name}</TableCell>
                      <TableCell className="dark:text-gray-300">{meeting.student_name}</TableCell>
                      <TableCell className="dark:text-gray-300">{meeting.subject}</TableCell>
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