import ws from 'ws';
import chalk from 'chalk';

let handler = async (m, { conn, command, usedPrefix, isOwner }) => {
  if (!isOwner) return m.reply('❌ Este comando es solo para el *OWNER*')
  
  const isListCommand = /^(listbots|botslist|subbots|verbot)$/i.test(command)
  const isReconnectCommand = /^(reconectar|reconnect|reloadbots)$/i.test(command)
  
  if (isListCommand) {
    
    if (!global.conns || global.conns.length === 0) {
      return m.reply('📵 No hay SubBots conectados actualmente')
    }
    
    const activeConnections = global.conns.filter(conn => 
      conn.user && 
      conn.ws.socket && 
      conn.ws.socket.readyState !== ws.CLOSED
    )
    
    if (activeConnections.length === 0) {
      return m.reply('📵 No hay SubBots *activos* en este momento')
    }
    
    let message = `🤖 *LISTA DE SUBBOTS CONECTADOS*\n\n`
    message += `📊 Total de conexiones: *${global.conns.length}*\n`
    message += `✅ Conexiones activas: *${activeConnections.length}*\n\n`
    
    activeConnections.forEach((bot, index) => {
      const uptime = bot.uptime ? msToTime(Date.now() - bot.uptime) : 'Desconocido'
      const lastActivity = bot.lastActivity ? msToTime(Date.now() - bot.lastActivity) : 'Desconocido'
      const reconnectAttempts = bot.reconnectAttempts || 0
      const maxReconnectAttempts = bot.maxReconnectAttempts || 10
      
      message += `┌ 🤖 *SubBot ${index + 1}*\n`
      message += `├ 📱 Número: wa.me/${bot.user.jid.replace(/[^0-9]/g, '')}\n`
      message += `├ 👤 Nombre: ${bot.user.name || 'Sin nombre'}\n`
      message += `├ ⏱️ Online: ${uptime}\n`
      message += `├ 📡 Última actividad: ${lastActivity}\n`
      message += `├ 🔄 Reconexiones: ${reconnectAttempts}/${maxReconnectAttempts}\n`
      message += `├ 🔗 Estado: ${bot.ws.socket.readyState === ws.OPEN ? '🟢 Conectado' : '🟡 Conectando'}\n`
      message += `├ 🤝 Handler: ${bot.handler ? '✅ Activo' : '❌ Inactivo'}\n`
      message += `└ 🆔 ID: ${bot.user.jid}\n\n`
    })
    
    message += `💡 *Comandos disponibles:*\n`
    message += `• \`${usedPrefix}reconectar\` - Reconectar todos los SubBots\n`
    message += `• \`${usedPrefix}listbots\` - Ver esta lista`
    
    return m.reply(message)
  }
  
  if (isReconnectCommand) {
    
    if (!global.conns || global.conns.length === 0) {
      return m.reply('📵 No hay SubBots para reconectar')
    }
    
    m.reply('🔄 Iniciando reconexión de todos los SubBots...')
    
    let reconnectedCount = 0
    let errorCount = 0
    
    for (const bot of global.conns) {
      try {
        if (bot.ws.socket && bot.ws.socket.readyState !== ws.CLOSED) {
          console.log(chalk.yellow(`🔄 Reconectando SubBot: ${bot.user?.name || 'Sin nombre'}`))
          
          
          if (bot.subreloadHandler && typeof bot.subreloadHandler === 'function') {
            await bot.subreloadHandler(true)
            reconnectedCount++
          } else {
            console.log(chalk.red(`⚠️ SubBot sin función de reconexión: ${bot.user?.jid}`))
          }
        } else {
          console.log(chalk.gray(`⚠️ SubBot ya desconectado: ${bot.user?.jid}`))
        }
      } catch (error) {
        console.error(chalk.red(`❌ Error reconectando SubBot: ${error.message}`))
        errorCount++
      }
    }
    
    let resultMessage = `🔄 *PROCESO DE RECONEXIÓN COMPLETADO*\n\n`
    resultMessage += `✅ SubBots reconectados: *${reconnectedCount}*\n`
    resultMessage += `❌ Errores: *${errorCount}*\n`
    resultMessage += `📊 Total procesados: *${global.conns.length}*\n\n`
    
    if (reconnectedCount > 0) {
      resultMessage += `💡 Los SubBots deberían reconectarse automáticamente en unos segundos.`
    } else {
      resultMessage += `⚠️ No se pudo reconectar ningún SubBot. Verifica que tengan sesiones válidas.`
    }
    
    return m.reply(resultMessage)
  }
}


function msToTime(duration) {
  const seconds = Math.floor((duration / 1000) % 60)
  const minutes = Math.floor((duration / (1000 * 60)) % 60)
  const hours = Math.floor((duration / (1000 * 60 * 60)) % 24)
  const days = Math.floor(duration / (1000 * 60 * 60 * 24))

  let result = []
  if (days > 0) result.push(`${days}d`)
  if (hours > 0) result.push(`${hours}h`)
  if (minutes > 0) result.push(`${minutes}m`)
  if (seconds > 0) result.push(`${seconds}s`)
  
  return result.length > 0 ? result.join(' ') : '0s'
}

handler.help = ['listbots', 'reconectar']
handler.tags = ['owner']
handler.command = /^(listbots|botslist|subbots|verbot|reconectar|reconnect|reloadbots)$/i
handler.owner = true

export default handler
