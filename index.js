import makeWASocket, { useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import pino from 'pino';
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import chalk from 'chalk';
import { handler } from './handler.js';

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const question = (text) => new Promise((resolve) => rl.question(text, resolve));

global.plugins = {};
global.ownerNumber = ""; 

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
        printQRInTerminal: false
    });

    // Lógica de Vincular con Código
    if (!conn.authState.creds.registered) {
        console.log(chalk.yellow('\n--------------------------------------------'));
        console.log(chalk.white('   SISTEMA DE VINCULACIÓN POR CÓDIGO'));
        console.log(chalk.yellow('--------------------------------------------'));
        const phoneNumber = await question(chalk.cyan(' > Introduce tu número (ej: 573001234567): '));
        global.ownerNumber = phoneNumber.trim() + '@s.whatsapp.net';
        
        setTimeout(async () => {
            let code = await conn.requestPairingCode(phoneNumber.trim());
            code = code?.match(/.{1,4}/g)?.join('-') || code;
            console.log(chalk.white('\n🔗 TU CÓDIGO DE VINCULACIÓN ES: ') + chalk.bold.green(code));
            console.log(chalk.gray('Pégalo en tu WhatsApp > Dispositivos vinculados\n'));
        }, 3000);
    }

    conn.ev.on('creds.update', saveCreds);

    conn.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;
        
        if (connection === 'close') {
            const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
            
            // Mensaje de Reconexión en Consola
            console.log(chalk.red(`\n[!] Conexión cerrada. Razón: ${reason}`));
            console.log(chalk.blue('🔄 Reconectando...'));
            
            if (reason !== DisconnectReason.loggedOut) {
                startBot();
            } else {
                console.log(chalk.red('❌ Sesión cerrada permanentemente. Borra la carpeta sesion_bot y reinicia.'));
            }
        } else if (connection === 'open') {
            console.log(chalk.green('\n✅ [BOT ONLINE] Conectado con éxito.'));
            
            if (global.ownerNumber) {
                await conn.sendMessage(global.ownerNumber, { 
                    text: '🚀 *¡Bot Conectado!*\n\nYa puedes usar los comandos. El sistema de reconexión automática está activo.' 
                });
            }
        }
    });

    conn.ev.on('messages.upsert', async m => {
        await handler(conn, m);
    });
}

startBot();
