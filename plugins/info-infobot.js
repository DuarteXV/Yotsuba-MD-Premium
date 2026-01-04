import db from '../lib/database.js'
import { cpus as _cpus, totalmem, freemem, platform, hostname } from 'os'
import speed from 'performance-now'
import { sizeFormatter } from 'human-readable'

let format = sizeFormatter({
    std: 'JEDEC',
    decimalPlaces: 2,
    keepTrailingZeroes: false,
    render: (literal, symbol) => `${literal} ${symbol}B`,
})

let handler = async (m, { conn, usedPrefix }) => {
    let bot = global.db.data.settings[conn.user.jid]
    let totalStats = Object.values(global.db.data.stats).reduce((total, stat) => total + stat.total, 0)
    let totalf = Object.values(global.plugins).filter((v) => v.help && v.tags).length

    let info = `⚽ *Información de ${global.botname}* 🔥\n\n`
    info += `🎯 *Comando Base* : [  ${usedPrefix}  ]\n`
    info += `💎 *Total de Estrategias (Plugins)* : ${totalf}\n`
    info += `⚡ *Goles Marcados (Comandos)* : ${toNum(totalStats)} ( *${totalStats}* )\n\n`
    info += `*🏆 Campo de Entrenamiento:*\n`
    info += `🎯 *Plataforma de Juego* : ${platform()}\n`
    info += `⚽ *Servidor del Campo* : ${hostname()}\n`
    info += `💪 *Memoria en Uso* : ${format(totalmem() - freemem())} / ${format(totalmem())}\n`
    info += `🚀 *Memoria Libre* : ${format(freemem())}\n\n`
    info += `🔥 *Recursos del Sistema* :\n`
    info += `${'```' + Object.keys(process.memoryUsage()).map((key) => `${key}: ${format(process.memoryUsage()[key])}`).join('\n') + '```'}\n\n`
    info += `*"Mi visión directa analiza cada detalle del campo"* ⚽`

    await conn.reply(m.chat, info, fkontak, { contextInfo: { mentionedJid: [owner[0][0] + '@s.whatsapp.net'] } })
}

handler.help = ['botinfo']
handler.tags = ['info']
handler.command = ['info', 'botinfo', 'infobot']

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
        return number.toString()
    }
}