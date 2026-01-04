import fs from 'fs'
import path from 'path'
import chalk from 'chalk'


export async function autoReconnectSubBots() {
  console.log(chalk.blue('🔄 Iniciando sistema de reconexión automática optimizado...'))
  
  try {
    const jadiDir = `./${global.jadi}/`
    if (!fs.existsSync(jadiDir)) {
      console.log(chalk.yellow('📁 No existe directorio de sesiones, omitiendo reconexión automática'))
      return
    }

    const sessions = fs.readdirSync(jadiDir)
    if (sessions.length === 0) {
      console.log(chalk.yellow('📋 No hay sesiones guardadas para reconectar'))
      return
    }

    console.log(chalk.blue(`📊 Encontradas ${sessions.length} sesiones guardadas`))
    
    let reconnectedCount = 0
    let skippedCount = 0
    const { mikuJadiBot } = await import('./plugins/jadibot-serbot.js')

    for (const session of sessions) {
      const sessionPath = path.join(jadiDir, session)
      const credsPath = path.join(sessionPath, "creds.json")
      const tokenPath = path.join(sessionPath, "token.json")
      
      
      if (!fs.existsSync(credsPath)) {
        console.log(chalk.yellow(`⚠️ Sin credenciales para sesión ${session}, omitiendo...`))
        skippedCount++
        continue
      }

      try {
       
        const credsData = JSON.parse(fs.readFileSync(credsPath, 'utf8'))
        if (!credsData || !credsData.me || !credsData.me.jid) {
          console.log(chalk.yellow(`⚠️ Credenciales inválidas para sesión ${session}, omitiendo...`))
          skippedCount++
          continue
        }

       
        const isAlreadyConnected = global.conns.some(subbot => 
          subbot && 
          subbot.user && 
          subbot.user.jid && 
          subbot.user.jid.includes(session) &&
          subbot.ws?.socket?.readyState === 1 
        )

        if (isAlreadyConnected) {
          console.log(chalk.green(`✅ Sesión ${session} ya está conectada y funcionando`))
          skippedCount++
          continue
        }

       
        let shouldReconnect = true
        if (fs.existsSync(tokenPath)) {
          try {
            const tokenData = JSON.parse(fs.readFileSync(tokenPath, 'utf8'))
            const lastActivity = tokenData.lastActivity || tokenData.created || 0
            const daysSinceActivity = lastActivity > 0 ? 
              (Date.now() - lastActivity) / (24 * 60 * 60 * 1000) : 999
            
            if (daysSinceActivity > 7) { 
              console.log(chalk.yellow(`⚠️ Sesión ${session} inactiva ${Math.floor(daysSinceActivity)} días, omitiendo...`))
              shouldReconnect = false
            }
          } catch (error) {
            console.log(chalk.yellow(`⚠️ Token corrupto para sesión ${session}, intentando reconectar...`))
          }
        }

        if (!shouldReconnect) {
          skippedCount++
          continue
        }

        console.log(chalk.blue(`🔄 Reconectando sesión ${session}...`))

        
        const mockMessage = {
          sender: `${session}@s.whatsapp.net`,
          chat: null,
          fromMe: false,
          isGroup: false
        }

        const mikuJBOptions = {
          pathMikuJadiBot: sessionPath,
          m: mockMessage,
          conn: global.conn,
          args: [],
          usedPrefix: '.',
          command: 'qr',
          fromCommand: false,
          autoReconnect: true 
        }

       
        try {
          await mikuJadiBot(mikuJBOptions)
          console.log(chalk.green(`✅ Reconexión iniciada para sesión ${session}`))
          reconnectedCount++
        } catch (error) {
          console.log(chalk.red(`❌ Error reconectando sesión ${session}: ${error.message}`))
          
          
          if (error.message.includes('ENOENT') || error.message.includes('invalid')) {
            console.log(chalk.yellow(`🗑️ Sesión ${session} parece corrupta, será limpiada en próximo ciclo`))
          }
        }
        
        
        await new Promise(resolve => setTimeout(resolve, 3000))

      } catch (error) {
        console.log(chalk.red(`❌ Error procesando sesión ${session}: ${error.message}`))
        skippedCount++
      }
    }

    console.log(chalk.green(`🎉 Reconexión completada: ${reconnectedCount} iniciadas, ${skippedCount} omitidas`))

  } catch (error) {
    console.error(chalk.red(`❌ Error en reconexión automática: ${error.message}`))
  }
}


