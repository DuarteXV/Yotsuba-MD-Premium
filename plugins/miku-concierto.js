const VENUES = {
  local: {
    name: "🏠 Café Local",
    capacity: 50,
    cost: 0,
    baseEarnings: [10, 30],
    reputation: 5
  },
  club: {
    name: "🎭 Club Nocturno", 
    capacity: 200,
    cost: 100,
    baseEarnings: [50, 150],
    reputation: 15
  },
  theater: {
    name: "🎭 Teatro Municipal",
    capacity: 500,
    cost: 300,
    baseEarnings: [150, 400],
    reputation: 30
  },
  arena: {
    name: "🏟️ Arena Virtual",
    capacity: 2000,
    cost: 800,
    baseEarnings: [400, 1000],
    reputation: 50
  },
  stadium: {
    name: "🏟️ Estadio Holográfico",
    capacity: 10000,
    cost: 2000,
    baseEarnings: [1000, 3000],
    reputation: 100
  },
  global: {
    name: "🌐 Transmisión Global",
    capacity: 999999,
    cost: 5000,
    baseEarnings: [3000, 8000],
    reputation: 200
  }
}

const CONCERT_TYPES = {
  acoustic: {
    name: "🎸 Acústico",
    multiplier: 1.0,
    description: "Concierto íntimo con Miku"
  },
  electronic: {
    name: "🎛️ Electrónico",
    multiplier: 1.3,
    description: "Show con efectos visuales"
  },
  holographic: {
    name: "📱 Holográfico",
    multiplier: 1.5,
    description: "Espectáculo completamente virtual"
  },
  interactive: {
    name: "🎮 Interactivo",
    multiplier: 1.7,
    description: "Los fans pueden participar"
  }
}

const SPECIAL_EVENTS = [
  {
    name: "💙 Fan Incondicional",
    description: "Un fan mega donó durante el concierto",
    bonus: 500,
    chance: 0.15
  },
  {
    name: "🎵 Canción Viral",
    description: "Una de tus canciones se volvió trending",
    bonus: 300,
    chance: 0.1
  },
  {
    name: "📱 Stream Explota",
    description: "El stream alcanzó números récord",
    bonus: 200,
    chance: 0.2
  },
  {
    name: "🎤 Voz Perfecta",
    description: "Miku estuvo en perfecto estado vocal",
    bonus: 150,
    chance: 0.25
  }
]

let handler = async (m, { conn, usedPrefix, command, text }) => {
  const user = global.db.data.users[m.sender]
  
 
  if (!user.mikuStudio) {
    return m.reply(`❌ Primero necesitas un estudio. Usa \`${usedPrefix}miku\` para empezar.`)
  }
  
  
  if (!user.mikuConcerts) {
    user.mikuConcerts = {
      totalConcerts: 0,
      totalAudience: 0,
      totalEarnings: 0,
      reputation: 0,
      lastConcert: 0,
      achievements: []
    }
  }
  
  const concerts = user.mikuConcerts
  const studio = user.mikuStudio
  const coins = user.coin || 0
  
  if (!text) {
    return mostrarConciertos(m, conn, usedPrefix, concerts, studio, coins)
  }
  
  const args = text.toLowerCase().split(' ')
  const action = args[0]
  
  switch (action) {
    case 'presentar':
    case 'tocar':
      return organizarConcierto(m, conn, args, concerts, studio, user)
    case 'historial':
    case 'shows':
      return mostrarHistorial(m, conn, concerts)
    case 'logros':
    case 'achievements':
      return mostrarLogros(m, conn, concerts)
    default:
      return m.reply(`❌ Acción no válida. Usa \`${usedPrefix}concierto\` para ver las opciones.`)
  }
}

async function mostrarConciertos(m, conn, usedPrefix, concerts, studio, coins) {
  const mikuStatus = getMikuConcertStatus(concerts, studio)
  
  const concertMessage = `
🎤 *CONCIERTOS VIRTUALES MIKU* 🎵

👤 *Manager:* ${m.pushName || m.sender.split('@')[0]}
🎭 *Estado de Miku:* ${mikuStatus.status}
💭 _${mikuStatus.description}_

📊 *Estadísticas de Conciertos:*
🎪 Conciertos realizados: ${concerts.totalConcerts}
👥 Audiencia total: ${concerts.totalAudience.toLocaleString()}
💰 Ganancias totales: ${concerts.totalEarnings} monedas
⭐ Reputación: ${concerts.reputation}
🏆 Logros: ${concerts.achievements.length}

💳 *Monedas actuales:* ${coins}
🎵 *Canciones disponibles:* ${studio.songs.length}

🎭 *Lugares disponibles:*
${Object.entries(VENUES).map(([key, venue]) => {
  const reqRep = venue.reputation
  const available = concerts.reputation >= reqRep
  return `${available ? '✅' : '❌'} \`${key}\` - ${venue.name} (${venue.capacity} personas) ${!available ? `[Req: ${reqRep} rep]` : ''}`
}).join('\n')}

