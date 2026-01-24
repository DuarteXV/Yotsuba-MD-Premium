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
    // Carga de Plugins
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

    const conn = makeWASocket.default({
        version,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" })),
        },
        browser: ['Ubuntu', 'Edge', '110.0.1587.56'],
        markOnlineOnConnect: true,
    });

    // Vincular por Código
    if (!conn.authState.creds.registered) {
        console.log(chalk.bgCyan.black('\n⌨  VINCULACIÓN POR CÓDIGO '));
        let phoneNumber = await question(chalk.bold.greenBright('✦ Ingresa tu número (Ej: 573001234567):\n--> '));
        phoneNumber = phoneNumber.replace(/\D/g, '');
        global.ownerNumber = phoneNumber + '@s.whatsapp.net';

        setTimeout(async () => {
            let code = await conn.requestPairingCode(phoneNumber);
            code = code?.match(/.{1,4}/g)?.join("-") || code;
            console.log(chalk.bold.white(chalk.bgMagenta(`\n✧ CÓDIGO: ${code} ✧\n`)));
        }, 3000);
    }

    conn.ev.on('creds.update', saveCreds);

    conn.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
            if (reason !== DisconnectReason.loggedOut) {
                console.log(chalk.bold.blue('🔄 Reconectando...'));
                startBot();
            }
        } else if (connection === 'open') {
            console.log(chalk.bold.green('\n❀ CONECTADO ❀'));
            const target = global.ownerNumber || conn.user.id.split(':')[0] + '@s.whatsapp.net';
            await conn.sendMessage(target, { text: '✅ *Bot Online en Pterodactyl*' });
        }
    });

    conn.ev.on('messages.upsert', async (chatUpdate) => {
        try {
            const m = chatUpdate.messages[0];
            if (!m || !m.message) return;
            await handler(conn, m);
        } catch (err) {
            console.error(err);
        }
    });

    return conn;
}

startBot().catch(console.error);

process.on('uncaughtException', console.error);
process.on('unhandledRejection', console.error);
