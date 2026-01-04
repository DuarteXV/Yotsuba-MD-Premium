import fs from 'fs'
import path from 'path'

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!globalThis.db?.data?.settings?.[conn.user.jid]?.jadibotmd) {
    return m.reply(`⚽️ El sistema de Sub-Bots está desactivado temporalmente.`)
  }

  if (!args[0]) {
    return m.reply(`📋 *Gestión de Tokens Sub-Bot*\n\n` +
      `🔹 \`${usedPrefix + command} mitoken\` - Ver tu token actual\n` +
      `🔹 \`${usedPrefix + command} reconectar <token>\` - Reconectar con token\n` +
      `🔹 \`${usedPrefix + command} info\` - Información del token\n` +
      `🔹 \`${usedPrefix + command} legacy\` - Token tradicional (base64)\n\n` +
      `💡 *Tip:* El token te permite reconectar tu Sub-Bot sin generar un nuevo QR.`)
  }

  let user = global.db.data.users[m.sender]
  if (!user.subBotToken) user.subBotToken = null
  if (!user.subBotConnected) user.subBotConnected = false

  const action = args[0].toLowerCase()
  const userId = m.sender.split('@')[0]

  switch (action) {
    case 'mitoken':
    case 'token':
      if (!user.subBotToken) {
        return m.reply(`❌ No tienes un token de Sub-Bot asignado.\n\n` +
          `💡 Genera uno usando: \`${usedPrefix}qr\` o \`${usedPrefix}code\``)
      }
      
      const tokenAge = Date.now() - user.subBotLastConnect
      const tokenStatus = user.subBotConnected ? '🟢 Conectado' : '🔴 Desconectado'
      
      return m.reply(`🎫 *Tu Token de Sub-Bot*\n\n` +
        `\`${user.subBotToken}\`\n\n` +
        `📊 *Estado:* ${tokenStatus}\n` +
        `⏰ *Última conexión:* ${user.subBotLastConnect ? new Date(user.subBotLastConnect).toLocaleString() : 'Nunca'}\n` +
        `🔄 *Reconexiones:* ${user.subBotReconnects || 0}\n\n` +
        `💾 *Guarda este token para reconectar automáticamente.*`)

    case 'legacy':
    case 'tradicional':
      
      if (fs.existsSync(`./${global.jadi}/` + userId + '/creds.json')) {
        let token = Buffer.from(fs.readFileSync(`./${global.jadi}/` + userId + '/creds.json'), 'utf-8').toString('base64')    
        
        await conn.reply(m.chat, `🎫 *Token Tradicional (Base64)*\n\n` +
          `El token te permite iniciar sesión en otros bots, recomendamos no compartirlo con nadie\n\n` +
          `*Tu token tradicional es:*`, m)
        await conn.reply(m.chat, token, m)
      } else {
        await conn.reply(m.chat, `❌ No tienes ningún token activo, usa \`${usedPrefix}qr\` para crear uno.`, m)
      }
      break

    case 'reconectar':
    case 'connect':
      if (!args[1]) {
        return m.reply(`❌ Debes proporcionar tu token.\n\n` +
          `📝 Uso: \`${usedPrefix + command} reconectar <tu-token>\``)
      }

      const providedToken = args[1]
      
      
      if (user.subBotToken && user.subBotToken !== providedToken) {
        return m.reply(`❌ Token inválido. Este token no corresponde a tu cuenta.`)
      }

      const pathMikuJadiBot = path.join(`./${global.jadi}/`, userId)
      const pathCreds = path.join(pathMikuJadiBot, "creds.json")
      
      if (!fs.existsSync(pathCreds)) {
        return m.reply(`❌ No se encontraron credenciales guardadas para este token.\n\n` +
          `💡 Debes generar una nueva sesión con: \`${usedPrefix}qr\``)
      }

      
      const activeSubBot = global.conns.find(subbot => 
        subbot.user && subbot.user.jid && subbot.user.jid.includes(userId)
      )
      
      if (activeSubBot) {
        return m.reply(`⚠️ Ya tienes un Sub-Bot activo con este token.\n\n` +
          `🔗 Estado: Conectado y funcionando`)
      }

      
      try {
        const { mikuJadiBot } = await import('./jadibot-serbot.js')
        
        const mikuJBOptions = {
          pathMikuJadiBot,
          m,
          conn,
          args: [],
          usedPrefix,
          command: 'qr',
          fromCommand: true,
          userToken: providedToken
        }

        await mikuJadiBot(mikuJBOptions)
        
        user.subBotReconnects = (user.subBotReconnects || 0) + 1
        user.Subs = new Date * 1
        
        return m.reply(`🔄 Iniciando reconexión con token...\n\n` +
          `⏳ Por favor espera mientras se establece la conexión.`)
          
      } catch (error) {
        console.error('Error en reconexión por token:', error)
        return m.reply(`❌ Error al intentar reconectar: ${error.message}\n\n` +
          `💡 Intenta generar una nueva sesión con: \`${usedPrefix}qr\``)
      }

    case 'info':
    case 'ayuda':
      return m.reply(`📖 *Información sobre Tokens Sub-Bot*\n\n` +
        `🎫 **¿Qué es un token?**\n` +
        `Un identificador único que permite reconectar tu Sub-Bot sin escanear QR nuevamente.\n\n` +
        `🔄 **¿Cómo funciona?**\n` +
        `• Se genera automáticamente al crear tu primer Sub-Bot\n` +
        `• Guarda tus credenciales de conexión\n` +
        `• Permite reconexión automática\n\n` +
        `⚡ **Ventajas:**\n` +
        `• No necesitas escanear QR repetidamente\n` +
        `• Reconexión más rápida\n` +
        `• Sesión persistente\n\n` +
        `🔐 **Seguridad:**\n` +
        `• El token es único por usuario\n` +
        `• Solo tú puedes usarlo\n` +
        `• Se valida automáticamente\n\n` +
        `💡 **Comandos disponibles:**\n` +
        `• \`${usedPrefix + command} mitoken\` - Ver tu token\n` +
        `• \`${usedPrefix + command} reconectar <token>\` - Reconectar\n` +
        `• \`${usedPrefix + command} legacy\` - Token tradicional`)

    default:
      return m.reply(`❌ Acción no reconocida: \`${action}\`\n\n` +
        `📋 Usa \`${usedPrefix + command}\` para ver las opciones disponibles.`)
  }
}

handler.help = ['token', 'mitoken', 'reconectar']
handler.tags = ['serbot']
handler.command = ['token', 'mitoken', 'reconectar', 'reconnect']
handler.private = true

export default handler

