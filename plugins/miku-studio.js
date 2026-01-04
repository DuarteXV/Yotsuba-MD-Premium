const GENEROS_FUTBOL = {
  delantero: { name: "⚽ Delantero", difficulty: 3, baseGoles: [2, 6], basePuntos: [30, 100], isagiBonus: 1.5 },
  medio: { name: "🎯 Mediocampista", difficulty: 2, baseGoles: [1, 4], basePuntos: [20, 80], isagiBonus: 1.3 },
  defensa: { name: "🛡️ Defensa", difficulty: 2, baseGoles: [0, 2], basePuntos: [15, 60], isagiBonus: 1.2 },
  portero: { name: "🧤 Portero", difficulty: 4, baseGoles: [0, 1], basePuntos: [10, 50], isagiBonus: 1.4 },
  completo: { name: "👑 Jugador Completo", difficulty: 5, baseGoles: [3, 8], basePuntos: [50, 150], isagiBonus: 1.8 }
}

const MOVIMIENTOS_ESPECIALES = [
  "Meta-Visión", "Disparo Directo", "Regate Demoníaco", "Pase Perfecto",
  "Intercepción Absoluta", "Cabezazo Certero", "Tiro Lejano", "Finta Letal",
  "Control Total", "Asistencia Impecable", "Defensa Inquebrantable",
  "Contraataque Veloz", "Remate de Volley", "Tiro Libre Preciso",
  "Drible Agresivo", "Marcaje Estrecho", "Salvada Milagrosa"
]

const NIVEL_EQUIPO = {
  basico: { name: "🏟️ Básico", cost: 0, multiplier: 1.0, successRate: 0.5 },
  profesional: { name: "👕 Profesional", cost: 200, multiplier: 1.6, successRate: 0.7 },
  elite: { name: "⭐ Élite", cost: 500, multiplier: 2.2, successRate: 0.85 },
  mundial: { name: "🌍 Nivel Mundial", cost: 1000, multiplier: 3.0, successRate: 0.95 }
}

const ESTADOS_ISAGI = [
  { estado: "🔥 En Zona", bonus: 1.5, description: "Isagi está completamente concentrado" },
  { estado: "🎯 Meta-Visión Activa", bonus: 2.0, description: "Isagi ve todas las jugadas antes que ocurran" },
  { estado: "⚡ Acelerado", bonus: 1.3, description: "Isagi está a máxima velocidad" },
  { estado: "🧠 Estratégico", bonus: 1.4, description: "Isagi calcula cada movimiento" },
  { estado: "💪 Determinado", bonus: 1.6, description: "La determinación de Isagi brilla intensamente" },
  { estado: "😤 Agresivo", bonus: 1.7, description: "Isagi presiona con todo" },
  { estado: "😓 Cansado", bonus: 0.7, description: "Isagi necesita recuperar energía" }
]

let handler = async (m, { conn, usedPrefix, command, text }) => {
  const user = global.db.data.users[m.sender]
  
  if (!user.isagiBlueLock) {
    user.isagiBlueLock = {
      nivel: 1,
      partidos: [],
      totalGoles: 0,
      totalPuntos: 0,
      experiencia: 0,
      ultimoPartido: 0,
      equipo: 'basico',
      evoluciones: 0,
      racha: 0
    }
  }

  const isagi = user.isagiBlueLock
  const coins = user.coin || 0

  if (!text) return mostrarBlueLock(m, conn, usedPrefix, isagi, coins)

  const args = text.toLowerCase().split(' ')
  const action = args[0]

  const actions = {
    jugar: () => jugarPartido(m, conn, args, isagi, user),
    entrenar: () => entrenamiento(m, conn, isagi, user),
    evolucionar: () => evolucionarIsagi(m, conn, isagi, user),
    partidos: () => mostrarPartidos(m, conn, isagi),
    estadisticas: () => mostrarEstadisticas(m, conn, isagi),
    mejorar: () => mejorarEquipo(m, conn, args, isagi, user),
    analizar: () => analizarRival(m, conn, args, isagi, user)
  }

  return actions[action] ? actions[action]() : m.reply(`⚽ Comando no reconocido. Usa *${usedPrefix}isagi* para ver opciones.`)
}

