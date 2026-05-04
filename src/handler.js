const FLOW = require('./flow');
const { sendText, sendSequence, sendButtons } = require('./services/whatsapp');
const { getSession, createSession, updateSession, completeSession, appendResponse, getAnswers, setEditing } = require('./services/sheets');

const processedIds = new Set();
const locks = new Map();

async function handleMessage(phone, text, messageId) {
  if (messageId) {
    if (processedIds.has(messageId)) return;
    processedIds.add(messageId);
    setTimeout(() => processedIds.delete(messageId), 5 * 60 * 1000);
  }

  if (locks.get(phone)) {
    console.log(`[handler] Mensaje de ${phone} ignorado — procesando anterior`);
    return;
  }
  locks.set(phone, true);

  try {
    await processMessage(phone, text);
  } catch (err) {
    console.error(`[handler] Error con ${phone}:`, err.message);
  } finally {
    locks.delete(phone);
  }
}

const EDIT_MAP = { '1':'p1','2':'p2','3':'p3','4':'p4','5':'p5','6':'p6','7':'p7','8':'p8','9':'p9' };

function truncate(text, max = 60) {
  return text.length > max ? text.slice(0, max) + '...' : text;
}

function buildPreviewContent(answers) {
  const order = ['p1','p2','p3','p4','p5','p6','p7','p8','p9'];
  const lines = ['Esto es lo que registré de ti:\n'];

  order.forEach((key, i) => {
    const step = FLOW[key];
    const answer = answers[step.question_id] || '—';
    let display;
    if (step.type === 'choice' && step.options && step.options[answer]) {
      display = truncate(step.options[answer]);
    } else {
      display = `"${truncate(answer)}"`;
    }
    lines.push(`${i + 1} · *${step.label}*\n   ${display}`);
  });

  lines.push('\n¿Deseas cambiar alguna respuesta?');
  return lines.join('\n');
}

async function advanceTo(phone, session, nextKey) {
  const nextStep = FLOW[nextKey];

  if (nextStep.type === 'none') {
    await updateSession(session, nextKey);
    await sendSequence(phone, nextStep.messages);
    await completeSession(session);
  } else if (nextStep.type === 'summary') {
    await updateSession(session, nextKey);
    const answers = await getAnswers(session);
    await sendButtons(phone, buildPreviewContent(answers), [
      { id: 'preview_cambiar',    title: 'Sí, cambiar una' },
      { id: 'preview_confirmar',  title: 'Confirmar datos' }
    ]);
  } else {
    await updateSession(session, nextKey);
    await sendSequence(phone, nextStep.messages);
  }
}

async function processMessage(phone, text) {
  const session = await getSession(phone);

  if (!session) {
    await createSession(phone);
    await sendSequence(phone, FLOW.welcome.messages);
    return;
  }

  if (session.current_step === 'done') {
    await sendText(phone, FLOW.closing.done_reply);
    return;
  }

  const step = FLOW[session.current_step];
  if (!step) {
    console.error(`[handler] Paso desconocido para ${phone}: ${session.current_step}`);
    return;
  }

  const trimmed = text.trim();

  // -- Previsualización: espera respuesta de botón --
  if (step.type === 'summary') {
    if (trimmed === 'preview_cambiar') {
      await advanceTo(phone, session, 'edit_menu');
    } else if (trimmed === 'preview_confirmar') {
      await setEditing(session, false);
      await advanceTo(phone, session, 'c1');
    } else {
      await sendText(phone, 'Por favor usa los botones para responder.');
    }
    return;
  }

  // -- Menú de edición: espera número 1–9 --
  if (step.type === 'edit_menu') {
    const num = trimmed[0];
    if (!EDIT_MAP[num]) {
      await sendText(phone, FLOW.edit_menu.messages[0]);
      return;
    }
    await setEditing(session, true);
    await advanceTo(phone, session, EDIT_MAP[num]);
    return;
  }

  // -- Preguntas de selección --
  if (step.type === 'choice') {
    const answer = trimmed.toUpperCase()[0];
    if (!['A', 'B', 'C', 'D'].includes(answer)) {
      await sendText(phone, step.messages[step.messages.length - 1]);
      return;
    }
    if (step.question_id) await appendResponse(session, step.question_id, answer);
  } else {
    // 'free' o 'any'
    if (step.question_id) await appendResponse(session, step.question_id, trimmed);
  }

  // En modo edición, al terminar una pregunta P volver a la previsualización
  let nextKey = step.next;
  if (session.editing && step.question_id && step.question_id.startsWith('P')) {
    nextKey = 'preview';
  }

  if (!nextKey) {
    await completeSession(session);
    return;
  }

  await advanceTo(phone, session, nextKey);
}

module.exports = { handleMessage };
