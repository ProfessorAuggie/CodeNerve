import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { syncUserToGoogleSheet } from '@/lib/googleSheets';
import { checkRateLimit } from '@/lib/rateLimit';

const JWT_SECRET = process.env.JWT_SECRET || 'codenerve_super_secret_jwt_key_2026_change_in_production';

export async function POST(req: Request) {
  try {
    // 1. Rate Limiting: max 10 attempts per minute per IP
    const rateCheck = checkRateLimit(req, 'login', { limit: 10, windowMs: 60 * 1000 });
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: `Too many login attempts. Please wait ${rateCheck.resetInSeconds} seconds before trying again.`,
        },
        {
          status: 429,
          headers: { 'Retry-After': String(rateCheck.resetInSeconds) },
        }
      );
    }

    await connectDB();
    const body = await req.json();
    const { identifier, password } = body;

    // 2. Input Validation & Bounds
    if (!identifier || typeof identifier !== 'string' || !identifier.trim()) {
      return NextResponse.json(
        { success: false, message: 'Please enter your email or registration number.' },
        { status: 400 }
      );
    }

    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Please enter your password.' },
        { status: 400 }
      );
    }

    if (password.length > 128) {
      return NextResponse.json(
        { success: false, message: 'Password exceeds maximum allowed length of 128 characters.' },
        { status: 400 }
      );
    }

    const clean = identifier.trim();

    // 3. Query student by email or registration number
    const user = await User.findOne({
      $or: [
        { email: clean.toLowerCase() },
        { registrationNumber: clean.toUpperCase() },
      ],
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'No student record found with these credentials. Please check your details or create an account.',
        },
        { status: 401 }
      );
    }

    // 4. Approval Status Enforcement
    if (user.approvalStatus === 'pending') {
      return NextResponse.json(
        {
          success: false,
          message: `Your registration request for "${user.name}" is currently PENDING administrator approval. Please wait for an administrator to review and approve your account.`,
        },
        { status: 403 }
      );
    }

    if (user.approvalStatus === 'disapproved') {
      return NextResponse.json(
        {
          success: false,
          message: `Your registration request for "${user.name}" was DISAPPROVED by the administrator. Please contact your faculty coordinator.`,
        },
        { status: 403 }
      );
    }

    // 5. Password Verification
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: 'Invalid password. Please check your credentials.' },
        { status: 401 }
      );
    }

    // 6. Update status and activity
    user.status = 'online';
    user.lastActive = new Date();
    user.currentActivity = `Active in ${user.track === 'lpu' ? 'LPU Portal' : 'Global DSA Track'}`;
    await user.save();

    // Background sync to Google Sheet
    syncUserToGoogleSheet(user).catch(() => {});

    // 7. Issue Session Token
    const token = jwt.sign(
      { userId: user._id.toString(), role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      success: true,
      message: `Welcome back, ${user.name}! Signed in successfully.`,
      token,
      user: user.toJSON(),
    });
  } catch (err: any) {
    console.error('Login API error:', err);
    return NextResponse.json(
      { success: false, message: err.message || 'Server error while signing in.' },
      { status: 500 }
    );
  }
}
