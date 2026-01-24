import { useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, makeCacheableSignalKeyStore } from '@whiskeysockets/baileys';
import makeWASocket from '@whiskeysockets/baileys';
import pino from 'pino';
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import chalk from 'chalk';
import { Boom } from '@hapi/boom';
import { handler } from './handler.js';

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const question = (texto) => new Promise((resolver) => rl.question(texto, resolver));

global.plugins = {};
global.ownerNumber = ""; 

async function startBot() {
    // --- CARGA DINÁMICA DE PLUGINS ---
    const pluginFolder = path.join(process.cwd(), 'plugins');
    if (!fs.existsSync(pluginFolder)) fs.mkdirSync(pluginFolder);
    const pluginFiles = fs.readdirSync(pluginFolder).filter(file => file.endsWith('.js'));
    for (const file of pluginFiles) {
        try {
            const module = await import(`./plugins/${file}?update=${Date.now()}`);
            global.plugins[file] = module.default || module;
        } catch (e) {
            console.error(`Error en plugin ${file}:`, e);
        }
    }

    const folderSesion = 'sesion_bot';
    const { state, saveCreds } = await useMultiFileAuthState(folderSesion);
    const { version } = await fetchLatestBaileysVersion();

    // --- MENÚ DE SELECCIÓN ---
    let opcion;
    if (!fs.existsSync(`./${folderSesion}/creds.json`)) {
        console.log(chalk.bgCyan.black('\n ⌨  CONFIGURACIÓN DE CONEXIÓN '));
        opcion = await question(chalk.green('1. Con código QR\n') + chalk.blue('2. Con código de texto (Pairing Code)\n--> '));
    }

    const conn = makeWASocket.default({
        version,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: opcion === '1',
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" })),
        },
        // --- AQUÍ ESTÁ LO DE MAC OS ---
        browser: ['Mac OS', 'Safari', '15.6.1'], 
        markOnlineOnConnect: true,
    });

    // --- LÓGICA DEL PAIRING CODE ---
    if (opcion === '2' && !conn.authState.creds.registered) {
        let phoneNumber = await question(chalk.cyan('\n✦ Ingresa tu número de WhatsApp con código de país:\n--> '));
        phoneNumber = phoneNumber.replace(/\D/g, '');
        global.ownerNumber = phoneNumber + '@s.whatsapp.net';

        setTimeout(async () => {
            try {
                let code = await conn.requestPairingCode(phoneNumber);
                code = code?.match(/.{1,4}/g)?.join("-") || code;
                console.log(chalk.bold.white(chalk.bgMagenta(`\n✧ TU CÓDIGO ES: ${code} ✧\n`)));
                console.log(chalk.gray('Vincúlalo en: Dispositivos vinculados > Vincular con número de teléfono\n'));
            } catch (err) {
                console.error('Error al generar el código:', err);
            }
        }, 3000);
    }

    conn.ev.on('creds.update', saveCreds);

    conn.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;
        
        if (connection === 'close') {
            const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
            console.log(chalk.red(`\n[!] Conexión cerrada. Reconectando...`));
            if (reason !== DisconnectReason.loggedOut) startBot();
        } else if (connection === 'open') {
            console.log(chalk.bold.green('\n❀ BOT CONECTADO EXITOSAMENTE ❀'));
            
            // --- NOTIFICACIÓN AL WHATSAPP ---
            const target = global.ownerNumber || conn.user.id.split(':')[0] + '@s.whatsapp.net';
            await conn.sendMessage(target, { 
                text: '✅ *¡Conexión Exitosa!*\n\nEl bot se ha vinculado con MacOS y está listo para recibir comandos.' 
            });
            console.log(chalk.cyanBright(`📩 Notificación enviada a: ${target}`));
        }
    });

    conn.ev.on('messages.upsert', async (chatUpdate) => {
        const m = chatUpdate.messages[0];
        if (!m || !m.message) return;
        await handler(conn, m);
    });
}

startBot().catch(console.error);
