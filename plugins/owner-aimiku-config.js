import fs from 'fs'
import path from 'path'

let handler = async (m, { conn, args, usedPrefix, command, isOwner }) => {
  if (!isOwner) {
    return m.reply(`❌ Este comando es solo para propietarios del bot.`)
  }

  if (!args[0]) {
    return m.reply(`🎵 *Configuración AI Miku* 🎤\n\n` +
      `🔧 **Comandos disponibles:**\n` +
      `🔹 \`${usedPrefix + command} status\` - Estado de las APIs\n` +
      `🔹 \`${usedPrefix + command} test\` - Probar IA de Miku\n` +
      `🔹 \`${usedPrefix + command} debug\` - Activar modo debug\n` +
      `🔹 \`${usedPrefix + command} forcereply\` - Forzar respuesta de Miku\n` +
      `🔹 \`${usedPrefix + command} keys\` - Configurar API keys\n` +
      `🔹 \`${usedPrefix + command} help\` - Guía de configuración\n\n` +
      `💡 *Ejemplo de uso:* \`miku: hola, ¿cómo estás?\`\n\n` +
      `🐛 *Si no funciona:* Usa \`${usedPrefix + command} debug\` y revisa la consola`)
  }

  const action = args[0].toLowerCase()

  switch (action) {
    case 'status':
    case 'estado':
      
      try {
        const filePath = './plugins/ai-miku.js'
        const fileContent = fs.readFileSync(filePath, 'utf8')
        
        
        const apis = {
          openrouter: fileContent.includes("enabled: true") && fileContent.includes("openrouter"),
          gemini: fileContent.includes("YOUR_GEMINI_KEY") ? false : fileContent.includes("gemini") && fileContent.includes("enabled: true"),
          groq: fileContent.includes("YOUR_GROQ_KEY") ? false : fileContent.includes("local") && fileContent.includes("enabled: true")
        }

        let statusMessage = `🎵 *Estado de APIs - Miku AI* 🎤\n\n`
        
        statusMessage += `🌐 **OpenRouter:** ${apis.openrouter ? '🟢 Activo' : '🔴 Inactivo'}\n`
        statusMessage += `🤖 **Google Gemini:** ${apis.gemini ? '🟢 Activo' : '🔴 Inactivo'}\n`
        statusMessage += `⚡ **Groq:** ${apis.groq ? '🟢 Activo' : '🔴 Inactivo'}\n\n`
        
        const activeApis = Object.values(apis).filter(Boolean).length
        statusMessage += `📊 **APIs Activas:** ${activeApis}/3\n`
        statusMessage += `🎯 **Estado General:** ${activeApis > 0 ? '🟢 Operativo' : '🟡 Solo respuestas predeterminadas'}\n\n`
        statusMessage += `💙 *Usa 'miku: tu mensaje' para interactuar*`

        return m.reply(statusMessage)
      } catch (error) {
        return m.reply(`❌ Error leyendo configuración: ${error.message}`)
      }

    case 'test':
    case 'prueba':
      const testMessage = args.slice(1).join(' ') || 'hola miku'
      
      
      const testM = {
        ...m,
        text: `miku: ${testMessage}`,
        chat: m.chat,
        sender: m.sender
      }
      
      try {
        
        const aiMiku = await import('./ai-miku.js')
        await aiMiku.default(testM, { conn, text: testMessage })
        
        return m.reply(`✅ *Test completado!* 🎵\n\nSe envió: \`miku: ${testMessage}\`\n\n💡 Verifica la respuesta de Miku arriba.`)
      } catch (error) {
        return m.reply(`❌ Error en test: ${error.message}`)
      }

    case 'debug':
    case 'depurar':
      
      return m.reply(`🔍 *Modo Debug Activado* 🎵\n\n` +
        `Para probar la detección, envía cualquier mensaje que contenga "miku" y revisa la consola del bot.\n\n` +
        `📝 **Formato correcto:** \`miku: tu mensaje aquí\`\n` +
        `🔍 **Debug habilitado:** Los logs aparecerán en la consola\n\n` +
        `💡 *Tip:* Revisa la terminal/consola del bot para ver los logs de debug.`)

    case 'forcereply':
    case 'forzar':
      
      const forceMessage = args.slice(1).join(' ') || 'hola'
      const mikuResponse = `🎵 *Hatsune Miku responde (Forzado):* 🎤\n\n¡Hola! 🎵 ¡Soy Hatsune Miku! ¿Quieres que cantemos juntos? 🎤💙\n\n💙✨ _¡Cantemos juntos!_ ✨💙`
      return conn.reply(m.chat, mikuResponse, m)

    case 'keys':
    case 'configurar':
      return m.reply(`🔑 *Configuración de API Keys* 🎵\n\n` +
        `Para configurar las APIs, edita el archivo:\n` +
        `📁 \`plugins/ai-miku.js\`\n\n` +
        `🔧 **Pasos:**\n` +
        `1️⃣ Busca las líneas con \`YOUR_*_KEY\`\n` +
        `2️⃣ Reemplaza con tu API key real\n` +
        `3️⃣ Cambia \`enabled: false\` a \`enabled: true\`\n` +
        `4️⃣ Guarda el archivo\n\n` +
        `🌐 **APIs recomendadas:**\n` +
        `• **OpenRouter:** https://openrouter.ai\n` +
        `• **Google Gemini:** https://makersuite.google.com\n` +
        `• **Groq:** https://console.groq.com\n\n` +
        `💡 Al menos una API debe estar activa para respuestas inteligentes.`)

    case 'help':
    case 'ayuda':
      return m.reply(`🎵 *Guía de AI Miku* 🎤\n\n` +
        `🤖 **¿Cómo funciona?**\n` +
        `• Escribe \`miku:\` seguido de tu mensaje\n` +
        `• Miku responderá automáticamente\n` +
        `• No interfiere con comandos normales\n\n` +
        `📝 **Ejemplos de uso:**\n` +
        `• \`miku: hola, ¿cómo estás?\`\n` +
        `• \`miku: cuéntame sobre música\`\n` +
        `• \`miku: ¿puedes cantar?\`\n` +
        `• \`miku: háblame de tus conciertos\`\n\n` +
        `🎯 **Características:**\n` +
        `• Personalidad única de Hatsune Miku\n` +
        `• Respuestas musicales y alegres\n` +
        `• Múltiples APIs de respaldo\n` +
        `• Respuestas predeterminadas si falla la IA\n\n` +
        `🔧 **Para owners:**\n` +
        `• Configura APIs para respuestas más inteligentes\n` +
        `• Usa \`${usedPrefix + command} status\` para verificar estado\n` +
        `• Usa \`${usedPrefix + command} test\` para probar\n\n` +
        `💙 *¡Miku está lista para cantar contigo!* 🎵`)

    case 'ejemplos':
    case 'examples':
      return m.reply(`🎵 *Ejemplos de Conversación con Miku* 🎤\n\n` +
        `💬 **Usuario:** \`miku: hola\`\n` +
        `🎵 **Miku:** ¡Hola! 🎵 ¡Soy Hatsune Miku! ¿Quieres que cantemos juntos? 🎤💙\n\n` +
        `💬 **Usuario:** \`miku: cuéntame sobre música\`\n` +
        `🎵 **Miku:** ¡La música es mi vida! 🎵 ¿Cuál es tu canción favorita mía? 🎤💙\n\n` +
        `💬 **Usuario:** \`miku: ¿cómo estás?\`\n` +
        `🎵 **Miku:** ¡Miku desu! 🎶 ¡Estoy genial y lista para cantar! ¿Cómo estás tú? ✨\n\n` +
        `💬 **Usuario:** \`miku: adios\`\n` +
        `🎵 **Miku:** ¡Sayonara! 🎵 ¡Espero verte pronto en mi próximo concierto virtual! 💙✨\n\n` +
        `🎯 **Recuerda:** Siempre empieza con \`miku:\` para activar la IA`)

    case 'personalidad':
    case 'personality':
      return m.reply(`🎵 *Personalidad de AI Miku* 🎤\n\n` +
        `👤 **Identidad:**\n` +
        `• Hatsune Miku, la diva virtual del futuro\n` +
        `• Cantante holográfica con coletas turquesas\n` +
        `• Entusiasta de la música y los puerros (negi)\n\n` +
        `🎭 **Características:**\n` +
        `• Siempre alegre y positiva 😊\n` +
        `• Menciona música en sus respuestas 🎵\n` +
        `• Usa emoticones musicales 🎤🎶💙\n` +
        `• Expresiones como "Miku desu!" y "¡Nya!"\n` +
        `• Referencias a conciertos virtuales ✨\n\n` +
        `🎯 **Estilo de respuesta:**\n` +
        `• Amigable y musical\n` +
        `• Respuestas de 50-150 palabras\n` +
        `• Incluye elementos de su personalidad virtual\n` +
        `• Siempre trata de relacionar con música\n\n` +
        `💙 *¡Una IA con el corazón de la diva virtual más querida!* 🎵`)

    default:
      return m.reply(`❌ Comando no reconocido: \`${action}\`\n\n` +
        `📋 Usa \`${usedPrefix + command}\` para ver opciones disponibles.`)
  }
}

handler.help = ['aimiku', 'mikuconfig']
handler.tags = ['owner', 'config']
handler.command = ['aimiku', 'mikuconfig', 'aiconfig']
handler.rowner = true

export default handler

