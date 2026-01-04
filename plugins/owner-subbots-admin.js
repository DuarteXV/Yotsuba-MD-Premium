import ws from 'ws';
import chalk from 'chalk';

let handler = async (m, { conn, command, usedPrefix, args, isOwner }) => {
  if (!isOwner) return m.reply('❌ Este comando es solo para el *OWNER*')
  
  const isDisconnectCommand = /^(kickbot|disconnect|removebot)$/i.test(command)
  const isCleanCommand = /^(cleanbots|limpiarbot)$/i.test(command)
  
  if (isDisconnectCommand) {
    
    if (!args[0]) {
      return m.reply(`📋 *Uso:* ${usedPrefix + command} <número>\n\n*Ejemplo:* ${usedPrefix + command} 1\n\nUsa \`${usedPrefix}listbots\` para ver los números de los SubBots`)
    }
    
    if (!global.conns || global.conns.length === 0) {
      return m.reply('📵 No hay SubBots conectados')
    }
    
    const activeConnections = global.conns.filter(conn => 
      conn.user && 
      conn.ws.socket && 
      conn.ws.socket.readyState !== ws.CLOSED
    )
    
    const botIndex = parseInt(args[0]) - 1
    if (isNaN(botIndex) || botIndex < 0 || botIndex >= activeConnections.length) {
      return m.reply(`❌ Número inválido. Usa un número del 1 al ${activeConnections.length}`)
    }
    
    const targetBot = activeConnections[botIndex]
    const botName = targetBot.user?.name || 'Sin nombre'
    const botNumber = targetBot.user?.jid?.replace(/[^0-9]/g, '') || 'Desconocido'
    
    try {
      console.log(chalk.red(`🔌 Desconectando SubBot: ${botName} (${botNumber})`))
      
      
      if (targetBot.ws && targetBot.ws.close) {
        targetBot.ws.close()
      }
      
      
      targetBot.ev.removeAllListeners()
      
      
      const globalIndex = global.conns.indexOf(targetBot)
      if (globalIndex > -1) {
        global.conns.splice(globalIndex, 1)
      }
      
      return m.reply(`✅ SubBot desconectado exitosamente:\n\n👤 *Nombre:* ${botName}\n📱 *Número:* ${botNumber}\n🔌 *Estado:* Desconectado`)
      
    } catch (error) {
      console.error(chalk.red(`❌ Error desconectando SubBot: ${error.message}`))
      return m.reply(`❌ Error al desconectar el SubBot: ${error.message}`)
    }
  }
  
  if (isCleanCommand) {
    
    if (!global.conns || global.conns.length === 0) {
      return m.reply('📵 No hay conexiones para limpiar')
    }
    
    const initialCount = global.conns.length
    let removedCount = 0
    
    
    global.conns = global.conns.filter(conn => {
      if (!conn.user || !conn.ws.socket || conn.ws.socket.readyState === ws.CLOSED) {
        console.log(chalk.gray(`🗑️ Removiendo conexión muerta: ${conn.user?.jid || 'Desconocido'}`))
        removedCount++
        return false
      }
      return true
    })
    
    let message = `🧹 *LIMPIEZA DE CONEXIONES COMPLETADA*\n\n`
    message += `📊 Conexiones iniciales: *${initialCount}*\n`
    message += `🗑️ Conexiones removidas: *${removedCount}*\n`
    message += `✅ Conexiones activas: *${global.conns.length}*\n\n`
    
    if (removedCount > 0) {
      message += `💡 Se han removido ${removedCount} conexión(es) muerta(s).`
    } else {
      message += `✨ Todas las conexiones están activas.`
    }
    
    return m.reply(message)
  }
}

handler.help = ['kickbot', 'cleanbots']
handler.tags = ['owner']
handler.command = /^(kickbot|disconnect|removebot|cleanbots|limpiarbot)$/i
handler.owner = true

export default handler
