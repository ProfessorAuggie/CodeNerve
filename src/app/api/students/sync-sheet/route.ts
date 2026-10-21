import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { syncBatchToGoogleSheet } from '@/lib/googleSheets';
import { verifyAuth } from '@/lib/serverAuth';

export async function POST(req: Request) {
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
    const students = await User.find({ role: 'student' });
    const result = await syncBatchToGoogleSheet(students);

    return NextResponse.json(result);
  } catch (err: any) {
    console.error('Error syncing Google Sheet batch:', err);
    return NextResponse.json({ success: false, message: err.message || 'Server error' }, { status: 500 });
  }
}
