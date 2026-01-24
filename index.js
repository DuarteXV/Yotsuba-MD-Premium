import makeWASocket, { useMultiFileAuthState, DisconnectReason } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import pino from 'pino';
import fs from 'fs';
import path from 'path';
import qrcode from 'qrcode-terminal';
import { handler } from './handler.js';

global.plugins = {};

async function startBot() {
    // Carga dinámica de plugins
    const pluginFolder = path.join(process.cwd(), 'plugins');
    if (!fs.existsSync(pluginFolder)) fs.mkdirSync(pluginFolder);
    
    const pluginFiles = fs.readdirSync(pluginFolder).filter(file => file.endsWith('.js'));
    for (const file of pluginFiles) {
        const module = await import(`./plugins/${file}`);
        global.plugins[file] = module.default;
    }

    console.log(`✅ ${Object.keys(global.plugins).length} Plugins cargados correctamente.`);

    const { state, saveCreds } = await useMultiFileAuthState('sesion_bot');
    const conn = makeWASocket.default({
        logger: pino({ level: 'silent' }),
        auth: state,
        printQRInTerminal: true
    });

    conn.ev.on('creds.update', saveCreds);

    conn.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;
        if (qr) qrcode.generate(qr, { small: true });
        
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect.error instanceof Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) startBot();
        } else if (connection === 'open') {
            console.log('\n🌟 BOT CONECTADO CON ÉXITO 🌟\n');
        }
    });

    conn.ev.on('messages.upsert', async m => {
        await handler(conn, m);
    });
}

startBot();
