import fetch from 'node-fetch'

let handler = async (m, { conn, usedPrefix, command }) => {

// Define aquí tus links reales
let namegrupo = '⚽ BLUE LOCK - PRINCIPAL'
let gp1 = 'https://chat.whatsapp.com/EVX80wx40aN8jk38haeSx6'

let namecomu = '🔥 COMUNIDAD BLUE LOCK'
let comunidad1 = 'https://chat.whatsapp.com/GPfABUmCuVN2Qu1d1PPcBY'

let namechannel = '🎯 CANAL OFICIAL'
let channel = 'https://whatsapp.com/channel/0029Vb73g1r1NCrTbefbFQ2T'

let dev = 'Creado por DuarteXV'
let catalogo = 'https://files.catbox.moe/kepzok.jpg' // Usando tu foto de Isagi
let emojis = '⚽' // Emoji para la reacción

let grupos = `⚽ *¡ATENCIÓN, JUGADOR!* 🔥

🎯 Únete a los campos de entrenamiento oficiales de Blue Lock para demostrar tu ego y convertirte en el delantero número 1...

🏆 ${namegrupo}
> *⚽* ${gp1}

⚡ ${namecomu}
> *🔥* ${comunidad1}

*⚽─🔥─🎯─💎─🏆─⚡─🎯─🔥─⚽*

🎯 ¿Enlace caducado? ¡Entra aquí para más información del entrenamiento!

💎 ${namechannel}
> *⚽* ${channel}

> ${dev} 🎯⚽`

await conn.sendFile(m.chat, catalogo, "blueLock.jpg", grupos, m)
await m.react(emojis)

}

handler.help = ['grupos', 'campos']
handler.tags = ['info']
handler.command = ['grupos', 'links', 'groups', 'campos', 'blueLock']

export default handler