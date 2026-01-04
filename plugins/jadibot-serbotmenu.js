const handler = async (m, { conn, usedPrefix, command, args }) => {
  
  if (!globalThis.db.data.settings[conn.user.jid].jadibotmd) {
    return m.reply(`🎯 El comando *${command}* está desactivado temporalmente.`)
  }
  
  
  if (!global.db.data.users[m.sender]) {
    global.db.data.users[m.sender] = { Subs: 0 }
  }
  
  
  let time = global.db.data.users[m.sender].Subs + 120000
  if (new Date - global.db.data.users[m.sender].Subs < 120000) {
    return conn.reply(m.chat, `⏱️ Debes esperar ${msToTime(time - new Date())} para volver a vincular un *Sub-Bot.*`, m)
  }
  
  
  const subBots = [...new Set([...global.conns.filter((conn) => 
    conn && conn.user && conn.ws && conn.ws.socket && conn.ws.socket.readyState === 1
  ).map((conn) => conn)])]
  const subBotsCount = subBots.length
  const maxSubBots = 15 
  
  if (subBotsCount >= maxSubBots) {
    return m.reply(`⚽ No se han encontrado espacios para *Sub-Bots* disponibles. (${subBotsCount}/${maxSubBots})`)
  }

  
  const isDebug = args.includes('debug')
  if (isDebug) {
    console.log('🔍 DEBUG MODE ACTIVATED for SerBot Menu')
  }
  
  
  const buttons = [
    ['📱 Código SMS', 'serbot_code'],
    ['📄 Código QR', 'serbot_qr']
  ]

  const text = `🤖 *CREAR SUB-BOT PERSISTENTE* ⚽

🌟 *¡Conviértete en un Sub-Bot de Isagi Yoichi!*

*Selecciona tu método de vinculación preferido:*

📱 **Código SMS**
• Recibes un código de 8 dígitos
• Lo ingresas en WhatsApp Web/Desktop
• Más rápido y directo

📄 **Código QR** 
• Escaneas un código QR
• Desde otro dispositivo móvil
• Método tradicional

🔒 **Características de tu SubBot:**
✅ Sesión persistente (24/7)
✅ Reconexión automática
✅ Todos los comandos disponibles
✅ Resistente a desconexiones
✅ Monitoreo de salud automático

📊 *SubBots activos:* ${subBotsCount}/${maxSubBots}

💡 *Tip:* El SubBot mantendrá tu sesión activa incluso si tu dispositivo principal se desconecta.

${isDebug ? '\n🔍 *Modo Debug Activado* - Se mostrarán logs detallados' : ''}`

  const footer = '⚽ Sistema de SubBots - Isagi Yoichi Bot'
  const serBotGif = 'https://media.tenor.com/aGsOxo7R4l0AAAPo/miku-channelcastation.mp4'

  try {
    
    return await conn.sendNCarousel(m.chat, text, footer, serBotGif, buttons, null, null, null, m)
  } catch (error) {
    console.log('❌ Error con sendNCarousel, intentando método alternativo:', error.message)
    
    
    try {
      const buttonMessage = {
        text: text,
        footer: footer,
        buttons: buttons.map((btn, index) => ({
          buttonId: btn[1],
          buttonText: { displayText: btn[0] },
          type: 1
        })),
        headerType: 4,
        imageMessage: await conn.getFile(serBotGif).then(res => res.data)
      }
      return await conn.sendMessage(m.chat, buttonMessage, { quoted: m })
    } catch (error2) {
      console.log('❌ Error con método alternativo 1:', error2.message)
      
     
      try {
        const quickReplyButtons = {
          text: text,
          footer: footer,
          templateButtons: buttons.map((btn, index) => ({
            index: index + 1,
            quickReplyButton: {
              displayText: btn[0],
              id: btn[1]
            }
          }))
        }
        return await conn.sendMessage(m.chat, quickReplyButtons, { quoted: m })
      } catch (error3) {
        console.log('❌ Error con método alternativo 2:', error3.message)
        
        
        const fallbackText = `${text}\n\n` +
          `⚠️ **Los botones no están funcionando correctamente**\n` +
          `Para continuar, usa uno de estos comandos:\n\n` +
          `📱 \`${usedPrefix}code\` - Generar código de vinculación\n` +
          `📄 \`${usedPrefix}qr\` - Generar código QR\n\n` +
          `💡 *Nota:* Los comandos directos siempre funcionan incluso si los botones fallan.\n\n` +
          `🔧 *Para soporte técnico*, contacta al administrador del bot.`
        
        await conn.reply(m.chat, fallbackText, m)
        
        
        try {
          await conn.sendMessage(m.chat, { 
            react: { text: '📱', key: m.key } 
          })
          setTimeout(async () => {
            await conn.sendMessage(m.chat, { 
              react: { text: '📄', key: m.key } 
            })
          }, 500)
          
          
          setTimeout(async () => {
            await conn.reply(m.chat, 
              `💡 *Alternativa:* También puedes reaccionar a este mensaje:\n` +
              `• 📱 = Código SMS\n• 📄 = Código QR`, m)
          }, 1000)
        } catch (e) {
          console.log('No se pudieron enviar reacciones alternativas')
        }
        
        return
      }
    }
  }
}


