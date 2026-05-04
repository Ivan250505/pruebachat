// Hoja requerida: "Registros"
// Cabeceras fila 1:
// phone | current_step | started_at | completed_at | P1 | P2 | P3 | P4 | P5 | P6 | P7 | P8 | P9 | C1 | C2 | C3 | C4 | C5 | C6 | editing
// A         B               C               D          E    F    G    H    I    J    K    L    M    N    O    P    Q    R    S    T

const { google } = require('googleapis');

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const SHEET = 'Registros';

const QUESTION_COL = {
  P1: 'E', P2: 'F', P3: 'G', P4: 'H', P5: 'I',
  P6: 'J', P7: 'K', P8: 'L', P9: 'M',
  C1: 'N', C2: 'O', C3: 'P', C4: 'Q', C5: 'R', C6: 'S'
};

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
    range: `${SHEET}!A:T`
  });

  const rows = res.data.values || [];
  const rowIndex = rows.findIndex((row, i) => i > 0 && row[0] === phone);
  if (rowIndex === -1) return null;

  const row = rows[rowIndex];
  return {
    phone:        row[0],
    current_step: row[1],
    started_at:   row[2] || '',
    editing:      row[19] === 'true',
    _rowNum:      rowIndex + 1
  };
}

async function createSession(phone) {
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET}!A:D`,
    valueInputOption: 'RAW',
    requestBody: {
      values: [[phone, 'welcome', new Date().toISOString(), '']]
    }
  });
}

async function updateSession(session, newStep) {
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET}!B${session._rowNum}`,
    valueInputOption: 'RAW',
    requestBody: { values: [[newStep]] }
  });
}

async function completeSession(session) {
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET}!B${session._rowNum}:D${session._rowNum}`,
    valueInputOption: 'RAW',
    requestBody: {
      values: [['done', session.started_at, new Date().toISOString()]]
    }
  });
}

async function appendResponse(session, questionId, responseText) {
  const col = QUESTION_COL[questionId];
  if (!col) {
    console.warn(`[sheets] ID de pregunta desconocido: ${questionId}`);
    return;
  }
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET}!${col}${session._rowNum}`,
    valueInputOption: 'RAW',
    requestBody: { values: [[responseText]] }
  });
}

async function getAnswers(session) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET}!E${session._rowNum}:M${session._rowNum}`
  });
  const row = (res.data.values || [[]])[0] || [];
  return {
    P1: row[0] || '', P2: row[1] || '', P3: row[2] || '',
    P4: row[3] || '', P5: row[4] || '', P6: row[5] || '',
    P7: row[6] || '', P8: row[7] || '', P9: row[8] || ''
  };
}

async function setEditing(session, flag) {
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET}!T${session._rowNum}`,
    valueInputOption: 'RAW',
    requestBody: { values: [[flag ? 'true' : '']] }
  });
}

module.exports = { getSession, createSession, updateSession, completeSession, appendResponse, getAnswers, setEditing };
