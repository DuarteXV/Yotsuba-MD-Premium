import terminalPrint from './lib/print.js';

export const handler = async (conn, m) => {
    try {
        if (!m.messages) return;
        
        // Ejecutar el print visual
        terminalPrint(m);

        const msg = m.messages[0];
        if (!msg.message || msg.key.fromMe) return;

        const text = (msg.message.conversation || 
                     msg.message.extendedTextMessage?.text || 
                     '').trim();
        
        // Si no empieza con punto, no es comando
        if (!text.startsWith('.')) return;

        const args = text.slice(1).trim().split(/ +/);
        const command = args.shift().toLowerCase();

        // Ejecutor de plugins
        for (let name in global.plugins) {
            let plugin = global.plugins[name];
            if (plugin.command && plugin.command.includes(command)) {
                await plugin.exec(conn, msg, { text, command, args });
                break; 
            }
        }

    } catch (err) {
        console.error('Error en Handler:', err);
    }
};
