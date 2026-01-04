import fs from 'fs'
import path from 'path'
import chalk from 'chalk'


function isSocketReady(s) {
  try {
    if (!s) return false
    const hasWebSocket = s.ws && s.ws.socket
    const isOpen = hasWebSocket && s.ws.socket.readyState === 1 
    const hasUser = s.user && s.user.jid
    const hasAuthState = s.authState && s.authState.creds
    const isConnected = s.connectionStatus === 'open' || isOpen
    return hasWebSocket && isOpen && hasUser && hasAuthState && isConnected
  } catch (e) {
    return false
  }
}


function cleanPhoneNumber(phone) {
  if (!phone) return null
  let cleaned = phone.replace(/[^0-9]/g, '')
  if (cleaned.length >= 10 && cleaned.length <= 15) {
    return cleaned
  }
  return null
}

let handler = async (m, { conn, args, usedPrefix, command, isOwner }) => {
  try {
    const userPhone = cleanPhoneNumber(m.sender)
    
    if (!global.conns || global.conns.length === 0) {
      return m.reply(`❌ *No hay SubBots activos*\n\n📱 No tienes ningún SubBot conectado actualmente.\n\n💡 *Usa:* ${usedPrefix}qr para crear un SubBot`)
    }

    
    const userConnections = global.conns.filter(c => 
      c && c.user && c.user.jid && cleanPhoneNumber(c.user.jid) === userPhone
    )
    
   
    const activeUserConnections = userConnections.filter(c => isSocketReady(c))

   
    if (args[0] && args[0] !== 'all' && args[0] !== 'force') {
      const targetPhone = cleanPhoneNumber(args[0])
      if (!targetPhone) {
        return m.reply(`❌ *Número inválido*\n\n📱 El número proporcionado no es válido.\n\n💡 *Ejemplo:* ${usedPrefix}${command} +51988514570`)
      }

      
      const targetConnection = global.conns.find(c => 
        c && c.user && cleanPhoneNumber(c.user.jid) === targetPhone
      )

      if (!targetConnection) {
        
        const sessionPath = path.join(process.cwd(), 'jadi', targetPhone)
        if (fs.existsSync(sessionPath)) {
          try {
            fs.rmSync(sessionPath, { recursive: true, force: true })
            return m.reply(`✅ *Sesión fantasma eliminada*\n\n🗑️ Se eliminó la sesión de +${targetPhone} del servidor\n📁 No había conexión activa pero se limpió el directorio\n\n💡 *Usa:* ${usedPrefix}qr para crear un nuevo SubBot`)
          } catch (e) {
            return m.reply(`❌ *Error eliminando sesión*\n\n⚠️ No se pudo eliminar la sesión de +${targetPhone}: ${e.message}`)
          }
        }
        return m.reply(`❌ *SubBot no encontrado*\n\n📱 No se encontró un SubBot con el número +${targetPhone}\n\n💡 *Usa:* ${usedPrefix}bots para ver SubBots activos`)
      }

      
      if (!isOwner && cleanPhoneNumber(targetConnection.user.jid) !== userPhone) {
        return m.reply(`🚫 *Sin permisos*\n\n❌ Solo puedes eliminar tus propios SubBots.\n\n💡 *Usa:* ${usedPrefix}bots para ver tus SubBots`)
      }

      
      await deleteSubBot(targetConnection, targetPhone, m, conn, usedPrefix)
      return
    }

    
    if (args[0] === 'force') {
      let cleanedCount = 0
      
      
      for (const bot of userConnections) {
        const phoneToDelete = cleanPhoneNumber(bot.user.jid)
        await deleteSubBot(bot, phoneToDelete, null, null, null, true)
        cleanedCount++
      }
      
     
      const jadiDir = path.join(process.cwd(), 'jadi')
      if (fs.existsSync(jadiDir)) {
        try {
          const sessionDirs = fs.readdirSync(jadiDir)
          for (const dir of sessionDirs) {
            if (dir === userPhone) {
              const sessionPath = path.join(jadiDir, dir)
              fs.rmSync(sessionPath, { recursive: true, force: true })
              cleanedCount++
              console.log(chalk.blue(`🗑️ Sesión fantasma eliminada: ${dir}`))
            }
          }
        } catch (e) {
          console.error('Error buscando sesiones fantasma:', e.message)
        }
      }
      
      return m.reply(`🔥 *FORCE: Limpieza completa realizada*\n\n🗑️ Se eliminaron ${cleanedCount} elementos\n📁 Conexiones en memoria y archivos de sesión\n💾 Tu número está completamente limpio\n\n💡 *Usa:* ${usedPrefix}qr para crear un nuevo SubBot`)
    }

    if (userConnections.length === 0) {
      return m.reply(`❌ *No tienes SubBots*\n\n📱 No se encontraron SubBots asociados a tu número.\n\n💡 *Usa:* ${usedPrefix}qr para crear un SubBot`)
    }

    
    if (userConnections.length === 1) {
      const phoneToDelete = cleanPhoneNumber(userConnections[0].user.jid)
      await deleteSubBot(userConnections[0], phoneToDelete, m, conn, usedPrefix)
      return
    }

    
    let botsList = `🤖 *Tus SubBots (Activos e Inactivos)*\n\n`
    botsList += `📱 Tienes ${userConnections.length} SubBot(s) registrado(s):\n\n`
    
    userConnections.forEach((bot, index) => {
      const botPhone = cleanPhoneNumber(bot.user.jid)
      const uptime = bot.sessionStartTime ? 
        msToTime(Date.now() - bot.sessionStartTime) : 'Desconocido'
      const reconnects = bot.reconnectAttempts || 0
      const isActive = isSocketReady(bot)
      
      botsList += `${index + 1}. 📞 +${botPhone}\n`
      botsList += `   ⏰ Uptime: ${uptime}\n`
      botsList += `   🔄 Reconexiones: ${reconnects}\n`
      botsList += `   💾 Estado: ${isActive ? '🟢 Activo' : '🔴 Inactivo/Roto'}\n\n`
    })
    
    botsList += `💡 *Para eliminar un SubBot específico:*\n`
    botsList += `${usedPrefix}${command} +número\n\n`
    botsList += `🗑️ *Para eliminar TODOS tus SubBots:*\n`
    botsList += `${usedPrefix}${command} all\n\n`
    botsList += `🔥 *Para limpieza FORZADA (todo):*\n`
    botsList += `${usedPrefix}${command} force\n\n`
    botsList += `⚠️ *Nota:* Se pueden eliminar SubBots inactivos/rotos`

    if (args[0] === 'all') {
      
      let deletedCount = 0
      for (const bot of userConnections) {
        const phoneToDelete = cleanPhoneNumber(bot.user.jid)
        await deleteSubBot(bot, phoneToDelete, null, null, null, true) 
        deletedCount++
      }
      
      return m.reply(`✅ *SubBots eliminados*\n\n🗑️ Se eliminaron ${deletedCount} SubBot(s) exitosamente.\n📁 Las sesiones han sido borradas del servidor.\n💡 Incluye SubBots activos e inactivos.\n\n💡 *Usa:* ${usedPrefix}qr para crear un nuevo SubBot`)
    }

    m.reply(botsList)

  } catch (error) {
    console.error('Error en deletebot:', error)
    m.reply(`❌ *Error interno*\n\n⚠️ Ocurrió un error al procesar la solicitud.\n💡 Intenta nuevamente en unos momentos.`)
  }
}


