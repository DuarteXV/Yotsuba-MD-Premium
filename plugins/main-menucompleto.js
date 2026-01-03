let handler = async (m, { conn, args }) => {
let userId = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
let user = global.db.data.users[userId]
let name = conn.getName(userId)
let _uptime = process.uptime() * 1000
let uptime = clockString(_uptime)
let totalreg = Object.keys(global.db.data.users).length
let totalCommands = Object.values(global.plugins).filter((v) => v.help && v.tags).length

let txt = `🎯 *¡VISIÓN EGOÍSTA ACTIVADA!*

Soy *Isagi Yoichi IA* ⚽👁️ *${(conn.user.jid == global.conn.user.jid ? '(Bot Principal)' : '(Sub-Bot)')}*

> ꒰⚽ ʚ˚₊‧ ✎ ꒱ FILOSOFÍA:
- Cada comando es una jugada estratégica
- La precisión define la victoria final  
- Opero bajo la filosofía del "Fútbol Egoísta"

*╭╼𝅄꒰𑁍⃪⚽👁️ ꒱ 𐔌 ANÁLISIS TÁCTICO 𐦯*
*|✎ Creador:* 🏆 𝔻𝕦𝕒𝕣𝕥𝕖𝕩𝕍 🏆
*|✎ Jugadores:* ${totalreg.toLocaleString()}
*|✎ Tiempo Activo:* ${uptime}
*|✎ Comandos:* ${totalCommands}
*|✎ Sistema:* Multi Device 
*╰─ׅ─ׅ┈─๋︩︪─⚽👁️─╯*


*╭╼𝅄꒰𑁍⃪⚽👁️ ꒱ 𐔌 ESTADÍSTICAS PERSONALES 𐦯*
*|✎ Nombre:* ${name}
*|✎ Nivel:* ${user.level || 1}
*|✎ Experiencia:* ${user.exp || 0}
*|✎ Dinero:* ${user.money || 0}
*╰─ׅ─ׅ┈─๋︩︪─⚽👁️─╯*

*🎯 SISTEMA DE COMANDOS - VISIÓN COMPLETA*

*꒰⚽👁️ ✎ ꒱ 𐔌 SCOUTING OFENSIVO 𐦯*
> *𑁍⃪⚽ ❏ .pinterest* - Imágenes estratégicas
> *𑁍⃪⚽ ❏ .google* - Búsqueda táctica
> *𑁍⃪⚽ ❏ .yts* - Videos de jugadas
> *𑁍⃪⚽ ❏ .imagen* - Imágenes de entrenamiento
> *𑁍⃪⚽ ❏ .infoanime* - Scouting anime
> *𑁍⃪⚽ ❏ .tiktoksearch* - Videos cortos
> *𑁍⃪⚽ ❏ .githubsearch* - Scouting código
> *𑁍⃪⚽ ❏ .cuevana* - Películas tácticas
> *𑁍⃪⚽ ❏ .tweetposts* - Posts estratégicos
> *𑁍⃪⚽ ❏ .npmjs* - Paquetes tácticos
*╰─ׅ─ׅ┈─๋︩︪─⚽👁️─╯*

*꒰⚽👁️ ✎ ꒱ 𐔌 DESCARGAS RÁPIDAS 𐦯*
> *𑁍⃪⚽ ❏ .play* - Jugadas musicales
> *𑁍⃪⚽ ❏ .tiktok* - Jugadas virales
> *𑁍⃪⚽ ❏ .instagram* - Posts visuales
> *𑁍⃪⚽ ❏ .facebook* - Jugadas sociales
> *𑁍⃪⚽ ❏ .mediafire* - Archivos pesados
> *𑁍⃪⚽ ❏ .mega* - Almacenamiento táctico
> *𑁍⃪⚽ ❏ .twitter* - Jugadas rápidas
> *𑁍⃪⚽ ❏ .ytmp3/.ytmp4* - Jugadas completas
> *𑁍⃪⚽ ❏ .gitclone* - Clonar estrategias
> *𑁍⃪⚽ ❏ .apk* - Aplicaciones tácticas
*╰─ׅ─ׅ┈─๋︩︪─⚽👁️─╯*

*꒰⚽👁️ ✎ ꒱ 𐔌 STICKERS TÁCTICOS 𐦯*
> *𑁍⃪⚽ ❏ .s* - Sticker rápido
> *𑁍⃪⚽ ❏ .toimg* - Convertir a imagen
> *𑁍⃪⚽ ❏ .emojimix* - Combinar emociones
> *𑁍⃪⚽ ❏ .qc* - Stickers con texto
> *𑁍⃪⚽ ❏ .ttp/.attp/.brat* - Texto animado
> *𑁍⃪⚽ ❏ .wm* - Marca de agua
> *𑁍⃪⚽ ❏ .setmeta* - Configurar pack
> *𑁍⃪⚽ ❏ .delmeta* - Eliminar pack
> *𑁍⃪⚽ ❏ .pfp* - Foto de perfil
*╰─ׅ─ׅ┈─๋︩︪─⚽👁️─╯*

*꒰⚽👁️ ✎ ꒱ 𐔌 ECONOMÍA DEL EQUIPO 𐦯*
> *𑁍⃪⚽ ❏ .work* - Entrenar duro
> *𑁍⃪⚽ ❏ .daily* - Bono diario
> *𑁍⃪⚽ ❏ .mine* - Minar recursos
> *𑁍⃪⚽ ❏ .casino* - Apostar fichas
> *𑁍⃪⚽ ❏ .cf* - Cara o cruz
> *𑁍⃪⚽ ❏ .slot* - Tragamonedas
> *𑁍⃪⚽ ❏ .ruleta* - Ruleta rusa
> *𑁍⃪⚽ ❏ .steal* - Robar balón
> *𑁍⃪⚽ ❏ .robarxp* - Robar experiencia
> *𑁍⃪⚽ ❏ .bank* - Banco táctico
> *𑁍⃪⚽ ❏ .wallet* - Cartera personal
> *𑁍⃪⚽ ❏ .deposit* - Depositar ganancias
> *𑁍⃪⚽ ❏ .withdraw* - Retirar fondos
> *𑁍⃪⚽ ❏ .transfer* - Pase de dinero
> *𑁍⃪⚽ ❏ .buyall* - Comprar mejoras
> *𑁍⃪⚽ ❏ .cofre* - Cofre sorpresa
> *𑁍⃪⚽ ❏ .weekly* - Bono semanal
> *𑁍⃪⚽ ❏ .monthly* - Bono mensual
*╰─ׅ─ׅ┈─๋︩︪─⚽👁️─╯*

*꒰⚽👁️ ✎ ꒱ 𐔌 GACHA ESTRATÉGICA 𐦯*
> *𑁍⃪⚽ ❏ .rollwaifu* - Buscar refuerzos
> *𑁍⃪⚽ ❏ .claim* - Reclutar jugador
> *𑁍⃪⚽ ❏ .harem* - Plantilla completa
> *𑁍⃪⚽ ❏ .charimage* - Foto del jugador
> *𑁍⃪⚽ ❏ .charinfo* - Stats del jugador
> *𑁍⃪⚽ ❏ .givechar* - Traspaso jugador
> *𑁍⃪⚽ ❏ .vote* - Votar MVP
> *𑁍⃪⚽ ❏ .waifusboard* - Tabla de posiciones
*╰─ׅ─ׅ┈─๋︩︪─⚽👁️─╯*

*꒰⚽👁️ ✎ ꒱ 𐔌 JUEGOS DE ESTRATEGIA 𐦯*
> *𑁍⃪⚽ ❏ .ttt* - Tres en raya táctico
> *𑁍⃪⚽ ❏ .ppt* - Piedra, papel, tijera
> *𑁍⃪⚽ ❏ .matematicas* - Entrenamiento mental
> *𑁍⃪⚽ ❏ .ahorcado* - Adivinar jugada
> *𑁍⃪⚽ ❏ .sopa* - Sopa de letras
> *𑁍⃪⚽ ❏ .pvp* - Duelo personal
*╰─ׅ─ׅ┈─๋︩︪─⚽👁️─╯*

*꒰⚽👁️ ✎ ꒱ 𐔌 TÁCTICA DE GRUPO 𐦯*
> *𑁍⃪⚽ ❏ .hidetag* - Pase oculto
> *𑁍⃪⚽ ❏ .kick* - Expulsar jugador
> *𑁍⃪⚽ ❏ .add* - Contratar refuerzo
> *𑁍⃪⚽ ❏ .promote* - Ascender a capitán
> *𑁍⃪⚽ ❏ .demote* - Bajar de categoría
> *𑁍⃪⚽ ❏ .link* - Enlace del equipo
> *𑁍⃪⚽ ❏ .revoke* - Cambiar enlace
> *𑁍⃪⚽ ❏ .group open/close* - Abrir/cerrar equipo
> *𑁍⃪⚽ ❏ .warn* - Tarjeta amarilla
> *𑁍⃪⚽ ❏ .unwarn* - Quitar amonestación
> *𑁍⃪⚽ ❏ .mute* - Tiempo muerto
> *𑁍⃪⚽ ❏ .unmute* - Reanudar juego
> *𑁍⃪⚽ ❏ .delete* - Borrar jugada
> *𑁍⃪⚽ ❏ .admins* - Ver capitanes
> *𑁍⃪⚽ ❏ .gp* - Info del equipo
> *𑁍⃪⚽ ❏ .setwelcome* - Mensaje bienvenida
> *𑁍⃪⚽ ❏ .setbye* - Mensaje despedida
> *𑁍⃪⚽ ❏ .encuesta* - Votación táctica
> *𑁍⃪⚽ ❏ .invocar* - Convocar a todos
> *𑁍⃪⚽ ❏ .gpbanner* - Cambiar escudo
> *𑁍⃪⚽ ❏ .gpname* - Cambiar nombre equipo
> *𑁍⃪⚽ ❏ .gpdesc* - Cambiar lema
> *𑁍⃪⚽ ❏ .bot on/off* - Activar/desactivar
*╰─ׅ─ׅ┈─๋︩︪─⚽👁️─╯*

*꒰⚽👁️ ✎ ꒱ 𐔌 HERRAMIENTAS TÁCTICAS 𐦯*
> *𑁍⃪⚽ ❏ .clima* - Condiciones del campo
> *𑁍⃪⚽ ❏ .translate* - Traductor táctico
> *𑁍⃪⚽ ❏ .enhance* - Mejorar imagen
> *𑁍⃪⚽ ❏ .calcular* - Cálculos rápidos
> *𑁍⃪⚽ ❏ .fake* - Jugadas falsas
> *𑁍⃪⚽ ❏ .letra* - Cambiar tipografía
> *𑁍⃪⚽ ❏ .read* - Ver imagen única
> *𑁍⃪⚽ ❏ .whatmusic* - Identificar himno
> *𑁍⃪⚽ ❏ .ss* - Capturar pantalla
> *𑁍⃪⚽ ❏ .length* - Ajustar tamaño
> *𑁍⃪⚽ ❏ .say* - Repetir mensaje
> *𑁍⃪⚽ ❏ .todoc* - Crear documento
> *𑁍⃪⚽ ❏ .horario* - Horario global
*╰─ׅ─ׅ┈─๋︩︪─⚽👁️─╯*

*꒰⚽👁️ ✎ ꒱ 𐔌 REACCIONES EMOCIONALES 𐦯*
> *𑁍⃪⚽ ❏ .hug* - Abrazo de equipo
> *𑁍⃪⚽ ❏ .kiss* - Beso de gol
> *𑁍⃪⚽ ❏ .pat* - Palmada de ánimo
> *𑁍⃪⚽ ❏ .slap* - Tarjeta roja
> *𑁍⃪⚽ ❏ .cry* - Llorar derrota
> *𑁍⃪⚽ ❏ .happy* - Celebrar victoria
> *𑁍⃪⚽ ❏ .angry* - Enfado táctico
> *𑁍⃪⚽ ❏ .love* - Amor al juego
> *𑁍⃪⚽ ❏ .dance* - Baile de gol
> *𑁍⃪⚽ ❏ .laugh* - Risas en vestuario
> *𑁍⃪⚽ ❏ .run* - Correr al ataque
> *𑁍⃪⚽ ❏ .dias* - Buenos días equipo
> *𑁍⃪⚽ ❏ .noches* - Buenas noches
> *𑁍⃪⚽ ❏ .think* - Pensar jugada
*╰─ׅ─ׅ┈─๋︩︪─⚽👁️─╯*

*꒰⚽👁️ ✎ ꒱ 𐔌 SISTEMA DE PERFIL 𐦯*
> *𑁍⃪⚽ ❏ .reg* - Fichar por el equipo
> *𑁍⃪⚽ ❏ .unreg* - Dar de baja
> *𑁍⃪⚽ ❏ .profile* - Ver ficha técnica
> *𑁍⃪⚽ ❏ .marry* - Contrato largo
> *𑁍⃪⚽ ❏ .divorce* - Romper contrato
> *𑁍⃪⚽ ❏ .setgenre* - Definir posición
> *𑁍⃪⚽ ❏ .setbirth* - Fecha debut
> *𑁍⃪⚽ ❏ .setdescription* - Biografía
> *𑁍⃪⚽ ❏ .lb* - Tabla de goleadores
> *𑁍⃪⚽ ❏ .level* - Nivel de habilidad
> *𑁍⃪⚽ ❏ .comprarpremium* - Contrato premium
> *𑁍⃪⚽ ❏ .confesiones* - Confesiones tácticas
*╰─ׅ─ׅ┈─๋︩︪─⚽👁️─╯*

*꒰⚽👁️ ✎ ꒱ 𐔌 CONFIGURACIÓN TÁCTICA 𐦯*
> *𑁍⃪⚽ ❏ .ping* - Velocidad de pase
> *𑁍⃪⚽ ❏ .uptime* - Tiempo en cancha
> *𑁍⃪⚽ ❏ .serbot* - Crear suplente
> *𑁍⃪⚽ ❏ .qr* - Código de acceso
> *𑁍⃪⚽ ❏ .status* - Estado del equipo
> *𑁍⃪⚽ ❏ .infobot* - Info completa
> *𑁍⃪⚽ ❏ .script* - Manual táctico
> *𑁍⃪⚽ ❏ .staff* - Cuerpo técnico
> *𑁍⃪⚽ ❏ .bots* - Jugadores suplentes
> *𑁍⃪⚽ ❏ .links* - Redes del equipo
> *𑁍⃪⚽ ❏ .sug* - Sugerir jugadas
> *𑁍⃪⚽ ❏ .reporte* - Reportar lesión
> *𑁍⃪⚽ ❏ .sistema* - Estado sistema
> *𑁍⃪⚽ ❏ .speed* - Estadísticas velocidad
> *𑁍⃪⚽ ❏ .views* - Espectadores
> *𑁍⃪⚽ ❏ .funciones* - Jugadas disponibles
> *𑁍⃪⚽ ❏ .ds* - Limpiar vestuario
*╰─ׅ─ׅ┈─๋︩︪─⚽👁️─╯*


> ⚽ *Cada comando es una oportunidad de gol* 👁️`.trim()

await conn.sendMessage(m.chat, { 
text: txt,
contextInfo: {
mentionedJid: [userId],
isForwarded: true,
forwardedNewsletterMessageInfo: {
  newsletterJid: '120363420979328566@newsletter',
  newsletterName: '⏤͟͞ू⃪𝐁𝕃𝐔𝔼 𝐋𝕆𝐂𝕂 𝐂𝕃𝐔𝔹 𑁯🩵ᰍ',
  serverMessageId: -1
},
externalAdReply: {                
title: 'Isagi Yoichi IA',
body: 'Sistema de Visión Egoísta - Modo Fútbol',
mediaType: 1,
mediaUrl: global.redes || '',
sourceUrl: 'https://whatsapp.com/channel/0029Vb73g1r1NCrTbefbFQ2T',
thumbnail: await (await fetch(global.banner || 'http://files.hostrta.win/files/xzadonix_76.jpg')).buffer(),
showAdAttribution: false,
containsAutoReply: true,
renderLargerThumbnail: true
}}}, { quoted: m })
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = ['menucompleto', 'comandos', 'helpcompleto', 'allmenu', 'menuall', 'ayudacompleto']

export default handler

function clockString(ms) {
let seconds = Math.floor((ms / 1000) % 60)
let minutes = Math.floor((ms / (1000 * 60)) % 60)
let hours = Math.floor((ms / (1000 * 60 * 60)) % 24)
return `${hours}h ${minutes}m ${seconds}s`
}