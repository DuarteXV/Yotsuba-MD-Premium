let handler = async (m, { conn, usedPrefix }) => {
    let menu = `
╭──『 **MENÚ PRINCIPAL** 』──
│ 🦈 *${usedPrefix}ping*
│ 🦈 *${usedPrefix}menu*
╰───────────────────`.trim()

    await conn.sendMessage(m.chat, { text: menu }, { quoted: m })
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = /^(menu|help|ayuda)$/i

// Propiedades de acceso
handler.group = false    // Funciona en privado y grupos
handler.admin = false    // Cualquiera puede pedir el menú
handler.owner = false    // No es exclusivo del creador

export default handler
