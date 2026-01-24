import { useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, makeCacheableSignalKeyStore } from '@whiskeysockets/baileys';
import makeWASocket from '@whiskeysockets/baileys';
import pino from 'pino';
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import chalk from 'chalk';
import { Boom } from '@hapi/boom';
import { handler } from './handler.js';

// Configuración de la interfaz de lectura para la consola
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const question = (texto) => new Promise((resolver) => rl.question(texto, resolver));

global.plugins = {};
global.ownerNumber = ""; // Se guardará el número ingresado para la notificación

async function startBot() {
    // 1. CARGA DINÁMICA DE PLUGINS
    const pluginFolder = path.join(process.cwd(), 'plugins');
    if (!fs.existsSync(pluginFolder)) fs.mkdirSync(pluginFolder);
    const pluginFiles = fs.readdirSync(pluginFolder).filter(file => file.endsWith('.js'));
    
    for (const file of pluginFiles) {
        try {
            const module = await import(`./plugins/${file}?update=${Date.now()}`);
            global.plugins[file] = module.default || module;
        } catch (e) {
            console.error(`Error cargando plugin ${file}:`, e);
        }
    }
    console.log(chalk.cyan(`✦ ${Object.keys(global.plugins).length} Plugins cargados correctamente.`));

    // 2. CONFIGURACIÓN DE SESIÓN Y CONEXIÓN
    const folderSesion = 'sesion_bot';
    const { state, saveCreds } = await useMultiFileAuthState(folderSesion);
    const { version } = await fetchLatestBaileysVersion();

    const connectionOptions = {
        version,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false, // Forzado para usar Pairing Code en Pterodactyl
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" })),
        },
        browser: ['Ubuntu', 'Edge', '110.0.1587.56'],
        markOnlineOnConnect: true,
    };

    const conn = makeWASocket.default(connectionOptions);

    // 3. SISTEMA DE PAIRING CODE (CÓDIGO DE 8 DÍGITOS)
    if (!conn.authState.creds.registered) {
        console.log(chalk.bgCyan.black('\n⌨  VINCULACIÓN POR CÓDIGO DE TEXTO '));
        let phoneNumber = await question(chalk.bold.greenBright('✦ Ingresa tu número de WhatsApp con código de país (Ej: 573001234567):\n--> '));
        phoneNumber = phoneNumber.replace(/\D/g, '');
        global.ownerNumber = phoneNumber + '@s.whatsapp.net';

        setTimeout(async () => {
            let code = await conn.requestPairingCode(phoneNumber);
            code = code?.match(/.{1,4}/g)?.join("-") || code;
            console.log(chalk.bold.white(chalk.bgMagenta(`\n✧ CÓDIGO DE VINCULACIÓN: ${code} ✧`)));
            console.log(chalk.gray('Introdúcelo en WhatsApp > Dispositivos vinculados > Vincular con número\n'));
        }, 3000);
    }

    // 4. GESTIÓN DE EVENTOS
    conn.ev.on('creds.update', saveCreds);

    conn.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;

        if (connection === 'close') {
            const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
            console.log(chalk.bold.red(`\n[!] Conexión cerrada. Razón: ${reason}`));
            
            if (reason !== DisconnectReason.loggedOut) {
                console.log(chalk.bold.blue('🔄 Reconectando...'));
                startBot();
            } else {
                console.log(chalk.bold.redBright(`\n❌ Sesión terminada. Borra la carpeta ${folderSesion} y reinicia.`));
            }
        } 
        
        if (connection === 'open') {
            console.log(chalk.bold.green('\n❀ BOT CONECTADO Y ONLINE ❀'));
            
            // ENVÍO DE NOTIFICACIÓN DE ÉXITO
            const target = global.ownerNumber || conn.user.id.split(':')[0] + '@s.whatsapp.net';
            await conn.sendMessage(target, { 
                text: `✅ *¡Conexión Exitosa!*\n\nEl bot ya está funcionando en Pterodactyl.\n\n*Estado:* Online\n*Plugins:* ${Object.keys(global.plugins).length}` 
            });
            console.log(chalk.cyanBright(`📩 Notificación enviada a: ${target}`));
        }
    });

    conn.ev.on('messages.upsert', async (chatUpdate) => {
        try
