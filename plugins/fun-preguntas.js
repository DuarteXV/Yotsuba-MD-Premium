var handler = async (m, { conn, text, usedPrefix, command }) => {

if (!text) return conn.reply(m.chat, `⚽🔥 Por favor, hazme una pregunta para analizar con mi visión directa...`, m)

await m.react('⚽')
await delay(1000 * 1)
await m.react('🔥')
await delay(1000 * 1)
await m.react('🎯')
await delay(1000 * 1)

let dev = `*┏━━━━━━━━━━━━━━━━━━━━━┓*
⚽ *ANÁLISIS BLUE LOCK* 🔥
*┗━━━━━━━━━━━━━━━━━━━━━┛*`

await conn.reply(m.chat, dev + `\n\n🎯 *Pregunta del Campo:* ` + text + `\n💎 *Respuesta del Ego:* ` + res, m)

}
handler.help = ['pregunta']
handler.tags = ['fun']
handler.command = ['pregunta','preguntas']
handler.group = true
handler.register = true

export default handler

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

let res = [
    '¡Sí! Mi visión directa lo confirma ⚽',
    'Posiblemente, pero requiere más análisis 🔥',
    'No, esa jugada no funciona en el campo 🎯',
    'Definitivamente no - sería un autogol 💀',
    'Mi instinto de depredador dice que sí 🐆',
    'Imposible con esa táctica 🚫',
    'Solo si tienes el hambre de Barou 👑',
    'La presión te convertirá en diamante 💎',
    'Eso depende de tu ego - ¿cuánto quieres ganar? 💪',
    'Mi meta-visión detecta un posible sí 🔍',
    'Como Isagi en el área - ¡claro que sí! ⚡',
    'Rin Itoshi diría que no ❄️',
    'Bachira y su monstruo aprobarían 🎨',
    'Eso sería una jugada de genio 🧠',
    'Solo si estás dispuesto a evolucionar 🚀',
    'Tu determinación tiene la respuesta 🏆',
    'Esa pregunta necesita más hambre de victoria 🔥',
    'El ego siempre encuentra el camino ⚽'
][Math.floor(Math.random() * 18)]