import makeWASocket, { useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import pino from 'pino';
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { handler } from './handler.js';

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const question = (text) => new Promise((resolve) => rl.question(text, resolve));

global.plugins = {};

async function startBot() {
    // Cargar Plugins
    const pluginFolder = path.join(process.cwd(), 'plugins');
    if (!fs.existsSync(pluginFolder)) fs.mkdirSync(pluginFolder);
    const pluginFiles = fs.readdirSync(pluginFolder).filter(file => file.endsWith('.js'));
    
    for (const file of pluginFiles) {
        const module = await import(`./plugins/${file}`);
        global.plugins[file] = module.default;
    }

    const { state, saveCreds } = await useMultiFileAuthState('sesion_bot');
    const { version } = await fetchLatestBaileysVersion();

    const conn = makeWASocket.default({
        version,
        logger: pino({ level: 'silent' }),
        auth: state,
        browser: ['Ubuntu', 'Chrome', '20.0.04'],
        printQRInTerminal: false // Desactivado para usar Pairing Code
    });

    // --- SISTEMA DE VINCULACIÓN POR CÓDIGO ---
    if (!conn.authState.creds.registered) {
        console.log('--------------------------------------------');
        console.log('   CONFIGURACIÓN DE VINCULACIÓN');
        console.log('--------------------------------------------');
        const phoneNumber = await question('   Introduce tu número de WhatsApp con código de país\n   Ejemplo: 573001234567\n   > ');
        
        setTimeout(async () => {
            let code = await conn.requestPairingCode(phoneNumber.trim());
            code = code?.match(/.{1,4}/g)?.join('-') || code;
            console.log('\n--------------------------------------------');
            console.log(`🔗 TU CÓDIGO ES: ${code}`);
            console.log('--------------------------------------------\n');
        }, 3000);
    }

    conn.ev.on('creds.update', saveCreds);

    conn.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect.error instanceof Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) startBot();
        } else if (connection === 'open') {
            console.log('✅ [BOT CONECTADO]');
        }
    });

    conn.ev.on('messages.upsert', async m => {
        await handler(conn, m);
    });
}

startBot();
