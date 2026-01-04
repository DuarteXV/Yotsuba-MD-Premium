const handler = async (m, { isPrems, conn }) => {
  
  if (!global.db) {
    global.db = { data: { users: {} } };
  }
  if (!global.db.data) {
    global.db.data = { users: {} };
  }
  if (!global.db.data.users) {
    global.db.data.users = {};
  }
  
  
  if (!global.db.data.users[m.sender]) {
    global.db.data.users[m.sender] = {
      coin: 0,
      diamonds: 0,
      joincount: 0,
      exp: 0,
      lastcofre: 0
    };
  }

  const user = global.db.data.users[m.sender];
  const lastCofreTime = user.lastcofre || 0;
  const timeToNextCofre = lastCofreTime + 86400000;

  if (Date.now() < timeToNextCofre) {
    const tiempoRestante = timeToNextCofre - Date.now();
    const mensajeEspera = `⚽️ ¡Ya reclamaste tu cofre  de  hoy! ⚽️\n⏰️ Regresa en: *${msToTime(tiempoRestante)}* para obtener más tesoros . ✨`;
    await conn.sendMessage(m.chat, { text: mensajeEspera }, { quoted: m });
    return;
  }

  const img = './src/catalogo.jpg';
  const dia = Math.floor(Math.random() * 100);
  const tok = Math.floor(Math.random() * 10);
  const ai = Math.floor(Math.random() * 40);
  const expp = Math.floor(Math.random() * 5000);


  user.coin = (user.coin || 0) + dia;
  user.diamonds = (user.diamonds || 0) + ai;
  user.joincount = (user.joincount || 0) + tok;
  user.exp = (user.exp || 0) + expp;
  user.lastcofre = Date.now();

  const texto = `
╭━〔 ⚽️ Cofre  de Isagi ⚽️ 〕⬣
┃🔥 *¡Obtienes Tesoros !*
┃✨ ¡Felicidades, delantero!
╰━━━━━━━━━━━━⬣

╭━〔 🔥 Nuevos Recursos  🔥 〕⬣
┃ *${dia} Monedas* 🏆
┃ *${tok} Tokens Virtuales* ⚜️
┃ *${ai} Cristales* 💎
┃ *${expp} Experiencia* ✨
╰━━━━━━━━━━━━⬣`;

  try {
    await conn.sendMessage(m.chat, { text: texto }, { quoted: m });
  } catch (error) {
    console.error('⚽️ Error al enviar el cofre:', error);
    await conn.reply(m.chat, '⚽️ Ocurrió un error al enviar el cofre, pero tus recompensas fueron guardadas.', m, global.rcanal);
  }
};

handler.help = ['cofre'];
handler.tags = ['rpg'];
handler.command = ['cofre'];
handler.level = 5;
handler.group = true;
handler.register = true;

export default handler;

function msToTime(duration) {
  const milliseconds = parseInt((duration % 1000) / 100);
  let seconds = Math.floor((duration / 1000) % 60);
  let minutes = Math.floor((duration / (1000 * 60)) % 60);
  let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  hours = (hours < 10) ? '0' + hours : hours;
  minutes = (minutes < 10) ? '0' + minutes : minutes;
  seconds = (seconds < 10) ? '0' + seconds : seconds;

  return `${hours} Horas ${minutes} Minutos`;
}

