import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { syncUserToGoogleSheet } from '@/lib/googleSheets';
import { checkRateLimit } from '@/lib/rateLimit';

const JWT_SECRET = process.env.JWT_SECRET || 'codenerve_super_secret_jwt_key_2026_change_in_production';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  try {
    // 1. Rate Limiting: max 10 registrations per minute per IP
    const rateCheck = checkRateLimit(req, 'register', { limit: 10, windowMs: 60 * 1000 });
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: `Too many registration attempts. Please wait ${rateCheck.resetInSeconds} seconds before trying again.`,
        },
        {
          status: 429,
          headers: { 'Retry-After': String(rateCheck.resetInSeconds) },
        }
      );
    }

    await connectDB();
    const body = await req.json();
    const { name, email, password, registrationNumber, track, batch } = body;

    // 2. Input Validation
    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ success: false, message: 'Full name is required.' }, { status: 400 });
    }
    if (name.trim().length > 100) {
      return NextResponse.json({ success: false, message: 'Name cannot exceed 100 characters.' }, { status: 400 });
    }

    if (!email || typeof email !== 'string' || !email.trim()) {
      return NextResponse.json({ success: false, message: 'Student email is required.' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    if (!EMAIL_REGEX.test(cleanEmail)) {
      return NextResponse.json({ success: false, message: 'Please enter a valid email address.' }, { status: 400 });
    }

    if (!password || typeof password !== 'string') {
      return NextResponse.json({ success: false, message: 'Password is required.' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ success: false, message: 'Password must be at least 6 characters long.' }, { status: 400 });
    }
    if (password.length > 128) {
      return NextResponse.json({ success: false, message: 'Password cannot exceed 128 characters.' }, { status: 400 });
    }

    if (!registrationNumber || typeof registrationNumber !== 'string' || !registrationNumber.trim()) {
      return NextResponse.json({ success: false, message: 'Registration number is required.' }, { status: 400 });
    }

    const cleanReg = registrationNumber.trim().toUpperCase();
    if (cleanReg.length > 30) {
      return NextResponse.json({ success: false, message: 'Registration number cannot exceed 30 characters.' }, { status: 400 });
    }

    // 3. Duplicate Check
    const existing = await User.findOne({
      $or: [{ email: cleanEmail }, { registrationNumber: cleanReg }],
    });

    if (existing) {
      if (existing.email === cleanEmail) {
        return NextResponse.json(
          { success: false, message: 'An account with this email address already exists. Please log in.' },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { success: false, message: 'An account with this Registration Number already exists. Please log in.' },
        { status: 409 }
      );
    }

    // 4. Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 5. Save to MongoDB
    const newUser = new User({
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      registrationNumber: cleanReg,
      track: track === 'lpu' ? 'lpu' : 'global',
      batch: batch || 'Computer Science & Engineering',
      university: track === 'lpu' ? 'Lovely Professional University (LPU)' : 'Global Student Cohort',
      approvalStatus: 'approved',
      status: 'online',
      currentActivity: 'Registered and active on CodeNerve',
    });

    await newUser.save();

    // 6. Google Sheets Sync in background
    syncUserToGoogleSheet(newUser).catch((err) => {
      console.error('Background Google Sheets sync error during registration:', err);
    });

    // 7. Generate JWT Token
    const token = jwt.sign(
      { userId: newUser._id.toString(), role: newUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return NextResponse.json(
      {
        success: true,
        message: `Account created successfully! Welcome to CodeNerve, ${newUser.name}.`,
        token,
        user: newUser.toJSON(),
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('Register API error:', err);
    return NextResponse.json(
      { success: false, message: err.message || 'Server error creating account.' },
      { status: 500 }
    );
  }
}
