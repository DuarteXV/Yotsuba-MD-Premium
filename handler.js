import terminalPrint from './lib/print.js';

export const handler = async (conn, m) => {
    try {
        if (!m.messages) return;
        terminalPrint(m);

        const msg = m.messages[0];
        if (!msg.message || msg.key.fromMe) return;

        const chat = msg.key.remoteJid;
        const isGroup = chat.endsWith('@g.us');
        const text = (msg.message.conversation || msg.message.extendedTextMessage?.text || '').trim();

        if (!text.startsWith('.')) return;

        const args = text.slice(1).trim().split(/ +/);
        const command = args.shift().toLowerCase();

        // Variables de grupo
        const groupMetadata = isGroup ? await conn.groupMetadata(chat) : null;
        const participants = isGroup ? groupMetadata.participants : [];
        const userAdmin = isGroup ? participants.find(u => u.id === msg.key.participant || msg.key.remoteJid)?.admin : false;

        for (let name in global.plugins) {
            let plugin = global.plugins[name];
            
            // Verificamos si el comando coincide (usando regex o array)
            const isCmd = plugin.command instanceof RegExp ? plugin.command.test(command) : plugin.command?.includes(command);
            
            if (isCmd) {
                // --- VALIDACIONES ---
                if (plugin.group && !isGroup) {
                    await conn.sendMessage(chat, { text: '⚠️ Este comando es solo para grupos.' }, { quoted: msg });
                    continue;
                }
                if (plugin.admin && !userAdmin) {
                    await conn.sendMessage(chat, { text: '⚠️ Solo los administradores pueden usar esto.' }, { quoted: msg });
                    continue;
                }

                // Ejecutar pasándole todas las herramientas
                await plugin.exec(conn, msg, { 
                    text, 
                    command, 
                    args, 
                    isGroup, 
                    isAdmin: !!userAdmin,
                    usedPrefix: '.' 
                });
                break; 
            }
        }
    } catch (err) {
        console.error('Error en Handler:', err);
    }
};
