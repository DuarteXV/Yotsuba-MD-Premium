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
global.ownerNumber = ""; // Aquí guardaremos tu número para la notificación

async function startBot() {
    // 1. Cargar Plugins
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
        printQRInTerminal: false
    });

    // --- SISTEMA DE VINCULACIÓN Y NOTIFICACIÓN ---
    if (!conn.authState.creds.registered) {
        console.log('--------------------------------------------');
        const phoneNumber = await question('   Introduce tu número (ej: 573001234567)\n   > ');
        global.ownerNumber = phoneNumber.trim() + '@s.whatsapp.net';
        
        setTimeout(async () => {
            let code = await conn.requestPairingCode(phoneNumber.trim());
            code = code?.match(/.{1,4}/g)?.join('-') || code;
            console.log(`\n🔗 TU CÓDIGO ES: ${code}\n`);
        }, 3000);
    }

    conn.ev.on('creds.update', saveCreds);

    conn.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;
        
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect.error instanceof Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) startBot();
        } else if (connection === 'open') {
            console.log('✅ [CONECTADO] El bot está online');
            
            // Si tenemos el número de la consola, mandamos notificación
            if (global.ownerNumber) {
                await conn.sendMessage(global.ownerNumber, { 
                    text: '🚀 *¡Bot Conectado con Éxito!*\n\nEl sistema de plugins está activo y funcionando en Pterodactyl.' 
                });
                console.log(`📩 Notificación enviada a: ${global.ownerNumber}`);
            }
        }
    });

    conn.ev.on('messages.upsert', async m => {
        await handler(conn, m);
    });
}

startBot();
