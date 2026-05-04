const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const ACCESS_TOKEN    = process.env.ACCESS_TOKEN;
const API_URL         = `https://graph.facebook.com/v19.0/${PHONE_NUMBER_ID}/messages`;

async function sendText(to, body) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ACCESS_TOKEN}`
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body }
    })
  });

  const data = await res.json();
  if (!res.ok) console.error(`[WA] Error enviando a ${to}:`, JSON.stringify(data));
  return data;
}

async function sendSequence(to, messages, delayMs = 2500) {
  for (let i = 0; i < messages.length; i++) {
    await sendText(to, messages[i]);
    if (i < messages.length - 1) {
      await new Promise(r => setTimeout(r, delayMs));
    }
  }
}

async function sendButtons(to, bodyText, buttons) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ACCESS_TOKEN}`
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to,
      type: 'interactive',
      interactive: {
        type: 'button',
        body: { text: bodyText },
        action: {
          buttons: buttons.map(b => ({
            type: 'reply',
            reply: { id: b.id, title: b.title }
          }))
        }
      }
    })
  });

  const data = await res.json();
  if (!res.ok) console.error(`[WA] Error enviando botones a ${to}:`, JSON.stringify(data));
  return data;
}

module.exports = { sendText, sendSequence, sendButtons };
