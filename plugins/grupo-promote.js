var handler = async (m, { conn, usedPrefix, command, text }) => {
  let user

  if (m.quoted) {
    user = m.quoted.sender
  } else if (m.mentionedJid && m.mentionedJid[0]) {
    user = m.mentionedJid[0]
  } else if (text) {
    let number = text.replace(/[^0-9]/g, '')
    if (number.length < 11 || number.length > 13) {
      return conn.reply(m.chat, `${emoji} Número inválido. Debe tener entre 11 y 13 dígitos.`, m)
    }
    user = number + '@s.whatsapp.net'
  } else {
    return conn.reply(m.chat, `${emoji} Debes mencionar a un usuario, responder su mensaje o escribir su número.`, m)
  }

  try {
    await conn.groupParticipantsUpdate(m.chat, [user], 'promote')
    conn.reply(m.chat, `${done} Fue agregado como admin del grupo con éxito.`, m)
  } catch (e) {
    conn.reply(m.chat, `${emoji} Error al promover al usuario.`, m)
  }
}
handler.help = ['promote']
handler.tags = ['grupo']
handler.command = ['promote','darpija', 'promover']
handler.group = true
handler.admin = true
handler.botAdmin = true
handler.fail = null

export default handler