async function deleteSubBot(bot, phoneNumber, m, conn, usedPrefix, silent = false) {
  try {
    console.log(chalk.red(`🗑️ Eliminando SubBot +${phoneNumber}...`))
    
    
    if (bot) bot._isBeingDeleted = true
    
   
    try {
      if (bot && bot._keepAliveInterval) {
        clearInterval(bot._keepAliveInterval)
        bot._keepAliveInterval = null
      }
      if (bot && bot._saveCredsInterval) {
        clearInterval(bot._saveCredsInterval)
        bot._saveCredsInterval = null
      }
      if (bot && bot._inactivityMonitor) {
        clearInterval(bot._inactivityMonitor)
        bot._inactivityMonitor = null
      }
      if (bot && bot.heartbeatInterval) {
        clearInterval(bot.heartbeatInterval)
        bot.heartbeatInterval = null
      }
      if (bot && bot._presenceInterval) {
        clearInterval(bot._presenceInterval)
        bot._presenceInterval = null
      }
    } catch (e) {
      console.log(chalk.yellow(`⚠️ Error limpiando intervalos: ${e.message}`))
    }

    
    try {
      if (bot && bot.ws && typeof bot.ws.close === 'function') {
        
        if (bot.saveCreds) {
          bot.saveCreds = () => {} 
        }
        if (bot.saveState) {
          bot.saveState = () => {}   
        }
        bot.ws.close()
      }
    } catch (e) {
      console.log(chalk.yellow(`⚠️ Error cerrando WebSocket: ${e.message}`))
    }

   
    try {
      if (bot && bot.ev && typeof bot.ev.removeAllListeners === 'function') {
        bot.ev.removeAllListeners()
      }
    } catch (e) {
      console.log(chalk.yellow(`⚠️ Error removiendo listeners: ${e.message}`))
    }

    
    try {
      
      const connectionIndex = global.conns.findIndex(c => 
        c && c.user && c.user.jid && cleanPhoneNumber(c.user.jid) === phoneNumber
      )
      
      if (connectionIndex !== -1) {
        global.conns.splice(connectionIndex, 1)
        console.log(chalk.blue(`🗑️ SubBot +${phoneNumber} removido de global.conns (índice ${connectionIndex})`))
      } else {
       
        const directIndex = global.conns.findIndex(c => c === bot)
        if (directIndex !== -1) {
          global.conns.splice(directIndex, 1)
          console.log(chalk.blue(`🗑️ SubBot +${phoneNumber} removido de global.conns por referencia (índice ${directIndex})`))
        } else {
          console.log(chalk.yellow(`⚠️ SubBot +${phoneNumber} no encontrado en global.conns para eliminar`))
        }
      }
    } catch (e) {
      console.log(chalk.yellow(`⚠️ Error removiendo de global.conns: ${e.message}`))
    }

   
    const sessionPath = path.join(process.cwd(), 'jadi', phoneNumber)
    if (fs.existsSync(sessionPath)) {
      try {
        fs.rmSync(sessionPath, { recursive: true, force: true })
        console.log(chalk.blue(`📁 Sesión +${phoneNumber} eliminada del servidor`))
      } catch (e) {
        console.error('Error eliminando sesión:', e.message)
      }
    } else {
      console.log(chalk.yellow(`⚠️ Directorio de sesión no encontrado: ${sessionPath}`))
    }

    if (!silent && m) {
      const activeConnections = global.conns.filter(c => c && c.user && isSocketReady(c)).length
      
      await m.reply(`✅ *SubBot eliminado exitosamente*\n\n🗑️ SubBot +${phoneNumber} desconectado\n📁 Sesión eliminada del servidor\n📊 SubBots activos restantes: ${activeConnections}\n\n💡 *Usa:* ${usedPrefix}qr para crear un nuevo SubBot`)
    }

    console.log(chalk.green(`✅ SubBot +${phoneNumber} eliminado completamente`))
    
  } catch (error) {
    console.error(`Error eliminando SubBot +${phoneNumber}:`, error)
    if (!silent && m) {
      m.reply(`⚠️ Error eliminando SubBot +${phoneNumber}: ${error.message}`)
    }
  }
}


function msToTime(duration) {
  var milliseconds = parseInt((duration % 1000) / 100),
  seconds = Math.floor((duration / 1000) % 60),
  minutes = Math.floor((duration / (1000 * 60)) % 60),
  hours = Math.floor((duration / (1000 * 60 * 60)) % 24)
  hours = (hours < 10) ? '0' + hours : hours
  minutes = (minutes < 10) ? '0' + minutes : minutes
  seconds = (seconds < 10) ? '0' + seconds : seconds
  return minutes + ' m y ' + seconds + ' s '
}

handler.help = ['deletebot', 'deletesesion', 'stopbot']
handler.tags = ['serbot']
handler.command = ['deletebot', 'deletesesion', 'stopbot', 'delbot']
handler.register = false

export default handler