/**
 * ==============================================================================
 * CodeNerve ⚡ Google Sheets Live Sync Connector (Google Apps Script)
 * ==============================================================================
 * 
 * This script receives live webhooks from your CodeNerve Express/MongoDB backend
 * whenever a student:
 *  1. Registers a new account
 *  2. Logs in / changes online activity
 *  3. Solves problems or updates coursework
 *  4. Gets approved/disapproved by faculty
 * 
 * ------------------------------------------------------------------------------
 * 🚀 QUICK 2-MINUTE SETUP INSTRUCTIONS:
 * ------------------------------------------------------------------------------
 * 1. Create a new Google Spreadsheet at https://sheets.new (e.g. "CodeNerve Students Roster").
 * 2. In the top menu, go to: Extensions > Apps Script.
 * 3. Delete any default code in Code.gs, paste this ENTIRE file, and click "Save" (💾).
 * 4. In the top right, click "Deploy" > "New deployment".
 * 5. Click the gear icon (⚙️) next to "Select type" and choose "Web app".
 * 6. Set:
 *    - Description: "CodeNerve Live Sync"
 *    - Execute as: "Me (your email)"
 *    - Who has access: "Anyone"   <-- (CRITICAL: Allows CodeNerve backend to post data)
 * 7. Click "Deploy". Authorize permissions when prompted by Google.
 * 8. Copy the generated "Web app URL" (starts with https://script.google.com/macros/s/...).
 * 9. Paste that URL into your CodeNerve `.env` file:
 *    GOOGLE_SHEET_WEBHOOK_URL=https://script.google.com/macros/s/.../exec
 * 
 * That's it! Every registration & progress update will now stream into your Sheet automatically!
 * ==============================================================================
 */

const ROSTER_SHEET_NAME = 'Student Roster';
const LOG_SHEET_NAME = 'Activity Log';

const HEADERS = [
  'User ID',
  'Full Name',
  'Email',
  'Registration Number',
  'Track',
  'Batch',
  'University',
  'Role',
  'Approval Status',
  'Solved Problems',
  'Completed Lessons',
  'Online Status',
  'Current Activity',
  'Registered At',
  'Last Active',
  'Last Synced At'
];

/**
 * Handle incoming POST requests from CodeNerve backend
 */
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        message: 'No payload received'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const rosterSheet = getOrCreateRosterSheet(ss);

    if (data.action === 'UPSERT_USER' && data.user) {
      upsertStudentRow(rosterSheet, data.user);
      logActivity(ss, 'UPSERT_USER', data.user.name, data.user.email, `Synced student ${data.user.registrationNumber || ''}`);
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: 'Student upserted successfully',
        userId: data.user.id
      })).setMimeType(ContentService.MimeType.JSON);
    }

    if (data.action === 'SYNC_ALL' && Array.isArray(data.users)) {
      data.users.forEach(function(u) {
        upsertStudentRow(rosterSheet, u);
      });
      logActivity(ss, 'SYNC_ALL', 'Admin Sync', 'system', `Bulk synced ${data.users.length} students`);
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: `Bulk synced ${data.users.length} students`
      })).setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Unknown action: ' + data.action
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle GET requests for health check
 */
function doGet() {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'online',
    service: 'CodeNerve Google Sheets Webhook',
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Inserts or updates a student row based on Registration Number or Email
 */
function upsertStudentRow(sheet, user) {
  const data = sheet.getDataRange().getValues();
  let rowIndex = -1;

  // Search existing rows (skip header row 0)
  for (let i = 1; i < data.length; i++) {
    const rowId = String(data[i][0]).trim();
    const rowEmail = String(data[i][2]).toLowerCase().trim();
    const rowReg = String(data[i][3]).toUpperCase().trim();

    if (
      (user.id && rowId === String(user.id)) ||
      (user.email && rowEmail === String(user.email).toLowerCase()) ||
      (user.registrationNumber && rowReg === String(user.registrationNumber).toUpperCase())
    ) {
      rowIndex = i + 1; // 1-indexed for Sheet APIs
      break;
    }
  }

  const rowValues = [
    user.id || '',
    user.name || '',
    user.email || '',
    user.registrationNumber || '',
    user.track || 'global',
    user.batch || '',
    user.university || '',
    user.role || 'student',
    user.approvalStatus || 'approved',
    user.solvedCount || 0,
    user.completedLessonsCount || 0,
    user.status || 'online',
    user.currentActivity || '',
    user.registeredAt || new Date().toISOString(),
    user.lastActive || new Date().toISOString(),
    new Date().toISOString()
  ];

  if (rowIndex > 0) {
    sheet.getRange(rowIndex, 1, 1, rowValues.length).setValues([rowValues]);
  } else {
    sheet.appendRow(rowValues);
    rowIndex = sheet.getLastRow();
  }

  // Format status cell color
  try {
    const statusCell = sheet.getRange(rowIndex, 9); // Approval Status column
    const val = String(user.approvalStatus).toLowerCase();
    if (val === 'approved') {
      statusCell.setBackground('#dcfce7').setFontColor('#15803d');
    } else if (val === 'pending') {
      statusCell.setBackground('#fef9c3').setFontColor('#854d0e');
    } else if (val === 'disapproved') {
      statusCell.setBackground('#fee2e2').setFontColor('#b91c1c');
    }
  } catch (e) {
    // Formatting is optional
  }
}

/**
 * Retrieves or creates and formats the Student Roster sheet
 */
function getOrCreateRosterSheet(ss) {
  let sheet = ss.getSheetByName(ROSTER_SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(ROSTER_SHEET_NAME, 0);
  }

  // If newly created or empty, write header
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    const headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
    headerRange
      .setBackground('#4f6beb')
      .setFontColor('#ffffff')
      .setFontWeight('bold')
      .setFontFamily('Arial')
      .setHorizontalAlignment('center');
    sheet.setFrozenRows(1);
    sheet.setRowHeight(1, 36);
  }

  return sheet;
}

/**
 * Appends an entry to the Activity Log sheet
 */
function logActivity(ss, action, name, email, details) {
  try {
    let logSheet = ss.getSheetByName(LOG_SHEET_NAME);
    if (!logSheet) {
      logSheet = ss.insertSheet(LOG_SHEET_NAME);
      logSheet.appendRow(['Timestamp', 'Action', 'User Name', 'Email', 'Details']);
      logSheet.getRange(1, 1, 1, 5)
        .setBackground('#1e293b')
        .setFontColor('#ffffff')
        .setFontWeight('bold');
      logSheet.setFrozenRows(1);
    }
    logSheet.appendRow([new Date().toISOString(), action, name || '', email || '', details || '']);
  } catch (e) {
    // Ignore logging failures
  }
}

/**
 * Custom UI Menu inside Google Spreadsheet
 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('CodeNerve ⚡')
    .addItem('Format Roster Table', 'formatTable')
    .addItem('Clear Activity Log', 'clearLog')
    .addToUi();
}

function formatTable() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(ROSTER_SHEET_NAME);
  if (sheet) {
    sheet.autoResizeColumns(1, HEADERS.length);
  }
}

function clearLog() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(LOG_SHEET_NAME);
  if (sheet && sheet.getLastRow() > 1) {
    sheet.getRange(2, 1, sheet.getLastRow() - 1, 5).clearContent();
  }
}