async function mostrarBlueLock(m, conn, usedPrefix, isagi, coins) {
  const estadoIsagi = ESTADOS_ISAGI[Math.floor(Math.random() * ESTADOS_ISAGI.length)]
  const now = Date.now()
  
  // Entrenamiento pasivo
  if (isagi.partidos.length > 0) {
    const horasDesdePartido = Math.floor((now - isagi.ultimoPartido) / (1000 * 60 * 60))
    if (horasDesdePartido > 0 && isagi.racha > 0) {
      const expPasiva = Math.floor(isagi.nivel * 5 * horasDesdePartido * (isagi.racha * 0.1))
      isagi.experiencia += expPasiva
      isagi.ultimoPartido = now
    }
  }

  const positionsList = Object.entries(GENEROS_FUTBOL).map(([key, pos]) => `• \`${key}\` - ${pos.name}`).join('\n')

  const mensaje = `
🎌 *BLUE LOCK - ISAGI YOICHI* ⚽

👤 *Jugador:* ${m.pushName || m.sender.split('@')[0]}
🔥 *Estado:* ${estadoIsagi.estado}
💭 _${estadoIsagi.description}_

📊 *ESTADÍSTICAS ISAGI:*
⭐ Nivel: ${isagi.nivel}
⚽ Partidos: ${isagi.partidos.length}
🎯 Goles totales: ${isagi.totalGoles}
🏆 Puntos: ${isagi.totalPuntos}
🧠 Experiencia: ${isagi.experiencia}/${isagi.nivel * 100}
🔥 Racha actual: ${isagi.racha} partidos
👕 Equipo: ${NIVEL_EQUIPO[isagi.equipo].name}
✨ Evoluciones: ${isagi.evoluciones}

💰 *Monedas:* ${coins}

⚽ *COMANDOS DISPONIBLES:*
• \`${usedPrefix}isagi jugar [posición]\` - Jugar un partido
• \`${usedPrefix}isagi entrenar\` - Entrenamiento intensivo
• \`${usedPrefix}isagi evolucionar\` - Desbloquear evolución
• \`${usedPrefix}isagi partidos\` - Ver historial
• \`${usedPrefix}isagi estadisticas\` - Estadísticas detalladas
• \`${usedPrefix}isagi mejorar\` - Mejorar equipo
• \`${usedPrefix}isagi analizar [rival]\` - Analizar rival

🎯 **POSICIONES DISPONIBLES:**
${positionsList}

💡 *CONSEJOS DE EGO:*
• Mantén rachas para bonus de experiencia
• Evoluciona para desbloquear habilidades especiales
• El estado de Isagi afecta el rendimiento
• Analiza rivales para ventajas estratégicas
• Entrena entre partidos para mejorar stats
  `.trim()

  await conn.reply(m.chat, mensaje, m)
}

