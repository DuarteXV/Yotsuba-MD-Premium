import { performance } from 'perf_hooks'

let handler = async (m, { conn }) => {
    let start = performance.now()
    let { key } = await conn.sendMessage(m.chat, { text: '🚀 *Midiendo latencia...*' }, { quoted: m })
    let end = performance.now()
    let speed = (end - start).toFixed(2)

    await conn.sendMessage(m.chat, { 
        text: `🏓 *Pong!* \nLatencia: ${speed} ms`, 
        edit: key 
    })
}

handler.help = ['ping']
handler.tags = ['main']
handler.command = /^(ping)$/i

// Propiedades de acceso
handler.group = false    // Funciona en todos lados
handler.admin = false    // No requiere ser admin
handler.botAdmin = false // El bot no necesita ser admin

export default handler
