let cooldowns = {}

let handler = async (m, { conn, isPrems }) => {
let user = global.db.data.users[m.sender]
let tiempo = 5 * 60
if (cooldowns[m.sender] && Date.now() - cooldowns[m.sender] < tiempo * 1000) {
const tiempo2 = segundosAHMS(Math.ceil((cooldowns[m.sender] + tiempo * 1000 - Date.now()) / 1000))
conn.reply(m.chat, `⚽️ Necesitas descansar... ⚽️\n\n✨ Debes esperar *${tiempo2}* para trabajar de nuevo ✨`, m, global.rcanal)
return
}
let rsl = Math.floor(Math.random() * 500)
cooldowns[m.sender] = Date.now()
await conn.reply(m.chat, ` ${pickRandom(trabajo)} *${toNum(rsl)}* ( *${rsl}* ) ${moneda} `, m, global.rcanal)
user.coin += rsl
}

handler.help = ['trabajar']
handler.tags = ['economy']
handler.command = ['w','work','chambear','chamba', 'trabajar']
handler.group = true;
handler.register = true;

export default handler

function toNum(number) {
if (number >= 1000 && number < 1000000) {
return (number / 1000).toFixed(1) + 'k'
} else if (number >= 1000000) {
return (number / 1000000).toFixed(1) + 'M'
} else if (number <= -1000 && number > -1000000) {
return (number / 1000).toFixed(1) + 'k'
} else if (number <= -1000000) {
return (number / 1000000).toFixed(1) + 'M'
} else {
return number.toString()}}

function segundosAHMS(segundos) {
let minutos = Math.floor((segundos % 3600) / 60)
let segundosRestantes = segundos % 60
return `${minutos} minutos y ${segundosRestantes} segundos`
}

function pickRandom(list) {
return list[Math.floor(list.length * Math.random())];
}

