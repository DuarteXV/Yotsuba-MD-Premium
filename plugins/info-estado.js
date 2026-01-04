import ws from 'ws'
let handler = async (m, { conn, usedPrefix, isRowner}) => {
let _uptime = process.uptime() * 1000;
let totalreg = Object.keys(global.db.data.users).length
let totalchats = Object.keys(global.db.data.chats).length

let uptime = clockString(_uptime);
const getConnsArray = () => {
    if (!global.conns) return []
    if (global.conns instanceof Map) return Array.from(global.conns.values())
    if (Array.isArray(global.conns)) return global.conns
    return Object.values(global.conns || {})
}
let users = [...new Set(getConnsArray().filter((conn) => conn.user && conn.ws?.socket && conn.ws.socket.readyState !== ws.CLOSED).map((conn) => conn))];
const chats = Object.entries(conn.chats).filter(([id, data]) => id && data.isChats)
const groupsIn = chats.filter(([id]) => id.endsWith('@g.us')) 
const totalUsers = users.length;
let old = performance.now()
let neww = performance.now()
let speed = neww - old
const used = process.memoryUsage()
let info = `⚽🔥 *ISAGI YOICHI BOT - ESTADO DEL CAMPO* 🔥⚽\n\n`
info += `┌─ 🎯 *Información del Delantero*\n`
info += `├ 🤖 *Nombre:* Isagi Yoichi\n`
info += `├ 👑 *Director Técnico:* ${etiqueta}\n`
info += `├ 📋 *Comando Base:* [ ${usedPrefix} ]\n`
info += `├ 🌟 *Nivel de Evolución:* ${vs}\n`
info += `└────\n\n`
info += `┌─ 📊 *Estadísticas del Equipo*\n`
info += `├ ⚽ *Jugadores Conectados:* ${users.length}\n`
info += `├ ✅ *Jugadores en Campo:* ${users.filter(conn => conn.user && conn.ws?.socket?.readyState !== ws.CLOSED).length}\n`
info += `├ 💬 *Entrenamientos Individuales:* ${chats.length - groupsIn.length}\n`
info += `├ 👥 *Equipos Formados:* ${groupsIn.length}\n`
info += `├ 📞 *Total de Sesiones:* ${chats.length}\n`
info += `├ 💎 *Jugadores Registrados:* ${totalreg}\n`
info += `└────\n\n`
info += `┌─ ⚡ *Rendimiento en Campo*\n`
info += `├ ⏰ *Tiempo de Entrenamiento:* ${uptime}\n`
info += `├ 🚀 *Velocidad de Reacción:* ${(speed * 1000).toFixed(0) / 1000}ms\n`
info += `├ 💾 *Memoria Utilizada:* ${(used.rss / 1024 / 1024).toFixed(2)} MB\n`
info += `├ 🔋 *Energía de Ego:* ${(used.heapUsed / 1024 / 1024).toFixed(2)} MB\n`
info += `└────\n\n`

if (users.length > 0) {
info += `┌─ 🤖 *Compañeros de Equipo*\n`
users.slice(0, 5).forEach((bot, index) => {
  const botName = bot.user?.name || 'Jugador Anónimo'
  const botNumber = bot.user?.jid?.replace(/[^0-9]/g, '') || '0000'
  const status = bot.ws?.socket?.readyState === ws.OPEN ? '🟢' : '🟡'
  info += `├ ${status} *${index + 1}.* ${botName} (${botNumber.slice(-4)})\n`
})
if (users.length > 5) {
  info += `├ 📝 *Y ${users.length - 5} jugador(es) más en reserva...*\n`
}
info += `└────\n\n`
}

info += `💡 *Comandos de Estrategia:*\n`
info += `• \`${usedPrefix}listbots\` - Ver lista completa del equipo\n`
info += `• \`${usedPrefix}reconectar\` - Reorganizar formación\n\n`
info += `⚽ *"Mi visión directa detecta que todo funciona perfectamente"* 🔥`
await conn.sendFile(m.chat, banner, 'estado.jpg', info, m)
}
handler.help = ['estado']
handler.tags = ['info']
handler.command = ['estado', 'status', 'estate', 'state', 'stado', 'stats']
handler.register = true

export default handler

function clockString(ms) {
    let seconds = Math.floor((ms / 1000) % 60);
    let minutes = Math.floor((ms / (1000 * 60)) % 60);
    let hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    return `${hours}h ${minutes}m ${seconds}s`;
}