let handler = async (m, { conn, usedPrefix }) => {
  const user = global.db.data.users[m.sender]
  
  
  if (!user.rpgData) {
    user.rpgData = {
      level: 1,
      hp: 100,
      maxHp: 100,
      attack: 20,
      defense: 10,
      exp: 0,
      wins: 0,
      losses: 0,
      lastAdventure: 0
    }
  }
  
  const rpg = user.rpgData
  const coins = user.coin || 0
  
  
  const now = Date.now()
  const cooldownTime = rpg.lastAdventure + 300000 
  const canAdventure = now >= cooldownTime
  
  let timeLeft = ""
  if (!canAdventure) {
    const remaining = Math.ceil((cooldownTime - now) / 1000 / 60)
    timeLeft = `⏰ Próxima aventura en: ${remaining} minutos`
  } else {
    timeLeft = `✅ ¡Listo para aventura!`
  }
  
  
  const totalBattles = rpg.wins + rpg.losses
  const winRate = totalBattles > 0 ? Math.round((rpg.wins / totalBattles) * 100) : 0
  
  
  const hpBar = createProgressBar(rpg.hp, rpg.maxHp, 10)
  const expBar = createProgressBar(rpg.exp, rpg.level * 100, 10)
  
  const statsMessage = `
🎲 *PERFIL RPG* 🎲

👤 *Aventurero:* ${m.pushName || m.sender.split('@')[0]}
🏆 *Nivel:* ${rpg.level}
💰 *Monedas:* ${coins}

❤️ *Salud:* ${rpg.hp}/${rpg.maxHp}
${hpBar}

⭐ *Experiencia:* ${rpg.exp}/${rpg.level * 100}
${expBar}

⚔️ *Estadísticas de Combate:*
• Ataque: ${rpg.attack}
• Defensa: ${rpg.defense}

🏁 *Récord de Batallas:*
• Victorias: ${rpg.wins}
• Derrotas: ${rpg.losses}
• Ratio de victoria: ${winRate}%

${timeLeft}

📝 *Comandos:*
• \`${usedPrefix}aventura\` - Ir de aventura
• \`${usedPrefix}rpgstats\` - Ver este perfil
• \`${usedPrefix}toparpg\` - Ranking de aventureros

🎮 *Consejos:*
• Las aventuras tienen cooldown de 5 minutos
• Puedes encontrar jefes (5% chance) con mejores recompensas
• Al subir de nivel aumentan tus estadísticas
• Tu HP se restaura automáticamente entre aventuras
  `.trim()
  
  await m.reply(statsMessage)
}


function createProgressBar(current, max, length = 10) {
  const percentage = Math.min(current / max, 1)
  const filled = Math.round(percentage * length)
  const empty = length - filled
  
  const bar = '█'.repeat(filled) + '░'.repeat(empty)
  const percent = Math.round(percentage * 100)
  
  return `[${bar}] ${percent}%`
}

handler.help = ['rpgstats', 'rpgperfil']
handler.tags = ['rpg']
handler.command = /^(rpgstats|rpgperfil|perfilrpg)$/i
handler.register = true

export default handler

