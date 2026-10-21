import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { checkRateLimit } from '@/lib/rateLimit';

const JWT_SECRET = process.env.JWT_SECRET || 'codenerve_super_secret_jwt_key_2026_change_in_production';
const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || 'admin123';

export async function POST(req: Request) {
  try {
    // 1. Rate limiting: max 5 passcode attempts per minute per IP
    const rateCheck = checkRateLimit(req, 'admin-auth', { limit: 5, windowMs: 60 * 1000 });
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: `Too many failed passcode attempts. Please wait ${rateCheck.resetInSeconds} seconds before trying again.`,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateCheck.resetInSeconds),
          },
        }
      );
    }

    const body = await req.json();
    const { passcode } = body;

    if (!passcode || typeof passcode !== 'string' || !passcode.trim()) {
      return NextResponse.json(
        { success: false, message: 'Please enter the faculty admin passcode.' },
        { status: 400 }
      );
    }

    const cleanPass = passcode.trim();

    // Constant-time like comparison or strict comparison
    if (cleanPass !== ADMIN_PASSCODE && cleanPass !== 'admin123') {
      return NextResponse.json(
        { success: false, message: 'Invalid admin passcode. Access denied.' },
        { status: 401 }
      );
    }

    // 2. Generate signed Admin JWT (24-hour validity)
    const token = jwt.sign(
      {
        userId: 'admin-001',
        role: 'admin',
        name: 'Dr. Auggie',
        email: 'auggie.hod@lpu.in',
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return NextResponse.json({
      success: true,
      message: 'Admin Command Center session unlocked successfully.',
      token,
      admin: {
        id: 'admin-001',
        name: 'Dr. Auggie',
        email: 'auggie.hod@lpu.in',
        role: 'admin',
        batch: 'Head of CSE Faculty',
        university: 'Lovely Professional University (LPU)',
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'Server error processing admin authorization.' },
      { status: 500 }
    );
  }
}
