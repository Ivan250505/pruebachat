const express = require('express');

const app = express();
const PORT             = process.env.PORT;
const PHONE_NUMBER_ID  = process.env.PHONE_NUMBER_ID;
const ACCESS_TOKEN     = process.env.ACCESS_TOKEN;
const VERIFY_TOKEN     = process.env.VERIFY_TOKEN;

app.use(express.json());

// Verificacion del webhook con Meta
app.get('/webhook', (req, res) => {
  const mode      = req.query['hub.mode'];
  const token     = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('Webhook verificado OK');
    res.status(200).send(challenge);
  } else {
    console.log('Verificacion fallida');
    res.sendStatus(403);
  }
});

// Recibe mensajes de WhatsApp
app.post('/webhook', (req, res) => {
  const body = req.body;

  const messages = body?.entry?.[0]?.changes?.[0]?.value?.messages;
  if (!messages) return res.sendStatus(200);

  const msg  = messages[0];
  const from = msg.from;
  const text = msg?.text?.body;

  if (text) {
    console.log(`Mensaje de ${from}: ${text}`);
    sendMessage(from, text);
  }

  res.sendStatus(200);
});

function sendMessage(to, text) {
  fetch(`https://graph.facebook.com/v19.0/${PHONE_NUMBER_ID}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ACCESS_TOKEN}`
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body: text }
    })
  })
  .then(r => r.json())
  .then(data => console.log('Enviado:', JSON.stringify(data)))
  .catch(err => console.error('Error:', err));
}

app.listen(PORT, () => {
  console.log(`Servidor en puerto ${PORT}`);
});
