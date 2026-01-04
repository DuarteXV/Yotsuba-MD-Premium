var handler = async (m, { conn, usedPrefix, command, text }) => {
  let user

  if (m.mentionedJid && m.mentionedJid[0]) {
    user = m.mentionedJid[0]
  } else if (m.quoted) {
    user = m.quoted.sender
  } else if (text) {
    let number = text.replace(/[^0-9]/g, '')
    if (number.length >= 11 && number.length <= 13) {
      user = number + '@s.whatsapp.net'
    }
  }

  if (!user) {
    return conn.reply(m.chat, `${emoji} Debes mencionar o responder a un usuario para degradarlo de administrador.`, m)
  }

  try {
    await conn.groupParticipantsUpdate(m.chat, [user], 'demote')
    conn.reply(m.chat, `${emoji2} Fue descartado como admin.`, m)
  } catch (e) {
    console.error(e)
    conn.reply(m.chat, `${emoji} Error al degradar al usuario. Verifica que sea administrador.`, m)
  }
}
handler.help = ['demote']
handler.tags = ['grupo']
handler.command = ['demote','quitarpija', 'degradar']
handler.group = true
handler.admin = true
handler.botAdmin = true
handler.fail = null

export default handler
