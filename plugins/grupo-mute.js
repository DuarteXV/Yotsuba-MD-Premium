import fetch from 'node-fetch';

const handler = async (m, { conn, command, text, isAdmin, isOwner }) => {
  const userId = m.mentionedJid?.[0] || m.quoted?.sender || text;

  // Validación: solo admins o owner
  if (!isAdmin && !isOwner) {
    throw '❌ Solo quienes tienen la visión del juego pueden usar este comando.';
  }

  if (!userId) {
    throw '📍 Debes mencionar a un jugador para ajustar su participación en el campo.';
  }

  const user = global.db.data.users[userId] || {};
  user.mute = user.mute || false;

  if (command === 'mute') {
    if (user.mute) throw '⚠️ Este jugador ya está siendo marcado de cerca.';
    user.mute = true;
    await conn.reply(
      m.chat,
      `🔇 *Usuario silenciado.*\n⚽ Su voz ha sido interceptada. Ahora debe observar y aprender del juego.`,
      m
    );
  }

  if (command === 'unmute') {
    if (!user.mute) throw '⚠️ Este jugador ya está participando activamente.';
    user.mute = false;
    await conn.reply(
      m.chat,
      `🔊 *Usuario activado.*\n🎯 Puede volver a comunicarse en el campo. Que su contribución sea estratégica.`,
      m
    );
  }

  global.db.data.users[userId] = user;
};

// Interceptar mensajes de usuarios silenciados
handler.before = async (m, { conn }) => {
  const sender = m.sender;
  const isMuted = global.db.data.users[sender]?.mute;

  if (isMuted && !m.key.fromMe) {
    try {
      await conn.sendMessage(m.chat, { delete: m.key });
    } catch (e) {
      console.error('Error al interceptar mensaje:', e);
    }
  }
};

handler.command = ['mute', 'unmute'];
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;