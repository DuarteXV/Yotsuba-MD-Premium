// Comandos específicos para SubBots
import { spawn } from 'child_process'
import path from 'path'

let handler = async (m, { conn, args, usedPrefix, command, isOwner }) => {
  
  if (!conn.isSubBot) {
    return false
  }
  
  console.log(`🤖 SubBot ${conn.user?.id} ejecutando comando: ${command}`)
  
  try {
    switch (command) {
      case 'code':
      case 'qr':
        // Delegar la creación de SubBot al bot principal
        const parentBot = conn.parentBot || global.conn
        
        if (!parentBot || typeof parentBot.sendMessage !== 'function') {
          return m.reply(`❌ *Error de Conexión*\n\n🔍 No se puede acceder al bot principal desde este SubBot.\n\n💡 Para crear un nuevo SubBot, contacta directamente al bot principal.`)
        }
        
        try {
          await parentBot.sendMessage(m.chat, {
            text: `🤖 *SubBot → Bot Principal*\n\n` +
                  `📝 Solicitud de nuevo SubBot recibida desde:\n` +
                  `👤 SubBot: ${conn.user?.name || conn.user?.id || 'Desconocido'}\n` +
                  `📱 Usuario: @${m.sender.split('@')[0]}\n\n` +
                  `⚠️ *Importante:* Los SubBots no pueden crear otros SubBots por razones de:\n` +
                  `• 🔒 Seguridad del sistema\n` +
                  `• 📈 Gestión de recursos\n` +
                  `• 🛡️ Prevención de bucles infinitos\n\n` +
                  `💡 *Solución:* Para crear un SubBot, usa estos comandos directamente con el bot principal:\n` +
                  `• \`${usedPrefix}qr\` - Para código QR\n` +
                  `• \`${usedPrefix}code\` - Para código de vinculación\n\n` +
                  `🔗 *Bot Principal:* ${parentBot.user?.name || parentBot.user?.id || 'No disponible'}`,
            mentions: [m.sender]
          }, { quoted: m })
          
          // También responder al usuario que hizo la solicitud
          await conn.sendMessage(m.chat, {
            text: `🤖 *Solicitud Procesada*\n\n` +
                  `✅ Tu solicitud ha sido enviada al bot principal.\n\n` +
                  `📋 *Instrucciones:*\n` +
                  `1. Contacta directamente al bot principal\n` +
                  `2. Usa \`${usedPrefix}${command}\` con el bot principal\n` +
                  `3. Sigue las instrucciones de vinculación\n\n` +
                  `⏱️ *Nota:* Los SubBots actúan como intermediarios, pero no pueden crear nuevas sesiones.`
          }, { quoted: m })
          
        } catch (delegateError) {
          console.error('Error delegando al bot principal:', delegateError.message)
          return m.reply(`❌ *Error de Delegación*\n\n🔍 No se pudo comunicar con el bot principal.\n\n📋 *Pasos a seguir:*\n1. Contacta directamente al bot principal\n2. Usa \`${usedPrefix}${command}\` con el bot principal\n3. Reporta este error si persiste\n\n🔧 *Error:* ${delegateError.message}`)
        }
        break
        
      case 'status':
      case 'info':
        // Información del SubBot
        const uptime = Date.now() - conn.sessionStartTime
        const uptimeStr = msToTime(uptime)
        const parentInfo = conn.parentBot?.user?.name || conn.parentBot?.user?.id || 'No disponible'
        
        await m.reply(`🤖 *Información del SubBot*\n\n` +
                     `👤 *SubBot:* ${conn.user?.name || 'Desconocido'}\n` +
                     `📱 *ID:* ${conn.user?.id || 'No disponible'}\n` +
                     `⏰ *Tiempo activo:* ${uptimeStr}\n` +
                     `🔗 *Bot Principal:* ${parentInfo}\n` +
                     `📊 *Reconexiones:* ${conn.reconnectAttempts || 0}/${conn.maxReconnectAttempts || 0}\n` +
                     `🌐 *Estado:* ${conn.ws?.socket?.readyState === 1 ? '🟢 Conectado' : '🔴 Desconectado'}\n\n` +
                     `💡 *Funciones disponibles:*\n` +
                     `• Procesar comandos normales\n` +
                     `• Delegar creación de SubBots\n` +
                     `• Mantener sesión persistente\n` +
                     `• Reconexión automática`)
        break
        
      default:
        // Para otros comandos, no hacer nada especial (dejar que el handler normal los procese)
        return false
    }
    
  } catch (error) {
    console.error(`Error en comando SubBot ${command}:`, error.message)
    return m.reply(`❌ *Error en SubBot*\n\n🔍 Error procesando comando: ${command}\n📝 Detalle: ${error.message}\n\n💡 Intenta nuevamente o contacta al bot principal.`)
  }
}

// Función auxiliar para formatear tiempo
function msToTime(ms) {
  const seconds = Math.floor((ms / 1000) % 60)
  const minutes = Math.floor((ms / (1000 * 60)) % 60)
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24)
  const days = Math.floor(ms / (1000 * 60 * 60 * 24))
  
  let result = []
  if (days > 0) result.push(`${days}d`)
  if (hours > 0) result.push(`${hours}h`)
  if (minutes > 0) result.push(`${minutes}m`)
  if (seconds > 0) result.push(`${seconds}s`)
  
  return result.join(' ') || '0s'
}

handler.help = ['code', 'qr', 'status', 'info']
handler.tags = ['subbot']
handler.command = /^(code|qr|status|info)$/i

export default handler