async function jugarPartido(m, conn, args, isagi, user) {
  const posicion = args[1]
  const now = Date.now()

  // Cooldown de 20 minutos
  if (now - isagi.ultimoPartido < 1200000) {
    const remaining = Math.ceil((1200000 - (now - isagi.ultimoPartido)) / 60000)
    return m.reply(`⏱️ Isagi necesita descansar. Próximo partido en ${remaining} minutos.`)
  }

  if (!posicion || !GENEROS_FUTBOL[posicion]) {
    const posiciones = Object.keys(GENEROS_FUTBOL).join(', ')
    return m.reply(`❌ Posición no válida. Posiciones: ${posiciones}`)
  }

  const pos = GENEROS_FUTBOL[posicion]
  const equipo = NIVEL_EQUIPO[isagi.equipo]
  const estadoIsagi = ESTADOS_ISAGI[Math.floor(Math.random() * ESTADOS_ISAGI.length)]

  // Costo del partido
  const costoPartido = equipo.cost / 2
  if (user.coin < costoPartido) {
    return m.reply(`💰 Necesitas ${costoPartido} monedas para jugar con equipo ${equipo.name}.`)
  }
  user.coin -= costoPartido

  // Cálculo de éxito
  const baseSuccess = equipo.successRate
  const estadoBonus = estadoIsagi.bonus
  const nivelBonus = 1 + (isagi.nivel * 0.15)
  const rachaBonus = 1 + (isagi.racha * 0.05)

  const finalSuccess = Math.min(0.98, baseSuccess * estadoBonus * nivelBonus * rachaBonus)
  const victoria = Math.random() < finalSuccess

  // Movimiento especial
  const movimiento = MOVIMIENTOS_ESPECIALES[Math.floor(Math.random() * MOVIMIENTOS_ESPECIALES.length)]
  const rivales = ["Rin Itoshi", "Shoei Baro", "Nagi Seishiro", "Reo Mikage", "Chigiri Hyoma"]
  const rival = rivales[Math.floor(Math.random() * rivales.length)]

  // Crear registro de partido
  const partidoId = isagi.partidos.length + 1
  const partido = {
    id: partidoId,
    rival: rival,
    posicion: pos.name,
    movimiento: movimiento,
    victoria: victoria,
    goles: 0,
    puntos: 0,
    estado: estadoIsagi.estado,
    fecha: now
  }

  if (victoria) {
    // Victoria
    const baseGoles = Math.floor(Math.random() * (pos.baseGoles[1] - pos.baseGoles[0] + 1)) + pos.baseGoles[0]
    const golesFinal = Math.floor(baseGoles * equipo.multiplier * estadoBonus * pos.isagiBonus)
    
    const puntosBase = Math.floor(Math.random() * (pos.basePuntos[1] - pos.basePuntos[0] + 1)) + pos.basePuntos[0]
    const puntosFinal = Math.floor(puntosBase * equipo.multiplier * estadoBonus)

    partido.goles = golesFinal
    partido.puntos = puntosFinal

    isagi.totalGoles += golesFinal
    isagi.totalPuntos += puntosFinal
    isagi.experiencia += Math.floor(pos.difficulty * 30)
    isagi.racha += 1
    user.coin += puntosFinal

    // Bonus por racha
    if (isagi.racha >= 3) {
      const rachaExtra = Math.floor(puntosFinal * (isagi.racha * 0.1))
      partido.puntos += rachaExtra
      isagi.totalPuntos += rachaExtra
      user.coin += rachaExtra
    }

  } else {
    // Derrota
    partido.goles = Math.floor(Math.random() * 2)
    partido.puntos = Math.floor(pos.basePuntos[0] * 0.5)
    
    isagi.totalGoles += partido.goles
    isagi.totalPuntos += partido.puntos
    isagi.experiencia += Math.floor(pos.difficulty * 10)
    isagi.racha = 0
    user.coin += partido.puntos
  }

  // Subir de nivel
  if (isagi.experiencia >= isagi.nivel * 100) {
    isagi.nivel += 1
    isagi.experiencia = 0
    partido.nivelUp = true
  }

  isagi.partidos.push(partido)
  isagi.ultimoPartido = now

  const resultado = `
⚽ *¡PARTIDO COMPLETADO!* 🎌

🆚 *Rival:* ${rival}
🎯 *Posición:* ${pos.name}
💥 *Movimiento Especial:* ${movimiento}
${victoria ? '🔥 *RESULTADO: VICTORIA* 🏆' : '💔 *RESULTADO: DERROTA* 😔'}

📊 *ESTADÍSTICAS DEL PARTIDO:*
⚽ Goles: ${partido.goles}
⭐ Puntos obtenidos: ${partido.puntos}
🔥 Estado: ${estadoIsagi.estado}
💰 Costo del partido: ${costoPartido} monedas
💳 Saldo actual: ${user.coin} monedas

${partido.nivelUp ? `✨ *¡ISAGI SUBIÓ AL NIVEL ${isagi.nivel}!* ✨` : ''}
${isagi.racha > 1 ? `🔥 *Racha actual: ${isagi.racha} victorias consecutivas*` : ''}

${victoria ? '🎌 "¡Soy el egoísta más fuerte!" - Isagi Yoichi' : '💪 "Esto solo me hace más fuerte..." - Isagi Yoichi'}
  `.trim()

  await conn.reply(m.chat, resultado, m)
}

