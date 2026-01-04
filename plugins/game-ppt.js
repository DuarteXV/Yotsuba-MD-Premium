const handler = async (m, {conn, text, command, usedPrefix, args}) => {
  const pp = 'https://telegra.ph/file/c7924bf0e0d839290cc51.jpg';

  // 60000 = 1 minuto // 30000 = 30 segundos // 15000 = 15 segundos // 10000 = 10 segundos
  const time = global.db.data.users[m.sender].wait + 10000;
  if (new Date - global.db.data.users[m.sender].wait < 10000) throw `⚽🔥 Necesitas recuperar energía entre duelos! Espera ${Math.floor((time - new Date()) / 1000)} segundos antes de jugar de nuevo 🏃♂️`;

  if (!args[0]) return conn.reply(m.chat, `⚽ *DUELO BLUE LOCK* 🔥\n\n🎯 *¡Enfrentamiento en el campo!* ⚽\n💎 *◉ ${usedPrefix + command} piedra* 🗿\n💎 *◉ ${usedPrefix + command} papel* 📄\n💎 *◉ ${usedPrefix + command} tijera* ✂️\n\n> Elige tu arma estratégica...`, m);
 
  let astro = Math.random();
  if (astro < 0.34) {
    astro = 'piedra';
  } else if (astro > 0.34 && astro < 0.67) {
    astro = 'tijera';
  } else {
    astro = 'papel';
  }
  const textm = text.toLowerCase();
  
  if (textm == astro) {
    global.db.data.users[m.sender].exp += 500;
    m.reply(`⚔️ *¡Empate táctico!* ⚔️\n\n🎯 *Tu jugada: ${textm}*\n⚽ *Rival: ${astro}*\n💎 *Experiencia ganada: +500 XP*`);
  } else if (textm == 'papel') {
    if (astro == 'piedra') {
      global.db.data.users[m.sender].exp += 1000;
      m.reply(`🏆 *¡Victoria absoluta!* 🏆\n\n🎯 *Tu jugada: ${textm}*\n⚽ *Rival: ${astro}*\n💎 *Experiencia ganada: +1000 XP*\n\n> ¡Tu visión directa fue superior!`);
    } else {
      global.db.data.users[m.sender].exp -= 300;
      m.reply(`💀 *¡Derrota estratégica!* 💀\n\n🎯 *Tu jugada: ${textm}*\n⚽ *Rival: ${astro}*\n⚠️ *Experiencia perdida: -300 XP*\n\n> Necesitas entrenar tu ego...`);
    }
  } else if (textm == 'tijera') {
    if (astro == 'papel') {
      global.db.data.users[m.sender].exp += 1000;
      m.reply(`🏆 *¡Victoria absoluta!* 🏆\n\n🎯 *Tu jugada: ${textm}*\n⚽ *Rival: ${astro}*\n💎 *Experiencia ganada: +1000 XP*\n\n> ¡Tu instinto de depredador funcionó!`);
    } else {
      global.db.data.users[m.sender].exp -= 300;
      m.reply(`💀 *¡Derrota estratégica!* 💀\n\n🎯 *Tu jugada: ${textm}*\n⚽ *Rival: ${astro}*\n⚠️ *Experiencia perdida: -300 XP*\n\n> Tu táctica fue leída...`);
    }
  } else if (textm == 'piedra') {
    if (astro == 'tijera') {
      global.db.data.users[m.sender].exp += 1000;
      m.reply(`🏆 *¡Victoria absoluta!* 🏆\n\n🎯 *Tu jugada: ${textm}*\n⚽ *Rival: ${astro}*\n💎 *Experiencia ganada: +1000 XP*\n\n> ¡Golpe directo al ego rival!`);
    } else {
      global.db.data.users[m.sender].exp -= 300;
      m.reply(`💀 *¡Derrota estratégica!* 💀\n\n🎯 *Tu jugada: ${textm}*\n⚽ *Rival: ${astro}*\n⚠️ *Experiencia perdida: -300 XP*\n\n> Tu hambre de victoria no fue suficiente...`);
    }
  }
  global.db.data.users[m.sender].wait = new Date * 1;
};

handler.help = ['ppt', 'duelo'];
handler.tags = ['games'];
handler.command = ['ppt', 'duelo'];
handler.group = true;
handler.register = true;

export default handler;