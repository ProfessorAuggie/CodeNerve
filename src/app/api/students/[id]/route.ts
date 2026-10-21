import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { verifyAuth } from '@/lib/serverAuth';

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await verifyAuth(req, ['admin', 'teacher']);
    if (!authResult.authenticated) {
      return NextResponse.json(
        { success: false, message: authResult.message || 'Unauthorized access' },
        { status: authResult.status || 401 }
      );
    }

    const { id } = await params;
    await connectDB();
    const deleted = await User.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ success: false, message: 'Student record not found.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Student ${deleted.name} (${deleted.registrationNumber}) has been deleted.`,
    });
  } catch (err: any) {
    console.error('Error deleting student:', err);
    return NextResponse.json({ success: false, message: err.message || 'Server error' }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await verifyAuth(req, ['admin', 'teacher']);
    if (!authResult.authenticated) {
      return NextResponse.json(
        { success: false, message: authResult.message || 'Unauthorized access' },
        { status: authResult.status || 401 }
      );
    }

    const { id } = await params;
    const body = await req.json();

    await connectDB();
    const student = await User.findById(id);

    if (!student) {
      return NextResponse.json({ success: false, message: 'Student record not found.' }, { status: 404 });
    }

    // Allowed updates
    if (body.name) student.name = body.name.trim();
    if (body.batch) student.batch = body.batch.trim();
    if (body.track) student.track = body.track;
    if (body.approvalStatus) student.approvalStatus = body.approvalStatus;

    await student.save();

    return NextResponse.json({
      success: true,
      message: 'Student record updated successfully.',
      student: student.toJSON(),
    });
  } catch (err: any) {
    console.error('Error updating student:', err);
    return NextResponse.json({ success: false, message: err.message || 'Server error' }, { status: 500 });
  }
}