async function entrenamiento(m, conn, isagi, user) {
  const costoEntrenamiento = 100
  const ahora = Date.now()
  
  if (user.coin < costoEntrenamiento) {
    return m.reply(`💰 Necesitas ${costoEntrenamiento} monedas para entrenar.`)
  }
  
  user.coin -= costoEntrenamiento
  
  // Beneficios del entrenamiento
  const expGanada = Math.floor(Math.random() * 30) + 20
  const statBonus = Math.floor(Math.random() * 5) + 1
  
  isagi.experiencia += expGanada
  isagi.totalPuntos += statBonus * 10
  user.coin += statBonus * 5
  
  const mensajeEntrenamiento = `
💪 *ENTRENAMIENTO INTENSIVO BLUE LOCK* 🏋️

🎌 Isagi entrena al límite de sus capacidades...

📈 *RESULTADOS DEL ENTRENAMIENTO:*
🧠 Experiencia ganada: +${expGanada}
⭐ Mejora de stats: +${statBonus * 10} puntos
💰 Monedas ganadas: +${statBonus * 5}
💪 Progreso actual: ${isagi.experiencia}/${isagi.nivel * 100}

💡 "El crecimiento ocurre fuera de tu zona de confort"
- Anri Teieri

🔥 Isagi está un paso más cerca de convertirse en el mejor delantero del mundo!
  `.trim()
  
  await conn.reply(m.chat, mensajeEntrenamiento, m)
}

async function evolucionarIsagi(m, conn, isagi, user) {
  const costoEvolucion = 500 + (isagi.evoluciones * 300)
  const expRequerida = isagi.nivel * 50
  
  if (isagi.evoluciones >= 3) {
    return m.reply('✨ Isagi ha alcanzado su máximo potencial evolutivo.')
  }
  
  if (user.coin < costoEvolucion) {
    return m.reply(`💰 Necesitas ${costoEvolucion} monedas para evolucionar.`)
  }
  
  if (isagi.experiencia < expRequerida) {
    return m.reply(`🧠 Necesitas ${expRequerida} experiencia para evolucionar (tienes ${isagi.experiencia}).`)
  }
  
  user.coin -= costoEvolucion
  isagi.evoluciones += 1
  isagi.experiencia -= expRequerida
  
  const evoluciones = [
    "Meta-Visión Perfeccionada",
    "Disparo Directo Mejorado", 
    "Instinto Asesino Despertado"
  ]
  
  const evolucionActual = evoluciones[isagi.evoluciones - 1]
  
  const mensajeEvolucion = `
✨ *¡EVOLUCIÓN DESBLOQUEADA!* 🌟

🎌 *Nueva habilidad:* ${evolucionActual}
💰 *Costo:* ${costoEvolucion} monedas
🧠 *Experiencia usada:* ${expRequerida}

🔥 *BENEFICIOS:*
• Bonus permanente de +20% en todos los partidos
• Nuevos movimientos especiales disponibles
• Mayor tasa de éxito en tiros

💬 "¡Este es mi ego! ¡Voy a superar a todos!"
- Isagi Yoichi

⚽ Evoluciones totales: ${isagi.evoluciones}/3
  `.trim()
  
  await conn.reply(m.chat, mensajeEvolucion, m)
}

