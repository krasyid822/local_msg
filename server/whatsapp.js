const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const path = require('path');
const qrcode = require('qrcode-terminal');

async function startWhatsApp(io) {
  const { state, saveCreds } = await useMultiFileAuthState(path.join(__dirname, 'auth_info'));
  const sock = makeWASocket({
    auth: state,
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type === 'notify') {
      for (const msg of messages) {
        if (msg.message && msg.pushName) {
          let text = msg.message.conversation || msg.message.extendedTextMessage?.text;
          if (text) {
            const waMsg = `[WA] ${msg.pushName}: ${text}`;
            io.emit('chat message', waMsg);
            console.log('Forwarded from WA:', waMsg);
          }
        }
      }
    }
  });

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update;
    
    if (qr) {
      console.log('QR Code received, scan with WhatsApp:');
      qrcode.generate(qr, { small: true });
    }
    
    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect.error = new Boom(lastDisconnect?.error))?.output?.statusCode !== DisconnectReason.loggedOut;
      if (shouldReconnect) {
        startWhatsApp(io);
      }
    }
    if (connection === 'open') {
      console.log('WhatsApp connection opened');
    }
  });
}

module.exports = startWhatsApp;