handler.before = async function (m, { conn, usedPrefix }) {
  if (!m.message) return false
  
  
  const isDebugMode = global.debugSerBot || false
  if (isDebugMode) {
    console.log('🔍 DEBUG: Estructura del mensaje recibido:')
    console.log(JSON.stringify(m.message, null, 2))
  }
  
 
  let buttonId = null
  let detectionMethod = null
  
  
  if (m.message.templateButtonReplyMessage) {
    buttonId = m.message.templateButtonReplyMessage.selectedId
    detectionMethod = 'templateButtonReply'
    console.log('🔍 Detectado templateButtonReply:', buttonId)
  }
  
  
  if (!buttonId && m.message.buttonsResponseMessage) {
    buttonId = m.message.buttonsResponseMessage.selectedButtonId
    detectionMethod = 'buttonsResponse'
    console.log('🔍 Detectado buttonsResponse:', buttonId)
  }
  
 
  if (!buttonId && m.message.listResponseMessage) {
    buttonId = m.message.listResponseMessage.singleSelectReply?.selectedRowId
    detectionMethod = 'listResponse'
    console.log('🔍 Detectado listResponse:', buttonId)
  }
  
  
  if (!buttonId && m.message.interactiveResponseMessage) {
    try {
      const paramsJson = m.message.interactiveResponseMessage.nativeFlowResponseMessage?.paramsJson
      if (paramsJson) {
        const params = JSON.parse(paramsJson)
        buttonId = params.id
        detectionMethod = 'interactiveResponse'
        console.log('🔍 Detectado interactiveResponse:', buttonId)
      }
    } catch (e) {
      console.log('⚠️ Error parseando respuesta interactiva:', e.message)
    }
  }
  
  
  if (!buttonId && m.message.buttonResponseMessage) {
    buttonId = m.message.buttonResponseMessage.selectedButtonId
    detectionMethod = 'buttonResponse'
    console.log('🔍 Detectado buttonResponse:', buttonId)
  }
  
  
  if (!buttonId && m.message.selectionResponseMessage) {
    buttonId = m.message.selectionResponseMessage.selectedRowId
    detectionMethod = 'selectionResponse'
    console.log('🔍 Detectado selectionResponse:', buttonId)
  }
  
 
  if (!buttonId && m.message.reactionMessage) {
    const reaction = m.message.reactionMessage.text
    if (reaction === '📱') {
      buttonId = 'serbot_code'
      detectionMethod = 'reaction'
      console.log('🔍 Detectado por reacción: 📱 (código SMS)')
    } else if (reaction === '📄') {
      buttonId = 'serbot_qr'
      detectionMethod = 'reaction'
      console.log('🔍 Detectado por reacción: 📄 (código QR)')
    }
  }
  
  
  if (!buttonId && m.text) {
    const text = m.text.toLowerCase().trim()
    
    
    const hasCommandPrefix = text.startsWith('.') || text.startsWith('#') || text.startsWith('/')
    const isStandaloneQR = text === 'qr' && !hasCommandPrefix
    const isJustQRCode = text.includes('código qr') || text.includes('codigo qr')
    
    if (text.includes('código sms') || text.includes('codigo sms') || text.includes('sms')) {
      buttonId = 'serbot_code'
      detectionMethod = 'text'
      console.log('🔍 Detectado por texto: código SMS')
    } else if (isJustQRCode || isStandaloneQR) {
      buttonId = 'serbot_qr'
      detectionMethod = 'text'
      console.log('🔍 Detectado por texto: código QR')
    }
  }
  
  
  if (isDebugMode) {
    console.log('🔍 DEBUG: Resultado de detección:')
    console.log('  ButtonID:', buttonId)
    console.log('  Method:', detectionMethod)
    console.log('  Message keys:', Object.keys(m.message))
  }
  
  
  if (buttonId && buttonId.startsWith('serbot_')) {
    console.log('🤖 PROCESANDO SERBOT BUTTON:', buttonId)
    
    
    if (!globalThis.db?.data?.settings?.[conn.user.jid]?.jadibotmd) {
      return conn.reply(m.chat, `🎯 El sistema de SubBots está desactivado temporalmente.`, m)
    }
    
    
    const user = global.db.data.users[m.sender]
    if (!user) {
      global.db.data.users[m.sender] = { Subs: 0 }
    }
    
    const timeLeft = user.Subs + 120000 - Date.now()
    if (timeLeft > 0) {
      return conn.reply(m.chat, `⏱️ Debes esperar ${msToTime(timeLeft)} para crear otro SubBot.`, m)
    }
    
    try {
      if (buttonId === 'serbot_code') {
        
        
        const { mikuJadiBot } = await import('./jadibot-serbot.js')
        const pathMikuJadiBot = `./jadi/${m.sender.split('@')[0]}`
        const fs = await import('fs')
        
        if (!fs.existsSync(pathMikuJadiBot)) {
          fs.mkdirSync(pathMikuJadiBot, { recursive: true })
        }
        
        const options = {
          pathMikuJadiBot,
          m,
          conn,
          args: ['code'],
          usedPrefix: '.',
          command: 'code',
          fromCommand: true
        }
        
        await mikuJadiBot(options)
        user.Subs = Date.now()
        return true
        
      } else if (buttonId === 'serbot_qr') {
        
        
        const { mikuJadiBot } = await import('./jadibot-serbot.js')
        const pathMikuJadiBot = `./jadi/${m.sender.split('@')[0]}`
        const fs = await import('fs')
        
        if (!fs.existsSync(pathMikuJadiBot)) {
          fs.mkdirSync(pathMikuJadiBot, { recursive: true })
        }
        
        const options = {
          pathMikuJadiBot,
          m,
          conn,
          args: [],
          usedPrefix: '.',
          command: 'qr',
          fromCommand: true
        }
        
        await mikuJadiBot(options)
        user.Subs = Date.now()
        return true
      }
    } catch (error) {
      console.error('❌ Error procesando botón de SubBot:', error)
      await conn.reply(m.chat, `❌ Error procesando comando de SubBot: ${error.message}\n\nIntenta usar los comandos directos:\n• \`.code\` - Para código\n• \`.qr\` - Para QR`, m)
      return true 
    }
  }
  
  return false
}

function msToTime(duration) {
  const milliseconds = parseInt((duration % 1000) / 100)
  const seconds = Math.floor((duration / 1000) % 60)
  const minutes = Math.floor((duration / (1000 * 60)) % 60)
  const hours = Math.floor((duration / (1000 * 60 * 60)) % 24)
  
  const h = (hours < 10) ? '0' + hours : hours
  const m = (minutes < 10) ? '0' + minutes : minutes
  const s = (seconds < 10) ? '0' + seconds : seconds
  
  return `${h}h ${m}m ${s}s`
}

handler.help = ['serbot', 'subbot', 'jadibot', 'serbotdebug']
handler.tags = ['serbot']
handler.command = /^(serbot|subbot|jadibot|serbotdebug)$/i


handler.before2 = async function(m, { conn, command }) {
  if (command === 'serbotdebug') {
    global.debugSerBot = !global.debugSerBot
    return conn.reply(m.chat, `🔍 Debug de SerBot ${global.debugSerBot ? 'ACTIVADO' : 'DESACTIVADO'}`, m)
  }
}

export default handler