async function mostrarPartidos(m, conn, isagi) {
  if (isagi.partidos.length === 0) {
    return m.reply('⚽ No has jugado ningún partido aún. ¡Usa *!isagi jugar* para empezar!')
  }
  
  const partidosRecientes = isagi.partidos.slice(-10).reverse()
  
  let historial = `📊 *HISTORIAL DE PARTIDOS* ⚽\n\n`
  
  partidosRecientes.forEach((partido, index) => {
    const resultado = partido.victoria ? '✅' : '❌'
    historial += `${resultado} *Partido #${partido.id}*\n`
    historial += `🆚 Vs: ${partido.rival}\n`
    historial += `🎯 Posición: ${partido.posicion}\n`
    historial += `⚽ Goles: ${partido.goles} | ⭐ Puntos: ${partido.puntos}\n`
    historial += `💥 Movimiento: ${partido.movimiento}\n\n`
  })
  
  historial += `📈 *RESUMEN TOTAL:*\n`
  historial += `⚽ Partidos jugados: ${isagi.partidos.length}\n`
  historial += `🎯 Goles totales: ${isagi.totalGoles}\n`
  historial += `⭐ Puntos totales: ${isagi.totalPuntos}\n`
  historial += `🔥 Racha más larga: ${Math.max(...isagi.partidos.map(p => p.victoria ? 1 : 0).reduce((acc, val) => val ? acc + 1 : 0, []) || 0)}`
  
  await conn.reply(m.chat, historial, m)
}

async function mostrarEstadisticas(m, conn, isagi) {
  const victorias = isagi.partidos.filter(p => p.victoria).length
  const derrotas = isagi.partidos.length - victorias
  const promedioGoles = isagi.partidos.length > 0 ? (isagi.totalGoles / isagi.partidos.length).toFixed(1) : 0
  
  const mejorPartido = isagi.partidos.reduce((best, current) => 
    current.puntos > best.puntos ? current : best, { puntos: 0 })
  
  const estadisticas = `
📈 *ESTADÍSTICAS DETALLADAS* 🎌

🎯 *RENDIMIENTO GENERAL:*
⚽ Partidos jugados: ${isagi.partidos.length}
✅ Victorias: ${victorias} (${isagi.partidos.length > 0 ? Math.round((victorias/isagi.partidos.length)*100) : 0}%)
❌ Derrotas: ${derrotas}
🔥 Racha actual: ${isagi.racha} partidos

⚽ *ESTADÍSTICAS DE GOLES:*
🎯 Goles totales: ${isagi.totalGoles}
📊 Promedio por partido: ${promedioGoles}
👑 Mejor partido: ${mejorPartido.puntos || 0} puntos

⭐ *PROGRESO:*
✨ Nivel: ${isagi.nivel}
🧠 Experiencia: ${isagi.experiencia}/${isagi.nivel * 100}
👕 Equipo: ${NIVEL_EQUIPO[isagi.equipo].name}
💎 Evoluciones: ${isagi.evoluciones}

🏆 *LOGROS DESTACADOS:*
${isagi.totalGoles > 50 ? '• ⚽ Anotador Nato (+50 goles)\n' : ''}
${victorias >= 10 ? '• 🏆 Invicto Temporal (+10 victorias)\n' : ''}
${isagi.racha >= 5 ? '• 🔥 Racha Imparable (+5 victorias seguidas)\n' : ''}
${isagi.evoluciones >= 1 ? `• ✨ ${isagi.evoluciones} Evolución(es) Desbloqueada(s)\n` : ''}

💪 "Los números no mienten, pero el ego siempre busca más"
- Jinpachi Ego
  `.trim()
  
  await conn.reply(m.chat, estadisticas, m)
}

