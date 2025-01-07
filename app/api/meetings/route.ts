import { NextResponse } from 'next/server';
import { createMeeting, getMeetingsByTeacher, getMeetingsByParent, updateMeetingStatus } from '@/lib/meetings';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const meetingData = await request.json();
    const newMeeting = await createMeeting(meetingData);
    console.log(newMeeting);
    return NextResponse.json({ success: true, meeting: newMeeting });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to create meeting' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const teacherId = searchParams.get('teacherId');
  const parentId = searchParams.get('parentId');

  try {
    let meetings;
    if (teacherId) {
      meetings = await getMeetingsByTeacher(parseInt(teacherId));
    } else if (parentId) {
      meetings = await getMeetingsByParent(parseInt(parentId));
    } else {
      return NextResponse.json(
        { success: false, message: 'Teacher ID or Parent ID is required' },
        { status: 400 }
      );
    }
    return NextResponse.json({ success: true, meetings });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch meetings' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { meetingId, status, message } = await request.json();
    const updatedMeeting = await updateMeetingStatus(meetingId, status, message);
    return NextResponse.json({ success: true, meeting: updatedMeeting });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to update meeting status' },
      { status: 500 }
    );
  }
}