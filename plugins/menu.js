const plugin = {
    command: ['menu', 'help', 'ayuda'],
    exec: async (conn, msg, { usedPrefix }) => {
        const chat = msg.key.remoteJid;
        let menu = `
╭──『 **MENU** 』──
│ 🦈 ${usedPrefix}ping
│ 🦈 ${usedPrefix}menu
╰────────────────`.trim();

        await conn.sendMessage(chat, { text: menu }, { quoted: msg });
    },
    group: false,
    admin: false
};

export default plugin;