🎵 *Tipos de show:*
${Object.entries(CONCERT_TYPES).map(([key, type]) => `• \`${key}\` - ${type.name} (x${type.multiplier})`).join('\n')}

🎼 *Comandos:*
• \`${usedPrefix}concierto presentar [lugar] [tipo]\` - Organizar concierto
• \`${usedPrefix}concierto historial\` - Ver conciertos pasados
• \`${usedPrefix}concierto logros\` - Ver tus logros

💡 *Ejemplo:* \`${usedPrefix}concierto presentar local acoustic\`
  `.trim()

  await conn.reply(m.chat, concertMessage, m)
}

async function organizarConcierto(m, conn, args, concerts, studio, user) {
  const venueKey = args[1]
  const typeKey = args[2] || 'acoustic'
  const now = Date.now()
  
  
  if (now - concerts.lastConcert < 7200000) {
    const remaining = Math.ceil((7200000 - (now - concerts.lastConcert)) / 60000)
    return m.reply(`⏰ Miku necesita descansar entre conciertos. Próximo show en ${remaining} minutos.`)
  }
  
  if (!venueKey || !VENUES[venueKey]) {
    const venues = Object.keys(VENUES).join(', ')
    return m.reply(`❌ Lugar no válido. Lugares disponibles: ${venues}`)
  }
  
  if (!CONCERT_TYPES[typeKey]) {
    const types = Object.keys(CONCERT_TYPES).join(', ')
    return m.reply(`❌ Tipo de concierto no válido. Tipos: ${types}`)
  }
  
  const venue = VENUES[venueKey]
  const concertType = CONCERT_TYPES[typeKey]
  
 
  if (concerts.reputation < venue.reputation) {
    return m.reply(`❌ No tienes suficiente reputación para este lugar. Necesitas ${venue.reputation} puntos.`)
  }
  

  if (studio.songs.length === 0) {
    return m.reply(`❌ Necesitas al menos una canción para dar un concierto. Usa \`${usedPrefix}miku crear\` primero.`)
  }
  
  
  if (user.coin < venue.cost) {
    return m.reply(`💸 No tienes suficientes monedas para este lugar. Necesitas ${venue.cost} monedas.`)
  }
  
  
  user.coin -= venue.cost
  
  
  const concertResult = simularConcierto(venue, concertType, studio, concerts)
  
  
  concerts.totalConcerts += 1
  concerts.totalAudience += concertResult.audience
  concerts.totalEarnings += concertResult.earnings
  concerts.reputation += concertResult.reputation
  concerts.lastConcert = now
  user.coin += concertResult.earnings
  
  
  verificarLogros(concerts, concertResult)
  
  
  const resultMessage = `
🎤 *¡CONCIERTO REALIZADO!* 🎵

🎭 *Lugar:* ${venue.name}
🎵 *Tipo:* ${concertType.name}
💭 ${concertType.description}

${concertResult.success ? '🎉 *¡CONCIERTO EXITOSO!* 🎉' : '😔 *El público no conectó mucho...*'}

📊 *Resultados:*
👥 Audiencia: ${concertResult.audience.toLocaleString()} personas
💰 Ganancias: ${concertResult.earnings} monedas
⭐ Reputación ganada: +${concertResult.reputation}
${venue.cost > 0 ? `💸 Costo del lugar: ${venue.cost} monedas` : ''}

${concertResult.specialEvent ? `🌟 *Evento Especial:* ${concertResult.specialEvent.name}\n💰 Bonus: +${concertResult.specialEvent.bonus} monedas\n💭 ${concertResult.specialEvent.description}\n` : ''}

💳 *Saldo actual:* ${user.coin} monedas
⭐ *Reputación total:* ${concerts.reputation}

${concertResult.newAchievement ? `🏆 *¡NUEVO LOGRO DESBLOQUEADO!*\n${concertResult.newAchievement}` : ''}
  `.trim()

  await conn.reply(m.chat, resultMessage, m)
}

function simularConcierto(venue, concertType, studio, concerts) {
  
  const songQuality = studio.songs.reduce((avg, song) => avg + song.views, 0) / studio.songs.length || 100
  const studioLevel = studio.level
  const reputation = concerts.reputation
  
  
  const baseAttendance = Math.random() * 0.6 + 0.4 
  const qualityBonus = Math.min(songQuality / 1000, 0.3) 
  const levelBonus = Math.min(studioLevel * 0.05, 0.2) 
  const repBonus = Math.min(reputation * 0.001, 0.15) 
  
  const attendanceRate = Math.min(baseAttendance + qualityBonus + levelBonus + repBonus, 1.0)
  const audience = Math.floor(venue.capacity * attendanceRate)
  
  
  const baseEarnings = Math.floor(Math.random() * (venue.baseEarnings[1] - venue.baseEarnings[0] + 1)) + venue.baseEarnings[0]
  const typeMultiplier = concertType.multiplier
  const audienceMultiplier = attendanceRate
  
  let earnings = Math.floor(baseEarnings * typeMultiplier * audienceMultiplier)
  
  
  let specialEvent = null
  for (let event of SPECIAL_EVENTS) {
    if (Math.random() < event.chance) {
      specialEvent = event
      earnings += event.bonus
      break
    }
  }
  
 
  const reputationGained = Math.floor((audience / venue.capacity) * venue.reputation * 0.5)
  
  return {
    audience,
    earnings,
    reputation: reputationGained,
    success: attendanceRate > 0.6,
    specialEvent,
    newAchievement: null 
  }
}

