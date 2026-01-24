import { performance } from 'perf_hooks';

const plugin = {
    command: ['ping'], // Tu handler busca en arrays o regex
    exec: async (conn, msg, { args }) => {
        let start = performance.now();
        const chat = msg.key.remoteJid;
        
        let { key } = await conn.sendMessage(chat, { text: '🚀 Probando...' }, { quoted: msg });
        let end = performance.now();
        let speed = (end - start).toFixed(2);

        await conn.sendMessage(chat, { 
            text: `🏓 *Pong!*\nLatencia: ${speed} ms`, 
            edit: key 
        });
    },
    group: false, // Funciona en todos lados
    admin: false
};

export default plugin;
