import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { verifyAuth } from '@/lib/serverAuth';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    // Enforce Admin / Faculty Authorization
    const authResult = await verifyAuth(req, ['admin', 'teacher']);
    if (!authResult.authenticated) {
      return NextResponse.json(
        { success: false, message: authResult.message || 'Unauthorized access' },
        { status: authResult.status || 401 }
      );
    }

    await connectDB();
    const students = await User.find({ role: 'student' }).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: students.length,
      students: students.map((s) => s.toJSON()),
    });
  } catch (err: any) {
    console.error('Error fetching students:', err);
    return NextResponse.json({ success: false, message: err.message || 'Server error' }, { status: 500 });
  }
}