function getMikuConcertStatus(concerts, studio) {
  const totalShows = concerts.totalConcerts
  const reputation = concerts.reputation
  
  if (totalShows === 0) {
    return { status: "🎤 Debutante", description: "Lista para su primer concierto" }
  } else if (totalShows < 5) {
    return { status: "🌟 Novata", description: "Ganando experiencia en el escenario" }
  } else if (totalShows < 15) {
    return { status: "🎵 Cantante", description: "Conocida por algunos fans" }
  } else if (reputation < 200) {
    return { status: "🎭 Artista", description: "Reconocida en la escena local" }
  } else if (reputation < 500) {
    return { status: "⭐ Estrella", description: "Famosa en todo el país" }
  } else {
    return { status: "👑 Diva Virtual", description: "Leyenda mundial de los conciertos" }
  }
}

function verificarLogros(concerts, result) {
  const newAchievements = []
  
  
  if (result.audience >= 1000 && !concerts.achievements.includes('big_crowd')) {
    concerts.achievements.push('big_crowd')
    newAchievements.push('🏟️ "Multitudes" - Más de 1000 personas en un concierto')
  }
  
  if (result.audience >= 5000 && !concerts.achievements.includes('massive_crowd')) {
    concerts.achievements.push('massive_crowd')
    newAchievements.push('🌟 "Fenómeno" - Más de 5000 personas en un concierto')
  }
  
  
  if (concerts.totalConcerts >= 10 && !concerts.achievements.includes('veteran')) {
    concerts.achievements.push('veteran')
    newAchievements.push('🎤 "Veterana" - 10 conciertos realizados')
  }
  
  if (concerts.totalConcerts >= 50 && !concerts.achievements.includes('legend')) {
    concerts.achievements.push('legend')
    newAchievements.push('👑 "Leyenda" - 50 conciertos realizados')
  }
  
  
  if (result.earnings >= 1000 && !concerts.achievements.includes('big_money')) {
    concerts.achievements.push('big_money')
    newAchievements.push('💰 "Gran Negocio" - Más de 1000 monedas en un concierto')
  }
  
  result.newAchievement = newAchievements.join('\n')
}

async function mostrarHistorial(m, conn, concerts) {
  if (concerts.totalConcerts === 0) {
    return m.reply('🎤 No has dado conciertos aún. ¡Organiza tu primer show!')
  }
  
  const historialMessage = `
🎭 *HISTORIAL DE CONCIERTOS* 🎵

📊 *Estadísticas generales:*
🎪 Total de conciertos: ${concerts.totalConcerts}
👥 Audiencia acumulada: ${concerts.totalAudience.toLocaleString()} personas
💰 Ganancias totales: ${concerts.totalEarnings} monedas
⭐ Reputación actual: ${concerts.reputation}

📈 *Promedios:*
👥 Audiencia promedio: ${Math.floor(concerts.totalAudience / concerts.totalConcerts).toLocaleString()} personas
💰 Ganancia promedio: ${Math.floor(concerts.totalEarnings / concerts.totalConcerts)} monedas

🎤 *Estado actual:* ${getMikuConcertStatus(concerts).status}
  `.trim()

  await conn.reply(m.chat, historialMessage, m)
}

async function mostrarLogros(m, conn, concerts) {
  const allAchievements = [
    { id: 'big_crowd', name: '🏟️ "Multitudes"', desc: 'Más de 1000 personas en un concierto' },
    { id: 'massive_crowd', name: '🌟 "Fenómeno"', desc: 'Más de 5000 personas en un concierto' },
    { id: 'veteran', name: '🎤 "Veterana"', desc: '10 conciertos realizados' },
    { id: 'legend', name: '👑 "Leyenda"', desc: '50 conciertos realizados' },
    { id: 'big_money', name: '💰 "Gran Negocio"', desc: 'Más de 1000 monedas en un concierto' }
  ]
  
  let logrosMessage = `🏆 **LOGROS DE CONCIERTOS** 🎵\n\n`
  
  allAchievements.forEach(achievement => {
    const unlocked = concerts.achievements.includes(achievement.id)
    logrosMessage += `${unlocked ? '✅' : '🔒'} ${achievement.name}\n`
    logrosMessage += `💭 ${achievement.desc}\n\n`
  })
  
  logrosMessage += `📊 Logros desbloqueados: ${concerts.achievements.length}/${allAchievements.length}`
  
  await conn.reply(m.chat, logrosMessage, m)
}

handler.help = ['concierto']
handler.tags = ['miku', 'music']
handler.command = /^(concierto|concertomiku|mikuconcert)$/i
handler.register = true

export default handler

