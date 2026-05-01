require('dotenv').config();
const express = require('express');
const { handleMessage } = require('./src/handler');

const app          = express();
const PORT         = process.env.PORT || 3000;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

app.use(express.json());

// Verificación del webhook con Meta
app.get('/webhook', (req, res) => {
  const mode      = req.query['hub.mode'];
  const token     = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('[webhook] Verificado OK');
    res.status(200).send(challenge);
  } else {
    console.log('[webhook] Verificación fallida');
    res.sendStatus(403);
  }
});

// Recibe mensajes de WhatsApp
app.post('/webhook', (req, res) => {
  // Responder 200 inmediatamente — Meta espera respuesta en < 20 s
  res.sendStatus(200);

  const messages = req.body?.entry?.[0]?.changes?.[0]?.value?.messages;
  if (!messages) return;

  const msg = messages[0];
  if (msg.type !== 'text') return;

  const phone     = msg.from;
  const text      = msg.text?.body;
  const messageId = msg.id;

  if (phone && text) {
    console.log(`[webhook] Mensaje de ${phone}: ${text.substring(0, 60)}`);
    handleMessage(phone, text, messageId).catch(err =>
      console.error(`[webhook] Error no capturado de ${phone}:`, err)
    );
  }
});

app.listen(PORT, () => console.log(`[server] Corriendo en puerto ${PORT}`));
