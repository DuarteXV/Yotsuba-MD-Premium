let toM = a => '@' + a.split('@')[0]
function handler(m, { groupMetadata }) {
    let ps = groupMetadata.participants.map(v => v.id)
    let a = ps.getRandom()
    let b
    do b = ps.getRandom()
    while (b === a)
    
    const actividades = [
        "jueguen un partido de fútbol ⚽",
        "practiquen tiros a puerta 🥅", 
        "hagan entrenamiento de pases 🏃‍♂️",
        "compitan en penaltis 🔥",
        "jueguen un 1vs1 en la cancha 🎯",
        "practiquen regates y fintas 💫",
        "hagan ejercicios de control 🎮",
        "compitan en velocidad 🚀",
        "entrenen tiros libres 🎯",
        "jueguen un mini torneo 🏆",
        "practiquen estrategias de juego 🧠",
        "hagan ejercicios de resistencia 💪",
        "compitan en precisión 🎯",
        "jueguen un partido amistoso 🤝",
        "practiquen jugadas de ataque ⚡",
        "entrenen defensa y marcaje 🛡️",
        "hagan ejercicios de coordinación 🔄",
        "compitan en regates 🏃‍♂️",
        "jueguen un reto de habilidades 🌟",
        "practiquen centros y remates 🎯"
    ]
    
    const mensajes = [
        `⚽ *¡Nueva conexión en el campo!*\n\n${toM(a)} y ${toM(b)}, deberían ${actividades.getRandom()} para fortalecer su química deportiva! 🏃‍♂️\n\n*Las mejores alianzas nacen en la cancha!* 🔥`,
        
        `🏆 *¡Dúo potencial detectado!*\n\n${toM(a)} y ${toM(b)}, ¿qué tal si ${actividades.getRandom()} para mejorar su juego en equipo? ⚽\n\n*La competencia hace crecer a los campeones!* 💪`,
        
        `🎯 *¡Oportunidad de entrenamiento!*\n\n${toM(a)} y ${toM(a)}, la estrategia perfecta sería que ${actividades.getRandom()} para desarrollar sus habilidades! 🧠\n\n*En Blue Lock, cada rival es una oportunidad!* 🔵`,
        
        `⚡ *¡Reto deportivo!*\n\n${toM(a)} desafía a ${toM(b)} a que ${actividades.getRandom()} y demuestren quién tiene mejor técnica! 🏃‍♂️\n\n*La rivalidad construye carácter!* 🌟`,
        
        `🤝 *¡Alianza estratégica!*\n\n${toM(a)} y ${toM(b)}, formen un equipo y ${actividades.getRandom()} para dominar el campo! ⚽\n\n*Los grandes jugadores crean grandes conexiones!* 💫`,
        
        `🔥 *¡Encuentro competitivo!*\n\n${toM(a)} vs ${toM(b)} - ¿Se atreven a ${actividades.getRandom()} y ver quién es el mejor delantero? 🥅\n\n*En el fútbol, cada duelo es una lección!* 📚`,
        
        `💫 *¡Sesión de entrenamiento!*\n\n${toM(a)} y ${toM(b)}, perfeccionen sus movimientos y ${actividades.getRandom()} para el próximo partido! ⚽\n\n*La práctica hace al maestro!* 🎯`,
        
        `🚀 *¡Desafío de habilidades!*\n\n${toM(a)} y ${toM(b)}, demuestren su talento y ${actividades.getRandom()} para subir de nivel! 📈\n\n*Los límites solo existen para ser superados!* 💪`
    ]
    
    m.reply(mensajes.getRandom(), null, {
        mentions: [a, b]
    })
}

handler.help = ['amistad', 'amigorandom', 'duo', 'pareja', 'retodeportivo']
handler.tags = ['fun', 'juegos', 'deporte']
handler.command = ['amigorandom','amistad', 'duo', 'pareja', 'retodeportivo', 'entrenamiento', 'desafio']
handler.group = true
handler.register = true

export default handler