async function mejorarEquipo(m, conn, args, isagi, user) {
  const equipos = Object.entries(NIVEL_EQUIPO)
  const currentIndex = equipos.findIndex(([key]) => key === isagi.equipo)
  
  if (currentIndex === equipos.length - 1) {
    return m.reply('⭐ Ya tienes el mejor equipo disponible (Nivel Mundial).')
  }
  
  const siguienteEquipo = equipos[currentIndex + 1]
  const [key, equipo] = siguienteEquipo
  const costoMejora = equipo.cost * 2
  
  if (user.coin < costoMejora) {
    return m.reply(`💰 Necesitas ${costoMejora} monedas para mejorar a ${equipo.name}.`)
  }
  
  if (isagi.nivel < (currentIndex + 2)) {
    return m.reply(`🎌 Necesitas nivel ${currentIndex + 2} para usar equipo ${equipo.name}.`)
  }
  
  user.coin -= costoMejora
  isagi.equipo = key
  
  const mensajeMejora = `
🔄 *¡EQUIPO MEJORADO!* ⭐

👕 *Nuevo equipo:* ${equipo.name}
💰 *Inversión:* ${costoMejora} monedas
💳 *Saldo restante:* ${user.coin} monedas

📈 *BENEFICIOS:*
• Multiplicador: x${equipo.multiplier}
• Tasa de éxito: ${Math.round(equipo.successRate * 100)}%
• Costo por partido: ${equipo.cost / 2} monedas

🎌 "El equipo adecuado potencia el ego del jugador"
- Anri Teieri

🔥 ¡Ahora Isagi está listo para enfrentar rivales más fuertes!
  `.trim()
  
  await conn.reply(m.chat, mensajeMejora, m)
}

async function analizarRival(m, conn, args, isagi, user) {
  const rivalNombre = args.slice(1).join(' ') || "desconocido"
  const costoAnalisis = 50
  
  if (user.coin < costoAnalisis) {
    return m.reply(`💰 Necesitas ${costoAnalisis} monedas para analizar al rival.`)
  }
  
  user.coin -= costoAnalisis
  
  const debilidades = [
    "Defensa lenta", "Poca resistencia", "Mala visión periférica",
    "Pases predecibles", "Remate débil", "Falta de agresividad",
    "Problemas bajo presión", "Marcaje suelto", "Salidas lentas"
  ]
  
  const fortalezas = [
    "Técnica depurada", "Físico imponente", "Liderazgo natural",
    "Inteligencia táctica", "Velocidad explosiva", "Precisión en pases",
    "Fuerza en remate", "Agilidad superior", "Concentración absoluta"
  ]
  
  const debilidad = debilidades[Math.floor(Math.random() * debilidades.length)]
  const fortaleza = fortalezas[Math.floor(Math.random() * fortalezas.length)]
  const ventaja = Math.floor(Math.random() * 20) + 10
  
  // Bonus para próximo partido
  isagi.experiencia += 15
  user.coin += ventaja
  
  const analisis = `
🔍 *ANÁLISIS DE RIVAL COMPLETADO* 🎌

🆚 *Rival analizado:* ${rivalNombre}
💰 *Costo del análisis:* ${costoAnalisis} monedas

📊 *HALLÁZGOS:*
✅ *Fortaleza principal:* ${fortaleza}
❌ *Debilidad clave:* ${debilidad}
🎯 *Ventaja estratégica:* +${ventaja}% de éxito en próximo partido

🧠 *BONUS OBTENIDOS:*
• +15 experiencia en análisis
• +${ventaja} monedas por descubrimiento táctico
• Información guardada para próximos enfrentamientos

💡 *RECOMENDACIÓN ESTRATÉGICA:*
${debilidad.includes('lent') ? "• Juega a alta velocidad y presiona constantemente" :
  debilidad.includes('predecible') ? "• Anticipa sus movimientos y corta sus líneas de pase" :
  debilidad.includes('débil') ? "• Presiona en el área y fuerza remates desde lejos" :
  "• Adapta tu juego para explotar su punto débil"}

🎌 "Conocer al rival es el primer paso hacia la victoria"
- Jinpachi Ego
  `.trim()
  
  await conn.reply(m.chat, analisis, m)
}

handler.help = ['isagi']
handler.tags = ['isagi', 'bluelock', 'game']
handler.command = /^(isagi|bluelock|yoichi)$/i
handler.register = true

export default handler