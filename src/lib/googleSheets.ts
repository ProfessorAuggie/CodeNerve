import type { IUser } from '../models/User';

export interface GoogleSheetSyncResult {
  success: boolean;
  message: string;
  statusCode?: number;
}

/**
 * Pushes a student record to the configured Google Apps Script Webhook.
 */
export async function syncUserToGoogleSheet(user: IUser | any): Promise<GoogleSheetSyncResult> {
  const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;

  if (!webhookUrl) {
    return {
      success: false,
      message: 'GOOGLE_SHEET_WEBHOOK_URL is not configured in .env. Follow google-apps-script/CodeNerveGoogleSheet.gs to configure.',
    };
  }

  const payload = {
    action: 'UPSERT_USER',
    timestamp: new Date().toISOString(),
    user: {
      id: user._id ? user._id.toString() : user.id,
      name: user.name,
      email: user.email,
      registrationNumber: user.registrationNumber,
      track: user.track || 'global',
      batch: user.batch || '',
      university: user.university || 'Lovely Professional University (LPU)',
      semester: user.semester || 3,
      role: user.role || 'student',
      approvalStatus: user.approvalStatus || 'approved',
      solvedCount: user.solvedProblemIds ? user.solvedProblemIds.length : 0,
      completedLessonsCount: user.completedLessons ? user.completedLessons.length : 0,
      status: user.status || 'online',
      currentActivity: user.currentActivity || 'Active on CodeNerve',
      registeredAt: user.createdAt ? new Date(user.createdAt).toISOString() : new Date().toISOString(),
      lastActive: user.lastActive ? new Date(user.lastActive).toISOString() : new Date().toISOString(),
    },
  };

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      redirect: 'follow',
    });

    if (response.ok) {
      console.log(`📊 [Google Sheets] Synced student "${user.name}" (${user.email}) successfully.`);
      return {
        success: true,
        message: 'Student record synced to Google Sheet successfully.',
        statusCode: response.status,
      };
    } else {
      const errorText = await response.text();
      return {
        success: false,
        message: `Google Sheets webhook returned status ${response.status}: ${errorText}`,
        statusCode: response.status,
      };
    }
  } catch (err: any) {
    console.error('❌ [Google Sheets] Sync error:', err.message);
    return {
      success: false,
      message: `Failed to reach Google Sheet webhook: ${err.message}`,
    };
  }
}

/**
 * Pushes bulk students list to Google Sheets.
 */
export async function syncBatchToGoogleSheet(users: IUser[] | any[]): Promise<GoogleSheetSyncResult> {
  const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;

  if (!webhookUrl) {
    return {
      success: false,
      message: 'GOOGLE_SHEET_WEBHOOK_URL is not configured in .env.',
    };
  }

  const payload = {
    action: 'SYNC_ALL',
    timestamp: new Date().toISOString(),
    users: users.map((u) => ({
      id: u._id ? u._id.toString() : u.id,
      name: u.name,
      email: u.email,
      registrationNumber: u.registrationNumber,
      track: u.track || 'global',
      batch: u.batch || '',
      university: u.university || 'Lovely Professional University (LPU)',
      semester: u.semester || 3,
      role: u.role || 'student',
      approvalStatus: u.approvalStatus || 'approved',
      solvedCount: u.solvedProblemIds ? u.solvedProblemIds.length : 0,
      completedLessonsCount: u.completedLessons ? u.completedLessons.length : 0,
      status: u.status || 'offline',
      currentActivity: u.currentActivity || '',
      registeredAt: u.createdAt ? new Date(u.createdAt).toISOString() : new Date().toISOString(),
      lastActive: u.lastActive ? new Date(u.lastActive).toISOString() : new Date().toISOString(),
    })),
  };

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      redirect: 'follow',
    });

    if (response.ok) {
      return {
        success: true,
        message: `Successfully synchronized ${users.length} student records to Google Sheet.`,
        statusCode: response.status,
      };
    } else {
      const errorText = await response.text();
      return {
        success: false,
        message: `Bulk sync failed (${response.status}): ${errorText}`,
        statusCode: response.status,
      };
    }
  } catch (err: any) {
    return {
      success: false,
      message: `Failed to reach Google Sheet webhook: ${err.message}`,
    };
  }
}
