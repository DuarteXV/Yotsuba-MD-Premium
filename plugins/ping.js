import { performance } from 'perf_hooks';

const plugin = {
    command: ['ping'], // IMPORTANTE: Debe ser un Array para tu handler.js
    exec: async (conn, msg, { args }) => {
        const chat = msg.key.remoteJid;
        const start = performance.now();
        
        // Enviamos mensaje inicial
        const { key } = await conn.sendMessage(chat, { text: '🚀 Mindiéndo latencia...' }, { quoted: msg });
        
        const end = performance.now();
        const speed = (end - start).toFixed(2);

        // Editamos para mostrar el resultado
        await conn.sendMessage(chat, { 
            text: `🏓 *Pong!* \nLatencia: ${speed} ms`, 
            edit: key 
        });
    },
    group: false,
    admin: false
};

export default plugin;
