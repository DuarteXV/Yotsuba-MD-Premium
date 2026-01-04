import fs from 'fs'
import path from 'path'
import chalk from 'chalk'

let handler = async (m, { conn, args, usedPrefix, command, isOwner }) => {
  if (!isOwner) {
    return m.reply(`❌ Este comando es solo para propietarios del bot.`)
  }

  if (!args[0]) {
    return m.reply(`📊 *Panel de Administración Sub-Bots*\n\n` +
      `🔹 \`${usedPrefix + command} lista\` - Lista de Sub-Bots activos\n` +
      `🔹 \`${usedPrefix + command} estadisticas\` - Estadísticas generales\n` +
      `🔹 \`${usedPrefix + command} limpiar\` - Limpiar sesiones inactivas\n` +
      `🔹 \`${usedPrefix + command} desconectar <numero>\` - Desconectar Sub-Bot específico\n` +
      `🔹 \`${usedPrefix + command} tokens\` - Gestión de tokens\n\n` +
      `💡 *Administra y monitorea todos los Sub-Bots del sistema.*`)
  }

  const action = args[0].toLowerCase()

  switch (action) {
    case 'lista':
    case 'list':
      const activeSubBots = global.conns.filter(subbot => 
        subbot.user && subbot.ws.socket && subbot.ws.socket.readyState !== 3
      )
      
      if (activeSubBots.length === 0) {
        return m.reply(`📋 *Lista de Sub-Bots*\n\n❌ No hay Sub-Bots activos en este momento.`)
      }

      let listMessage = `📋 *Lista de Sub-Bots Activos* (${activeSubBots.length}/20)\n\n`
      
      activeSubBots.forEach((subbot, index) => {
        const userId = subbot.user?.jid?.split('@')[0] || 'Desconocido'
        const userName = subbot.user?.name || 'Sin nombre'
        const isConnected = subbot.ws.socket?.readyState === 1 ? '🟢' : '🟡'
        const reconnects = subbot.reconnectAttempts || 0
        const uptime = subbot.isInit ? Math.floor((Date.now() - (subbot.connectionTime || Date.now())) / 1000 / 60) : 0
        
        listMessage += `${index + 1}. ${isConnected} *${userName}* (+${userId})\n`
        listMessage += `   📊 Reconexiones: ${reconnects} | ⏱️ Activo: ${uptime}min\n\n`
      })

      return m.reply(listMessage)

    case 'estadisticas':
    case 'stats':
      const totalSubBots = global.conns.length
      const connectedSubBots = global.conns.filter(subbot => 
        subbot.ws.socket?.readyState === 1
      ).length
      const reconnectingSubBots = global.conns.filter(subbot => 
        subbot.isReconnecting
      ).length

      
      const jadiDir = `./${global.jadi}/`
      let totalSessions = 0
      let sessionsWithTokens = 0
      
      if (fs.existsSync(jadiDir)) {
        const sessions = fs.readdirSync(jadiDir)
        totalSessions = sessions.length
        
        sessions.forEach(session => {
          const tokenPath = path.join(jadiDir, session, "token.json")
          if (fs.existsSync(tokenPath)) {
            sessionsWithTokens++
          }
        })
      }

      return m.reply(`📊 *Estadísticas del Sistema Sub-Bot*\n\n` +
        `🤖 **Sub-Bots Registrados:** ${totalSubBots}\n` +
        `🟢 **Conectados:** ${connectedSubBots}\n` +
        `🟡 **Reconectando:** ${reconnectingSubBots}\n` +
        `🔴 **Desconectados:** ${totalSubBots - connectedSubBots}\n\n` +
        `📁 **Sesiones Guardadas:** ${totalSessions}\n` +
        `🎫 **Con Tokens:** ${sessionsWithTokens}\n` +
        `💾 **Sin Tokens:** ${totalSessions - sessionsWithTokens}\n\n` +
        `📈 **Capacidad:** ${totalSubBots}/20 (${Math.round((totalSubBots/20)*100)}%)\n` +
        `⚡ **Estado del Sistema:** ${totalSubBots < 15 ? '🟢 Óptimo' : totalSubBots < 18 ? '🟡 Moderado' : '🔴 Alto'}`)

    case 'limpiar':
    case 'cleanup':
      try {
        const jadiDir = `./${global.jadi}/`
        if (!fs.existsSync(jadiDir)) {
          return m.reply(`❌ No existe el directorio de sesiones.`)
        }

        const sessions = fs.readdirSync(jadiDir)
        const currentTime = Date.now()
        const maxInactiveTime = 24 * 60 * 60 * 1000 
        let cleanedCount = 0

        for (const session of sessions) {
          const sessionPath = path.join(jadiDir, session)
          const tokenPath = path.join(sessionPath, "token.json")
          const credsPath = path.join(sessionPath, "creds.json")
          
          let shouldClean = false
          
          
          const isActive = global.conns.some(subbot => 
            subbot.user?.jid?.includes(session)
          )
          
          if (!isActive) {
            if (fs.existsSync(tokenPath)) {
              try {
                const tokenData = JSON.parse(fs.readFileSync(tokenPath, 'utf8'))
                const lastActivity = tokenData.lastActivity || tokenData.created
                
                if (currentTime - lastActivity > maxInactiveTime) {
                  shouldClean = true
                }
              } catch (error) {
                shouldClean = true 
              }
            } else if (fs.existsSync(credsPath)) {
              
              const stats = fs.statSync(credsPath)
              if (currentTime - stats.mtime.getTime() > maxInactiveTime) {
                shouldClean = true
              }
            }
          }
          
          if (shouldClean) {
            try {
              fs.rmSync(sessionPath, { recursive: true, force: true })
              cleanedCount++
              console.log(chalk.yellow(`🧹 Sesión limpiada: ${session}`))
            } catch (error) {
              console.error(`Error limpiando sesión ${session}: ${error.message}`)
            }
          }
        }

        return m.reply(`🧹 *Limpieza de Sesiones Completada*\n\n` +
          `✅ Sesiones eliminadas: ${cleanedCount}\n` +
          `📁 Sesiones restantes: ${sessions.length - cleanedCount}\n\n` +
          `💡 Se eliminaron sesiones inactivas por más de 24 horas.`)

      } catch (error) {
        return m.reply(`❌ Error durante la limpieza: ${error.message}`)
      }

    case 'desconectar':
    case 'disconnect':
      if (!args[1]) {
        return m.reply(`❌ Debes especificar el número del Sub-Bot a desconectar.\n\n` +
          `📝 Uso: \`${usedPrefix + command} desconectar <numero>\`\n` +
          `💡 Usa \`${usedPrefix + command} lista\` para ver los números.`)
      }

      const indexToDisconnect = parseInt(args[1]) - 1
      const activeSubBotsDisc = global.conns.filter(subbot => 
        subbot.user && subbot.ws.socket && subbot.ws.socket.readyState !== 3
      )

      if (indexToDisconnect < 0 || indexToDisconnect >= activeSubBotsDisc.length) {
        return m.reply(`❌ Número de Sub-Bot inválido. Debe estar entre 1 y ${activeSubBotsDisc.length}.`)
      }

      const subbotToDisconnect = activeSubBotsDisc[indexToDisconnect]
      const userIdDisc = subbotToDisconnect.user?.jid?.split('@')[0] || 'Desconocido'
      const userNameDisc = subbotToDisconnect.user?.name || 'Sin nombre'

      try {
        subbotToDisconnect.ws.close()
        subbotToDisconnect.ev.removeAllListeners()
        
        let i = global.conns.indexOf(subbotToDisconnect)
        if (i >= 0) {
          delete global.conns[i]
          global.conns.splice(i, 1)
        }

        return m.reply(`✅ *Sub-Bot Desconectado*\n\n` +
          `👤 Usuario: ${userNameDisc} (+${userIdDisc})\n` +
          `🔌 Estado: Desconectado manualmente\n\n` +
          `💡 El usuario puede reconectar usando su token.`)

      } catch (error) {
        return m.reply(`❌ Error al desconectar Sub-Bot: ${error.message}`)
      }

    case 'tokens':
    case 'token':
      const jadiDirTokens = `./${global.jadi}/`
      if (!fs.existsSync(jadiDirTokens)) {
        return m.reply(`❌ No existe el directorio de sesiones.`)
      }

      const sessionsTokens = fs.readdirSync(jadiDirTokens)
      let tokenInfo = `🎫 *Gestión de Tokens Sub-Bot*\n\n`
      let tokenCount = 0

      sessionsTokens.forEach(session => {
        const tokenPath = path.join(jadiDirTokens, session, "token.json")
        if (fs.existsSync(tokenPath)) {
          try {
            const tokenData = JSON.parse(fs.readFileSync(tokenPath, 'utf8'))
            const created = new Date(tokenData.created).toLocaleDateString()
            const isActive = global.conns.some(subbot => 
              subbot.user?.jid?.includes(session)
            )
            
            tokenInfo += `${tokenCount + 1}. **+${session}** ${isActive ? '🟢' : '🔴'}\n`
            tokenInfo += `   📅 Creado: ${created}\n`
            tokenInfo += `   🔄 Reconexiones: ${tokenData.reconnects || 0}\n\n`
            tokenCount++
          } catch (error) {
            
          }
        }
      })

      if (tokenCount === 0) {
        tokenInfo += `❌ No hay tokens registrados en el sistema.`
      } else {
        tokenInfo += `📊 Total de tokens: ${tokenCount}`
      }

      return m.reply(tokenInfo)

    default:
      return m.reply(`❌ Acción no reconocida: \`${action}\`\n\n` +
        `📋 Usa \`${usedPrefix + command}\` para ver las opciones disponibles.`)
  }
}

handler.help = ['subbotadmin', 'sbadmin']
handler.tags = ['owner']
handler.command = ['subbotadmin', 'sbadmin', 'adminsubbot']
handler.rowner = true

export default handler

