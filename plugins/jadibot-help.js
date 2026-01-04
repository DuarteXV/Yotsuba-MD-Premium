import chalk from 'chalk'


function isSocketReady(s) {
  try {
    if (!s) return false
    const hasWebSocket = s.ws && s.ws.socket
    const isOpen = hasWebSocket && s.ws.socket.readyState === 1 // ws.OPEN
    const hasUser = s.user && s.user.jid
    const hasAuthState = s.authState && s.authState.creds
    const isConnected = s.connectionStatus === 'open' || isOpen
    return hasWebSocket && isOpen && hasUser && hasAuthState && isConnected
  } catch (e) {
    return false
  }
}

let handler = async (m, { conn, args, usedPrefix, command, isOwner }) => {
  try {
    const memUsage = Math.round(process.memoryUsage().heapUsed / 1024 / 1024)
    const activeConnections = global.conns?.filter(c => c && c.user && isSocketReady(c)) || []
    const totalBots = global.conns?.filter(c => c && c.user).length || 0
    
    let helpText = `┌─「 🤖 *ISAGI YOICHI - SUBBOT MANAGER* 」\n`
    helpText += `├ ⚽️ *Sistema de SubBots Ultra-Persistente*\n`
    helpText += `├ 📊 Estado: ${activeConnections.length}/${totalBots} activos\n`
    helpText += `├ 💾 Memoria: ${memUsage}MB\n`
    helpText += `└────────────────────\n\n`

    helpText += `🚀 *COMANDOS PRINCIPALES:*\n\n`
    
    helpText += `📱 *Crear SubBot:*\n`
    helpText += `├ ${usedPrefix}qr - Crear SubBot con QR\n`
    helpText += `├ ${usedPrefix}code - Crear SubBot con código\n`
    helpText += `└ 🔸 Sesión ultra-persistente con 25 intentos de reconexión\n\n`
    
    helpText += `🗑️ *Gestionar SubBots:*\n`
    helpText += `├ ${usedPrefix}deletebot - Eliminar SubBot específico\n`
    helpText += `├ ${usedPrefix}deletebot +número - Eliminar SubBot por número\n`
    helpText += `├ ${usedPrefix}deletebot all - Eliminar TODOS tus SubBots\n`
    helpText += `├ ${usedPrefix}stopbot - Alias para deletebot\n`
    helpText += `└ 🔸 Solo puedes eliminar tus propios SubBots\n\n`
    
    helpText += `📊 *Ver Estado:*\n`
    helpText += `├ ${usedPrefix}bots - Ver tus SubBots y estadísticas\n`
    helpText += `├ ${usedPrefix}bots all - Ver todos los SubBots (Owner)\n`
    helpText += `├ ${usedPrefix}listbots - Alias para bots\n`
    helpText += `└ 🔸 Información detallada con uptime y ping\n\n`

    helpText += `⚡ *CARACTERÍSTICAS ULTRA-PERSISTENTES:*\n\n`
    helpText += `🔄 *Reconexión Inteligente:*\n`
    helpText += `├ ✅ Hasta 5 intentos automáticos\n`
    helpText += `├ ✅ Detección proactiva de desconexiones\n`
    helpText += `├ ✅ Exponential backoff para estabilidad\n`
    helpText += `└ ✅ Monitoreo continuo cada 15 segundos\n\n`
    
    helpText += `🧠 *Gestión Inteligente de Memoria:*\n`
    helpText += `├ ✅ Limpieza automática de caché\n`
    helpText += `├ ✅ Garbage collection optimizado\n`
    helpText += `├ ✅ Límite de 15 conexiones simultáneas\n`
    helpText += `└ ✅ Máximo 2 SubBots por usuario\n\n`
    
    helpText += `💚 *Keep-Alive Optimizado:*\n`
    helpText += `├ ✅ Ping inteligente solo cuando es necesario\n`
    helpText += `├ ✅ Presence update eficiente cada 2 minutos\n`
    helpText += `├ ✅ Monitoreo de latencia en tiempo real\n`
    helpText += `└ ✅ Detección temprana de problemas\n\n`

    helpText += `🛡️ *LÍMITES Y PROTECCIONES:*\n\n`
    helpText += `📊 *Límites del Servidor:*\n`
    helpText += `├ 🔸 Máximo 15 SubBots simultáneos\n`
    helpText += `├ 🔸 Máximo 2 SubBots por usuario\n`
    helpText += `├ 🔸 Límite de memoria: 800MB\n`
    helpText += `└ 🔸 Limpieza automática de conexiones muertas\n\n`
    
    helpText += `⚠️ *Gestión de Recursos:*\n`
    helpText += `├ 🔹 Monitoreo continuo de memoria\n`
    helpText += `├ 🔹 Limpieza de chats antiguos (500 máx)\n`
    helpText += `├ 🔹 Caché de mensajes limitado (10 min)\n`
    helpText += `└ 🔹 Optimización automática de contactos\n\n`

    helpText += `📋 *EJEMPLOS DE USO:*\n\n`
    helpText += `🟢 *Crear tu primer SubBot:*\n`
    helpText += `└ ${usedPrefix}qr\n\n`
    
    helpText += `🔍 *Ver estado de tus SubBots:*\n`
    helpText += `└ ${usedPrefix}bots\n\n`
    
    helpText += `🗑️ *Eliminar SubBot específico:*\n`
    helpText += `└ ${usedPrefix}deletebot +51988514570\n\n`
    
    helpText += `💥 *Eliminar todos tus SubBots:*\n`
    helpText += `└ ${usedPrefix}deletebot all\n\n`

    if (memUsage > 800) {
      helpText += `⚠️ *SERVIDOR EN ALTA DEMANDA*\n`
      helpText += `├ Memoria actual: ${memUsage}MB (Crítico)\n`
      helpText += `├ SubBots activos: ${activeConnections.length}/${totalBots}\n`
      helpText += `└ 💡 Considera eliminar SubBots inactivos\n\n`
    } else if (activeConnections.length >= 12) {
      helpText += `⚠️ *SERVIDOR OCUPADO*\n`
      helpText += `├ SubBots activos: ${activeConnections.length}/15\n`
      helpText += `└ 💡 Pocos slots disponibles\n\n`
    } else {
      helpText += `✅ *SERVIDOR DISPONIBLE*\n`
      helpText += `├ Estado: Óptimo para nuevos SubBots\n`
      helpText += `├ Memoria: ${memUsage}MB\n`
      helpText += `└ Slots: ${activeConnections.length}/25 ocupados\n\n`
    }

    helpText += `💡 *CONSEJOS IMPORTANTES:*\n\n`
    helpText += `🔸 *Estabilidad:* Los SubBots se reconectan automáticamente\n`
    helpText += `🔸 *Límites:* Respeta los límites para mejor rendimiento\n`
    helpText += `🔸 *Limpieza:* Elimina SubBots que no uses regularmente\n`
    helpText += `🔸 *Monitoreo:* Usa ${usedPrefix}bots para ver el estado\n\n`

    helpText += `🆘 *SOLUCIÓN DE PROBLEMAS:*\n\n`
    helpText += `❓ *SubBot no se conecta:*\n`
    helpText += `├ Verifica tu conexión a internet\n`
    helpText += `├ Espera a que termine el proceso de reconexión\n`
    helpText += `└ Elimina y crea un nuevo SubBot si persiste\n\n`
    
    helpText += `❓ *SubBot se desconecta frecuentemente:*\n`
    helpText += `├ Problema normal, se reconecta automáticamente\n`
    helpText += `├ El sistema intenta hasta 25 reconexiones\n`
    helpText += `└ Verifica que no tengas más de 2 SubBots\n\n`
    
    helpText += `❓ *No puedo crear más SubBots:*\n`
    helpText += `├ Verifica que no tengas 2 SubBots ya activos\n`
    helpText += `├ El servidor puede estar lleno (25 máximo)\n`
    helpText += `└ Espera o elimina un SubBot existente\n\n`

    helpText += `⏰ *Última actualización:* ${new Date().toLocaleString('es-ES')}\n`
    helpText += `⚽️ *Isagi Yoichi Bot* - Sistema SubBot Ultra-Persistente`

    await m.reply(helpText)
    console.log(chalk.green(`✅ Ayuda de SubBot enviada a ${m.sender}`))

  } catch (error) {
    console.error('Error en comando subbot:', error)
    m.reply(`❌ *Error*\n\nOcurrió un error mostrando la ayuda.\n💡 Usa: ${usedPrefix}qr para crear un SubBot`)
  }
}

handler.help = ['subbot', 'jadibot', 'serbothelp']
handler.tags = ['serbot']
handler.command = ['subbot', 'jadibot', 'serbothelp', 'subbothelp']
handler.register = false

export default handler