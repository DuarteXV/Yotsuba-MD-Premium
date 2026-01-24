import { performance } from 'perf_hooks'

let handler = async (m, { conn }) => {
    let start = performance.now()
    let { key } = await conn.sendMessage(m.chat, { text: '🚀 *Probando conexión...*' }, { quoted: m })
    let end = performance.now()
    let speed = (end - start).toFixed(2)

    await conn.sendMessage(m.chat, { 
        text: `🏓 *Pong!* \nLatencia: ${speed} ms`, 
        edit: key 
    })
}

handler.command = /^(ping)$/i
export default handler
