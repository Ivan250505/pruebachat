// Google Sheets structure required:
// Sheet "Sesiones":  phone | current_step | started_at | completed_at
// Sheet "Respuestas": timestamp | phone | question_id | response_text
// Row 1 in both sheets must be the header row shown above.

const { google } = require('googleapis');

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets']
});

const sheets = google.sheets({ version: 'v4', auth });

async function getSession(phone) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Sesiones!A:D'
  });

  const rows = res.data.values || [];
  const rowIndex = rows.findIndex((row, i) => i > 0 && row[0] === phone);
  if (rowIndex === -1) return null;

  const row = rows[rowIndex];
  return {
    phone:         row[0],
    current_step:  row[1],
    started_at:    row[2],
    completed_at:  row[3] || null,
    _rowNum:       rowIndex + 1
  };
}

async function createSession(phone) {
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Sesiones!A:D',
    valueInputOption: 'RAW',
    requestBody: {
      values: [[phone, 'welcome', new Date().toISOString(), '']]
    }
  });
}

async function updateSession(session, newStep) {
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `Sesiones!B${session._rowNum}`,
    valueInputOption: 'RAW',
    requestBody: { values: [[newStep]] }
  });
}

async function completeSession(session) {
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `Sesiones!B${session._rowNum}:D${session._rowNum}`,
    valueInputOption: 'RAW',
    requestBody: {
      values: [['done', session.started_at, new Date().toISOString()]]
    }
  });
}

async function appendResponse(phone, questionId, responseText) {
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: 'Respuestas!A:D',
    valueInputOption: 'RAW',
    requestBody: {
      values: [[new Date().toISOString(), phone, questionId, responseText]]
    }
  });
}

module.exports = { getSession, createSession, updateSession, completeSession, appendResponse };
