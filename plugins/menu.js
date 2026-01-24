let handler = async (m, { conn, usedPrefix, isGroup }) => {
    let menu = `
╭──『 **MENÚ** 』──
│ 👤 *Usuario:* ${m.pushName || 'User'}
│ 🛠️ *Prefijo:* ${usedPrefix}
│ 🏛️ *Ámbito:* ${isGroup ? 'Grupo' : 'Chat Privado'}
╰────────────────

╭──『 **COMANDOS** 』──
│ 🦈 ${usedPrefix}ping
│ 🦈 ${usedPrefix}menu
╰────────────────`.trim()

    await conn.sendMessage(m.chat, { text: menu }, { quoted: m })
}

handler.command = /^(menu|help|ayuda)$/i 
export default handler
