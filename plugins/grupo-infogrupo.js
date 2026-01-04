const handler = async (m, {conn, participants, groupMetadata}) => {
  const pp = await conn.profilePictureUrl(m.chat, 'image').catch((_) => global.icono);
  const { antiLink, detect, welcome, modoadmin, autoRechazar, nsfw, autoAceptar, reaction, isBanned, antifake } = global.db.data.chats[m.chat]
  const groupAdmins = participants.filter((p) => p.admin)
  const listAdmin = groupAdmins.map((v, i) => `${i + 1}. @${v.id.split('@')[0]}`).join('\n')
  const owner = groupMetadata.owner || groupAdmins.find((p) => p.admin === 'superadmin')?.id || m.chat.split`-`[0] + '@s.whatsapp.net'
  const text = `⚽ *･ﾟ INFORMACIÓN DEL CAMPO BLUE LOCK ﾟ･* 🔥
🎯 *ID del Campo:* ${groupMetadata.id}
🏆 *Nombre del Equipo:* ${groupMetadata.subject}
👥 *Jugadores en Cancha:* ${participants.length} Depredadores
👑 *Director Técnico:* @${owner.split('@')[0]}
⚽ *Capitanes del Equipo:*
${listAdmin}

🔥 *CONFIGURACIÓN DEL ENTRENAMIENTO*

⚽ *${botname}* » ${isBanned ? 'EXPULSADO' : 'EN ACTIVO'}
🎯 *Bienvenida Blue Lock:* ${welcome ? 'ACTIVADO' : 'DESACTIVADO'}
🔍 *Detección de Talentos:* ${detect ? 'ACTIVADO' : 'DESACTIVADO'}  
🚫 *Anti-Distracciones:* ${antiLink ? 'ACTIVADO' : 'DESACTIVADO'} 
✅ *Auto-Aceptar Retadores:* ${autoAceptar ? 'ACTIVADO' : 'DESACTIVADO'}
❌ *Auto-Rechazar Débiles:* ${autoRechazar ? 'ACTIVADO' : 'DESACTIVADO'}
🔞 *Contenido Intenso:* ${nsfw ? 'PERMITIDO' : 'PROHIBIDO'}
💎 *Modo Estratégico:* ${modoadmin ? 'ACTIVADO' : 'DESACTIVADO'}
⚡ *Reacciones Competitivas:* ${reaction ? 'ACTIVADO' : 'DESACTIVADO'}
🛡️ *Anti-Imitadores:* ${antifake ? 'ACTIVADO' : 'DESACTIVADO'}

📝 *FILOSOFÍA DEL EQUIPO:*
${groupMetadata.desc?.toString() || 'Sin filosofía definida...'}`.trim();
  conn.sendFile(m.chat, pp, 'img.jpg', text, m, false, {mentions: [...groupAdmins.map((v) => v.id), owner]});
};
handler.help = ['infogrupo', 'infocampo'];
handler.tags = ['grupo'];
handler.command = ['infogrupo', 'gp', 'infocampo', 'blueLockInfo'];
handler.register = true
handler.group = true;

export default handler;