import jwt from 'jsonwebtoken';
import { connectDB } from './db';
import { User } from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'codenerve_super_secret_jwt_key_2026_change_in_production';

export interface AuthSession {
  userId: string;
  role: 'student' | 'admin' | 'teacher';
  user?: any;
}

export interface AuthVerificationResult {
  authenticated: boolean;
  status?: number;
  message?: string;
  session?: AuthSession;
}

/**
 * Validates the Authorization Bearer JWT token from an incoming Next.js Request.
 * Optionally enforces required user roles (e.g., ['admin', 'teacher']).
 */
export async function verifyAuth(
  req: Request,
  allowedRoles?: ('student' | 'admin' | 'teacher')[]
): Promise<AuthVerificationResult> {
  const authHeader = req.headers.get('authorization');
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return {
      authenticated: false,
      status: 401,
      message: 'Access denied: Authentication token required in Authorization header.',
    };
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      role: 'student' | 'admin' | 'teacher';
    };

    // Role check if specified
    if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
      return {
        authenticated: false,
        status: 403,
        message: `Forbidden: This resource requires one of [${allowedRoles.join(', ')}] permissions.`,
      };
    }

    // If it's a synthetic or static admin account
    if (decoded.role === 'admin' && decoded.userId.startsWith('admin-')) {
      return {
        authenticated: true,
        session: {
          userId: decoded.userId,
          role: decoded.role,
        },
      };
    }

    // Otherwise, verify user existence in MongoDB
    await connectDB();
    const user = await User.findById(decoded.userId);

    if (!user) {
      return {
        authenticated: false,
        status: 404,
        message: 'Account associated with token no longer exists.',
      };
    }

    return {
      authenticated: true,
      session: {
        userId: user._id.toString(),
        role: user.role,
        user,
      },
    };
  } catch (err: any) {
    return {
      authenticated: false,
      status: 403,
      message: 'Invalid or expired session token. Please sign in again.',
    };
  }
}
