let handler = async (m, { conn, usedPrefix }) => {
  const users = global.db.data.users
  
  
  const rpgUsers = Object.entries(users)
    .filter(([jid, user]) => user.rpgData && user.rpgData.level > 1)
    .map(([jid, user]) => ({
      jid,
      name: user.name || jid.split('@')[0],
      level: user.rpgData.level,
      wins: user.rpgData.wins,
      losses: user.rpgData.losses,
      coins: user.coin || 0
    }))
    .sort((a, b) => {
      
      if (b.level !== a.level) return b.level - a.level
      return b.wins - a.wins
    })
    .slice(0, 10) 
  
  if (rpgUsers.length === 0) {
    return m.reply(`
🎲 *RANKING RPG* 🎲

No hay aventureros registrados aún.

¡Sé el primero en usar \`${usedPrefix}aventura\` para comenzar tu historia!
    `.trim())
  }
  
  let ranking = `🎲 *RANKING DE AVENTUREROS* 🎲\n\n`
  
  rpgUsers.forEach((user, index) => {
    const position = index + 1
    const trophy = position === 1 ? '🥇' : position === 2 ? '🥈' : position === 3 ? '🥉' : '🏅'
    const totalBattles = user.wins + user.losses
    const winRate = totalBattles > 0 ? Math.round((user.wins / totalBattles) * 100) : 0
    
    ranking += `${trophy} **#${position} ${user.name}**\n`
    ranking += `🏆 Nivel ${user.level} | 💰 ${user.coins} monedas\n`
    ranking += `⚔️ ${user.wins}V-${user.losses}D (${winRate}%)\n\n`
  })
  
  
  const currentUserIndex = rpgUsers.findIndex(user => user.jid === m.sender)
  if (currentUserIndex !== -1) {
    ranking += `📍 *Tu posición:* #${currentUserIndex + 1}\n\n`
  } else {
    ranking += `📍 *Tu posición:* No clasificado\n\n`
  }
  
  ranking += `🎮 *Comandos:*\n`
  ranking += `• \`${usedPrefix}aventura\` - Ir de aventura\n`
  ranking += `• \`${usedPrefix}rpgstats\` - Tu perfil RPG\n`
  ranking += `• \`${usedPrefix}toparpg\` - Este ranking`
  
  await m.reply(ranking)
}

handler.help = ['toparpg', 'rpgranking']
handler.tags = ['rpg']
handler.command = /^(toparpg|rpgranking|rankingprg)$/i
handler.register = true

export default handler