const trabajo = [
   "⚽ Anotaste el gol decisivo en el Blue Lock y ganaste",
   "🔥 Superaste el entrenamiento de egoísmo de Jinpachi y obtuviste",
   "🎯 Mejoraste tu meta-visión en el campo y recibiste",
   "💥 Demostraste tu hambre de goles ante Isagi y ganaste",
   "🚀 Desarrollaste tu arma única en Blue Lock por",
   "🌟 Dominaste el flow state en el partido crucial y ganaste",
   "⚡ Superaste la prueba de velocidad de Chigiri y obtuviste",
   "🦅 Aplicaste la filosofía de lavado de cerebro de Ego y ganaste",
   "🎮 Completaste el programa de entrenamiento del NEL y recibiste",
   "💀 Sobreviviste a la selección de Blue Lock y ganaste",
   "🔥 Aniquilaste a tu rival en el 1vs1 y obtuviste",
   "🚪 Superaste la tercera selección de Blue Lock por",
   "👹 Demostraste tu demonio interior como Barou y ganaste",
   "🎯 Perfeccionaste tu tiro como Kunigami y recibiste",
   "🌀 Aplicaste la lógica directriz de Sae y ganaste",
   "⚽ Marcaste un hat-trick en el partido de selección por",
   "💥 Destruiste la defensa rival con tu egoísmo y obtuviste",
   "🌟 Fuiste elegido para el equipo de Japón U-20 y ganaste",
   "🔥 Completaste el entrenamiento de prisión de Blue Lock por",
   "🎮 Dominaste el sistema de rankings del NEL y recibiste",
   "⚡ Superaste la velocidad de reacción de Bachira y ganaste",
   "💀 Aniquilaste a tu oponente en el sistema de batalla y obtuviste",
   "🚀 Desarrollaste tu nueva arma en el laboratorio y ganaste",
   "🎯 Mejoraste tu precisión bajo presión como Rin y recibiste",
   "🌀 Aplicaste la visión periférica de Isagi y ganaste",
   "👹 Te convertiste en el rey del campo como Barou por",
   "⚽ Anotaste el gol de la victoria en el tiempo adicional y obtuviste",
   "💥 Rompiste el bloqueo defensivo con tu determinación y ganaste",
   "🌟 Fuiste reconocido como el jugador más valioso del partido por",
   "🔥 Superaste el límite de tu ego en el entrenamiento y recibiste",
   "🎮 Completaste el desafío de meta-visión de Ego y ganaste",
   "⚡ Dominaste el contraataque relámpago y obtuviste",
   "💀 Derrotaste a tu rival en el duelo de supervivencia por",
   "🚀 Desarrollaste tu propio estilo de juego único y ganaste",
   "🎯 Perfeccionaste el tiro directo desde cualquier ángulo y recibiste",
   "🌀 Aplicaste la teoría del devorador en el campo y ganaste",
   "👹 Impusiste tu voluntad como depredador en el área y obtuviste",
   "⚽ Marcaste el gol que definió tu valor en Blue Lock por",
   "💥 Superaste la barrera de tu propio potencial y ganaste",
   "🌟 Fuiste seleccionado para el equipo mundial de Blue Lock y recibiste",
   "🔥 Completaste el programa de fortalecimiento mental y ganaste",
   "🎮 Dominaste el análisis táctico de Noel Noa y obtuviste",
   "⚡ Superaste el test de reflejos de Gagamaru por",
   "💀 Derrotaste a múltiples oponentes en el modo batalla y ganaste",
   "🚀 Desarrollaste tu química con otros egos y recibiste",
   "🎯 Anotaste desde una posición imposible como Nagi y ganaste",
   "🌀 Aplicaste la lógica del fútbol de Rin Itoshi por",
   "👹 Demostraste tu superioridad en el uno contra uno y obtuviste",
   "⚽ Marcaste en el último segundo del partido decisivo y ganaste",
   "💥 Rompiste todas las expectativas con tu desempeño y recibiste",
   "🌟 Fuiste elegido como el ego más prometedor de Blue Lock por",
   "🔥 Superaste el entrenamiento de resistencia de Kunigami y ganaste",
   "🎮 Completaste el simulador de partidos de alta presión y obtuviste",
   "⚡ Dominaste el dribbling en espacios reducidos como Bachira por",
   "💀 Sobreviviste a la eliminación en la segunda selección y ganaste",
   "🚀 Desarrollaste tu instinto asesino frente al arco y recibiste",
   "🎯 Perfeccionaste el tiro curvo como Sae y ganaste",
   "🌀 Aplicaste la estrategia de puzzle de Isagi en el campo por",
   "👹 Te convertiste en el centro del ataque como Barou y obtuviste",
   "⚽ Anotaste el gol que te consagró como estrella y ganaste",
   "💥 Demoliste la defensa con tu poder físico y recibiste",
   "🌟 Fuiste reconocido por los ojeadores internacionales por",
   "🔥 Superaste el límite de tu flow state y ganaste",
   "🎮 Dominaste el sistema de evaluación de Ego y obtuviste",
   "⚡ Superaste la marca de Chigiri en velocidad y recibiste",
   "💀 Derrotaste a tu mejor amigo en la batalla por sobrevivir por",
   "🚀 Desarrollaste tu filosofía de fútbol única y ganaste",
   "🎯 Anotaste un gol olímpico desde el corner y obtuviste",
   "🌀 Aplicaste la visión 360° en el campo de juego por",
   "👹 Demostraste tu hambre insaciable de goles y ganaste",
   "⚽ Marcaste el penalty decisivo bajo máxima presión y recibiste",
   "💥 Rompiste el récord de goles en Blue Lock por",
   "🌟 Fuiste seleccionado como capitán del equipo y ganaste",
   "🔥 Completaste el entrenamiento especial de invierno y obtuviste",
   "🎮 Dominaste el arte del timing perfecto como Isagi y ganaste",
   "⚡ Superaste el test de agilidad de Yukimiya por",
   "💀 Sobreviviste a la purga de Blue Lock y recibiste",
   "🚀 Desarrollaste tu rivalidad saludable y ganaste",
   "🎯 Perfeccionaste el tiro volley como Kunigami y obtuviste",
   "🌀 Aplicaste el concepto de luck en el fútbol y ganaste",
   "👹 Te convertiste en el jugador más temido del NEL por",
   "⚽ Anotaste el gol que cambió tu destino en Blue Lock y recibiste"
]