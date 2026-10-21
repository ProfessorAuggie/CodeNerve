import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { verifyAuth } from '@/lib/serverAuth';
import { syncUserToGoogleSheet } from '@/lib/googleSheets';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Verify admin/faculty permissions
    const authResult = await verifyAuth(req, ['admin', 'teacher']);
    if (!authResult.authenticated) {
      return NextResponse.json(
        { success: false, message: authResult.message || 'Unauthorized access' },
        { status: authResult.status || 401 }
      );
    }

    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    if (!status || !['approved', 'pending', 'disapproved'].includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Invalid status. Must be approved, pending, or disapproved.' },
        { status: 400 }
      );
    }

    await connectDB();
    const student = await User.findById(id);
    if (!student) {
      return NextResponse.json({ success: false, message: 'Student not found.' }, { status: 404 });
    }

    student.approvalStatus = status;
    if (status === 'approved' && student.currentActivity.toLowerCase().includes('pending')) {
      student.currentActivity = 'Account verified & approved by faculty';
    }
    await student.save();

    // Live sync to Google Sheet
    syncUserToGoogleSheet(student).catch((err) => {
      console.error('Google Sheet sync error on approval update:', err);
    });

    return NextResponse.json({
      success: true,
      message: `Student status successfully updated to ${status}.`,
      student: student.toJSON(),
    });
  } catch (err: any) {
    console.error('Error updating student approval:', err);
    return NextResponse.json({ success: false, message: err.message || 'Server error' }, { status: 500 });
  }
}
