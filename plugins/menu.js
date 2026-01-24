const plugin = {
    command: ['menu', 'help'],
    exec: async (conn, m) => {
        const info = `📌 *SISTEMA DE PLUGINS ACTIVO*\n\nEste bot está corriendo en Pterodactyl con éxito.`;
        await conn.sendMessage(m.key.remoteJid, { text: info }, { quoted: m });
    }
};

export default plugin;