export function startSubBotCleanupScheduler() {
  console.log(chalk.blue('🧹 Iniciando programador de limpieza inteligente de Sub-Bots...'))
  
  
  setInterval(async () => {
    console.log(chalk.blue('🧹 Ejecutando limpieza programada de sesiones inactivas...'))
    
    try {
      const jadiDir = `./${global.jadi}/`
      if (!fs.existsSync(jadiDir)) return

      const sessions = fs.readdirSync(jadiDir)
      const currentTime = Date.now()
      const maxInactiveTime = 7 * 24 * 60 * 60 * 1000 
      let cleanedCount = 0

      for (const session of sessions) {
        const sessionPath = path.join(jadiDir, session)
        const tokenPath = path.join(sessionPath, "token.json")
        const credsPath = path.join(sessionPath, "creds.json")
        
        
        const isActive = global.conns.some(subbot => 
          subbot && 
          subbot.user?.jid?.includes(session) && 
          subbot.ws?.socket?.readyState === 1 
        )
        
        if (!isActive) {
          let shouldClean = false
          let lastActivity = 0
          
          if (fs.existsSync(tokenPath)) {
            try {
              const tokenData = JSON.parse(fs.readFileSync(tokenPath, 'utf8'))
              lastActivity = tokenData.lastActivity || tokenData.created || 0
              
              if (lastActivity > 0 && currentTime - lastActivity > maxInactiveTime) {
                shouldClean = true
              }
            } catch (error) {
              
              console.log(chalk.yellow(`⚠️ Token corrupto para ${session}, verificando credenciales...`))
              if (!fs.existsSync(credsPath)) {
                shouldClean = true
              }
            }
          } 
          
          
          if (!shouldClean && fs.existsSync(credsPath)) {
            try {
              const creds = JSON.parse(fs.readFileSync(credsPath, 'utf8'))
              if (!creds || !creds.me) {
                shouldClean = true
              } else {
                // Usar fecha de modificación del archivo
                const stats = fs.statSync(credsPath)
                lastActivity = stats.mtime.getTime()
                if (currentTime - lastActivity > maxInactiveTime) {
                  shouldClean = true
                }
              }
            } catch (error) {
              shouldClean = true 
            }
          } else if (!fs.existsSync(credsPath) && !fs.existsSync(tokenPath)) {
            shouldClean = true 
          }
          
          if (shouldClean) {
            const inactiveDays = lastActivity > 0 ? 
              Math.floor((currentTime - lastActivity) / (24 * 60 * 60 * 1000)) : 
              'desconocido'
              
            try {
              fs.rmSync(sessionPath, { recursive: true, force: true })
              cleanedCount++
              console.log(chalk.yellow(`🧹 Sesión limpiada (inactiva ${inactiveDays} días): ${session}`))
            } catch (error) {
              console.error(chalk.red(`Error limpiando sesión ${session}: ${error.message}`))
            }
          }
        } else {
          
          if (fs.existsSync(tokenPath)) {
            try {
              const tokenData = JSON.parse(fs.readFileSync(tokenPath, 'utf8'))
              tokenData.lastActivity = currentTime
              fs.writeFileSync(tokenPath, JSON.stringify(tokenData, null, 2))
            } catch (error) {
              
            }
          }
        }
      }

      if (cleanedCount > 0) {
        console.log(chalk.green(`🧹 Limpieza completada: ${cleanedCount} sesiones inactivas eliminadas`))
      } else {
        console.log(chalk.blue(`🧹 Limpieza completada: No hay sesiones para eliminar`))
      }

    } catch (error) {
      console.error(chalk.red(`❌ Error en limpieza programada: ${error.message}`))
    }
  }, 4 * 60 * 60 * 1000) 
}

export function startSubBotHealthMonitor() {
  console.log(chalk.blue('💓 Iniciando monitor de salud mejorado de Sub-Bots...'))
  
  setInterval(() => {
    try {
      if (!global.conns || !Array.isArray(global.conns)) {
        return
      }

      const activeSubBots = global.conns.filter(subbot => 
        subbot && subbot.user && subbot.ws
      )

      let cleanedCount = 0
      activeSubBots.forEach(subbot => {
        const userId = subbot.user?.jid?.split('@')[0] || 'unknown'
        const socket = subbot.ws?.socket
        
        
        const isDisconnected = !socket || 
          socket.readyState === 3 || 
          socket.readyState === 2    
        
        if (isDisconnected) {
          console.log(chalk.yellow(`💓 Conexión problemática para +${userId}, limpiando...`))
          
          try {
            
            if (subbot.ev) {
              subbot.ev.removeAllListeners()
            }
            if (subbot.ws && typeof subbot.ws.close === 'function') {
              try {
                subbot.ws.close()
              } catch (e) {}
            }
            
            let i = global.conns.indexOf(subbot)
            if (i >= 0) {
              delete global.conns[i]
              global.conns.splice(i, 1)
              cleanedCount++
            }
          } catch (error) {
            console.error(chalk.red(`Error limpiando subbot +${userId}: ${error.message}`))
          }
        }
        
        else if (socket && socket.readyState === 1) {
          
          if (subbot.user) {
            subbot.lastSeen = Date.now()
          }
          
          
          if (subbot.sendMessage && Math.random() < 0.1) { 
            subbot.sendMessage(subbot.user.jid, { text: 'ping' })
              .catch(() => {
                console.log(chalk.yellow(`⚠️ SubBot +${userId} no responde a ping`))
              })
          }
        }
      })

      if (cleanedCount > 0) {
        console.log(chalk.green(`💓 Monitor de salud: ${cleanedCount} conexiones inválidas limpiadas`))
      }

     
      global.conns = global.conns.filter(c => c != null)

    } catch (error) {
      console.error(chalk.red(`❌ Error en monitor de salud: ${error.message}`))
    }
  }, 30000) 
}

export default {
  autoReconnectSubBots,
  startSubBotCleanupScheduler,
  startSubBotHealthMonitor
}
