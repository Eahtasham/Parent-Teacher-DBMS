import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const query = `
      SELECT 
        m.id,
        m.meeting_date,
        m.meeting_time,
        m.subject,
        p.username as parent_name,
        t.username as teacher_name,
        s.name as student_name
      FROM meetings m
      JOIN parents p ON m.parent_id = p.id
      JOIN teachers t ON m.teacher_id = t.id
      JOIN students s ON m.student_id = s.id
      ORDER BY m.meeting_date ASC, m.meeting_time ASC
    `;

    const result = await pool.query(query);
    return NextResponse.json({ success: true, meetings: result.rows });
  } catch (error) {
    console.error('Error fetching meetings:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch meetings' },
      { status: 500 }
    );
  }
}