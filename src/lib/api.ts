/**
 * CodeNerve Frontend API Client
 * Native Next.js 15 App Router Route Handlers (/api).
 */

const TOKEN_KEY = 'codenerve_auth_token';
const ADMIN_TOKEN_KEY = 'codenerve_admin_token';

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string | null): void {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function getStoredAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ADMIN_TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
}

export function setStoredAdminToken(token: string | null): void {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
  }
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  token?: string;
  user?: any;
  admin?: any;
  students?: any[];
  count?: number;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  registrationNumber: string;
  track?: 'global' | 'lpu';
  batch?: string;
}

/**
 * Health check helper
 */
export async function apiCheckHealth(): Promise<{ isOnline: boolean; mongoConnected: boolean; details?: any }> {
  try {
    const res = await fetch('/api/health');
    if (!res.ok) return { isOnline: false, mongoConnected: false };
    const data = await res.json();
    return {
      isOnline: true,
      mongoConnected: Boolean(data?.database?.connected),
      details: data,
    };
  } catch {
    return { isOnline: false, mongoConnected: false };
  }
}

/**
 * Register a new student account
 */
export async function apiRegister(payload: RegisterPayload): Promise<ApiResponse> {
  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (res.ok && data.token) {
      setStoredToken(data.token);
    }
    return data;
  } catch (err: any) {
    return {
      success: false,
      message: 'Unable to connect to the authentication service. Please try again.',
    };
  }
}

/**
 * Login with email or registration number and password
 */
export async function apiLogin(identifier: string, password?: string): Promise<ApiResponse> {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    });

    const data = await res.json();
    if (res.ok && data.token) {
      setStoredToken(data.token);
    }
    return data;
  } catch (err: any) {
    return {
      success: false,
      message: 'Unable to reach the server. Please check your network connection.',
    };
  }
}

/**
 * Faculty/Admin passcode authentication
 */
export async function apiAdminLogin(passcode: string): Promise<ApiResponse> {
  try {
    const res = await fetch('/api/auth/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passcode }),
    });

    const data = await res.json();
    if (res.ok && data.token) {
      setStoredAdminToken(data.token);
    }
    return data;
  } catch (err: any) {
    return {
      success: false,
      message: 'Unable to connect to admin authentication service.',
    };
  }
}

/**
 * Fetch current authenticated user from token
 */
export async function apiGetMe(): Promise<ApiResponse> {
  const token = getStoredToken();
  if (!token) return { success: false, message: 'No auth token found.' };

  try {
    const res = await fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        setStoredToken(null);
      }
      return { success: false, message: 'Session expired.' };
    }

    return await res.json();
  } catch {
    return { success: false, message: 'Could not reach server to verify session.' };
  }
}

/**
 * Fetch all students for the admin live roster (requires admin token)
 */
export async function apiGetStudents(): Promise<ApiResponse> {
  const token = getStoredAdminToken();
  try {
    const res = await fetch('/api/students', {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    return await res.json();
  } catch {
    return { success: false, message: 'Could not fetch students from server.' };
  }
}

/**
 * Trigger manual Google Sheets roster synchronization (requires admin token)
 */
export async function apiSyncGoogleSheet(): Promise<ApiResponse> {
  const token = getStoredAdminToken();
  try {
    const res = await fetch('/api/students/sync-sheet', {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    return await res.json();
  } catch (err: any) {
    return {
      success: false,
      message: 'Failed to contact server to sync Google Sheet.',
    };
  }
}

/**
 * Update student approval status in database (requires admin token)
 */
export async function apiUpdateStudentApproval(
  studentId: string,
  status: 'approved' | 'pending' | 'disapproved'
): Promise<ApiResponse> {
  const token = getStoredAdminToken();
  try {
    const res = await fetch(`/api/students/${studentId}/approval`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ status }),
    });
    return await res.json();
  } catch {
    return { success: false, message: 'Could not contact server to update approval.' };
  }
}

/**
 * Delete a student from database (requires admin token)
 */
export async function apiDeleteStudent(studentId: string): Promise<ApiResponse> {
  const token = getStoredAdminToken();
  try {
    const res = await fetch(`/api/students/${studentId}`, {
      method: 'DELETE',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    return await res.json();
  } catch {
    return { success: false, message: 'Could not contact server to delete student.' };
  }
}
