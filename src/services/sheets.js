// Hoja requerida: "Registros"
// Cabeceras fila 1:
// phone | current_step | started_at | completed_at | P1 | P2 | P3 | P4 | P5 | P6 | P7 | P8 | P9 | C1 | C2 | C3
// A         B               C               D          E    F    G    H    I    J    K    L    M    N    O    P

const { google } = require('googleapis');

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const SHEET = 'Registros';

const QUESTION_COL = {
  P1: 'E', P2: 'F', P3: 'G', P4: 'H', P5: 'I',
  P6: 'J', P7: 'K', P8: 'L', P9: 'M',
  C1: 'N', C2: 'O', C3: 'P'
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
    range: `${SHEET}!A:D`
  });

  const rows = res.data.values || [];
  const rowIndex = rows.findIndex((row, i) => i > 0 && row[0] === phone);
  if (rowIndex === -1) return null;

  const row = rows[rowIndex];
  return {
    phone:        row[0],
    current_step: row[1],
    started_at:   row[2] || '',
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

module.exports = { getSession, createSession, updateSession, completeSession, appendResponse };
