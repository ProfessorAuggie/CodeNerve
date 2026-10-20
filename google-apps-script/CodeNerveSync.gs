/**
 * CodeNerve -> Google Sheets export.
 *
 * Configure Script Properties:
 * SUPABASE_URL                 https://<project>.supabase.co
 * SUPABASE_SERVICE_ROLE_KEY   Supabase service-role key
 * SPREADSHEET_ID               Destination spreadsheet ID
 */
const SHEETS = {
  roster: 'Student Roster',
  progress: 'Progress Summary',
};

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('CodeNerve')
    .addItem('Sync now', 'syncCodeNerve')
    .addItem('Install daily sync', 'installDailySync')
    .addToUi();
}

function syncCodeNerve() {
  const profiles = supabaseGet(
    'profiles?select=id,name,email,registration_number,track,batch,approval_status,created_at,updated_at&role=eq.student&order=created_at.desc'
  );
  const progress = supabaseGet(
    'problem_progress?select=user_id,problem_id,status,updated_at&status=eq.SOLVED'
  );

  const solvedByUser = {};
  progress.forEach(function (row) {
    solvedByUser[row.user_id] = solvedByUser[row.user_id] || [];
    solvedByUser[row.user_id].push(row.problem_id);
  });

  const rosterRows = profiles.map(function (profile) {
    const solved = solvedByUser[profile.id] || [];
    return [
      profile.id,
      profile.name,
      profile.email,
      profile.registration_number || '',
      profile.track || 'global',
      profile.batch || '',
      profile.approval_status || 'pending',
      profile.created_at || '',
      profile.updated_at || '',
      solved.length,
    ];
  });

  const progressRows = profiles.flatMap(function (profile) {
    return (solvedByUser[profile.id] || []).map(function (problemId) {
      return [profile.id, profile.name, profile.email, problemId];
    });
  });

  writeSheet(SHEETS.roster, [
    ['User ID', 'Name', 'Email', 'Registration Number', 'Track', 'Batch', 'Approval Status', 'Registered At', 'Updated At', 'Solved Problems'],
  ].concat(rosterRows));
  writeSheet(SHEETS.progress, [
    ['User ID', 'Name', 'Email', 'Problem ID'],
  ].concat(progressRows));
  PropertiesService.getScriptProperties().setProperty('LAST_SYNC_AT', new Date().toISOString());
}

function installDailySync() {
  ScriptApp.getProjectTriggers()
    .filter(function (trigger) { return trigger.getHandlerFunction() === 'syncCodeNerve'; })
    .forEach(function (trigger) { ScriptApp.deleteTrigger(trigger); });
  ScriptApp.newTrigger('syncCodeNerve').timeBased().everyDays(1).atHour(2).create();
  syncCodeNerve();
}

function supabaseGet(path) {
  const properties = PropertiesService.getScriptProperties();
  const url = properties.getProperty('SUPABASE_URL');
  const key = properties.getProperty('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !key) throw new Error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Script Properties.');

  const response = UrlFetchApp.fetch(url.replace(/\/$/, '') + '/rest/v1/' + path, {
    method: 'get',
    headers: {
      apikey: key,
      Authorization: 'Bearer ' + key,
    },
    muteHttpExceptions: true,
  });
  if (response.getResponseCode() < 200 || response.getResponseCode() >= 300) {
    throw new Error('Supabase request failed (' + response.getResponseCode() + '): ' + response.getContentText());
  }
  return JSON.parse(response.getContentText());
}

function writeSheet(name, rows) {
  const spreadsheet = SpreadsheetApp.openById(
    PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID')
  );
  const sheet = spreadsheet.getSheetByName(name) || spreadsheet.insertSheet(name);
  sheet.clearContents();
  if (!rows.length) return;
  sheet.getRange(1, 1, rows.length, rows[0].length).setValues(rows);
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, rows[0].length);
}
