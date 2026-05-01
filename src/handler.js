const FLOW = require('./flow');
const { sendText, sendSequence } = require('./services/whatsapp');
const { getSession, createSession, updateSession, completeSession, appendResponse } = require('./services/sheets');

// Deduplication: track recently processed message IDs (clears after 5 min)
const processedIds = new Set();
// Per-phone lock: avoid race conditions when user sends messages rapidly
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

async function processMessage(phone, text) {
  const session = await getSession(phone);

  // Primera vez que escribe — arrancar flujo de bienvenida
  if (!session) {
    await createSession(phone);
    await sendSequence(phone, FLOW.welcome.messages);
    return;
  }

  // Flujo ya terminado
  if (session.current_step === 'done') return;

  const step = FLOW[session.current_step];
  if (!step) {
    console.error(`[handler] Paso desconocido para ${phone}: ${session.current_step}`);
    return;
  }

  const trimmed = text.trim();

  if (step.type === 'choice') {
    const answer = trimmed.toUpperCase()[0];
    if (!['A', 'B', 'C', 'D'].includes(answer)) {
      // Respuesta inválida — reenviar solo la pregunta
      await sendText(phone, step.messages[step.messages.length - 1]);
      return;
    }
    if (step.question_id) await appendResponse(session, step.question_id, answer);
  } else {
    // 'free' o 'any' — acepta cualquier texto
    if (step.question_id) await appendResponse(session, step.question_id, trimmed);
  }

  const nextKey = step.next;

  // Fin del flujo (no debería ocurrir en flujo normal, pero por seguridad)
  if (!nextKey) {
    await completeSession(session);
    return;
  }

  const nextStep = FLOW[nextKey];

  if (nextStep.type === 'none') {
    // Bloque de cierre — enviar mensajes y marcar como completado
    await updateSession(session, nextKey);
    await sendSequence(phone, nextStep.messages);
    await completeSession(session);
  } else {
    await updateSession(session, nextKey);
    await sendSequence(phone, nextStep.messages);
  }
}

module.exports = { handleMessage };
