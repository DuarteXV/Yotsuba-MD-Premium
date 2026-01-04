const handler = async (m, {conn, text}) => {
  const user = global.db.data.users[m.sender];
  user.afk = + new Date;
  user.afkReason = text;
  
  conn.reply(m.chat, `${emoji} *El Usuario ${await conn.getName(m.sender)} Estará Inactivo*\n\n*Motivo: ${text ? text : 'Sin Especificar!'}*`, m);
};

handler.help = ['afk [alasan]'];
handler.tags = ['main'];
handler.command = ['afk'];
handler.group = true;
handler.register = true;

export default handler;