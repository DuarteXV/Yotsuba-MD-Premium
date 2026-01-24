import { useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, makeCacheableSignalKeyStore } from '@whiskeysockets/baileys';
import makeWASocket from '@whiskeysockets/baileys';
import pino from 'pino';
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import chalk from 'chalk';
import { Boom } from '@hapi/boom';
import NodeCache from 'node-cache'; // Necesario para no saturar RAM
import { handler } from './handler.js';

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const question = (texto) => new Promise((resolver) => rl.question(texto, resolver));
const msgRetryCounterCache = new NodeCache();

global.plugins = {};
global.ownerNumber = ""; 

async function startBot() {
    const pluginFolder = path.join(process.cwd(), 'plugins');
    if (!fs.existsSync(pluginFolder)) fs.mkdirSync(pluginFolder);
    const pluginFiles = fs.readdirSync(pluginFolder).filter(file => file.endsWith('.js'));
    for (const file of pluginFiles) {
        try {
            const module = await import(`./plugins/${file}?update=${Date.now()}`);
            global.plugins[file] = module.default || module;
        } catch (e) {}
    }

    const folderSesion = 'sesion_bot';
    const { state, saveCreds } = await useMultiFileAuthState(folderSesion);
    const { version } = await fetchLatestBaileysVersion();

    let opcion;
    if (!fs.existsSync(`./${folderSesion}/creds.json`)) {
        console.log(chalk.bgCyan.black('\n ⌨  MENÚ DE VINCULACIÓN '));
        opcion = await question(chalk.green('1. Código QR\n') + chalk.blue('2. Código de texto (Mac OS Sim)\n--> '));
    }

    const conn = makeWASocket.default({
        version,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: opcion === '1',
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" })),
        },
        // SIMULACIÓN MAC OS PARA EVITAR "UNU"
        browser: ['Mac OS', 'Chrome', '121.0.6167.184'], 
        msgRetryCounterCache,
        markOnlineOnConnect: true,
        generateHighQualityLinkPreview: true
    });

    if (opcion === '2' && !conn.authState.creds.registered) {
        let phoneNumber = await question(chalk.cyan('\n✦ Ingresa tu número completo (Ej: 573001234567):\n--> '));
        phoneNumber = phoneNumber.replace(/\D/g, '');
        global.ownerNumber = phoneNumber + '@s.whatsapp.net';

        setTimeout(async () => {
            try {
                let code = await conn.requestPairingCode(phoneNumber);
                code = code?.match(/.{1,4}/g)?.join("-") || code;
                console.log(chalk.bold.white(chalk.bgMagenta(`\n✧ CÓDIGO: ${code} ✧\n`)));
            } catch (err) {
                console.log(chalk.red('Error al pedir código. Reintenta en 1 min.'));
            }
        }, 3000);
    }

    conn.ev.on('creds.update', saveCreds);

    conn.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
            if (reason !== DisconnectReason.loggedOut) {
                console.log(chalk.yellow('🔄 Reintentando conexión...'));
                startBot();
            } else {
                console.log(chalk.red('❌ Sesión cerrada. Borra sesion_bot.'));
            }
        } else if (connection === 'open') {
            console.log(chalk.bold.green('\n✅ VINCULADO CON MAC OS'));
            const target = global.ownerNumber || conn.user.id.split(':')[0] + '@s.whatsapp.net';
            await conn.sendMessage(target, { text: '✨ *Bot vinculado y listo!* ✨' });
        }
    });

    conn.ev.on('messages.upsert', async (chatUpdate) => {
        const m = chatUpdate.messages[0];
        if (!m || !m.message) return;
        await handler(conn, m);
    });
}

startBot();
