const regexPatterns = {
  whatsappGroup: /(?:https?:\/\/)?(?:www\.)?chat\.whatsapp\.com\/(?:invite\/)?([0-9A-Za-z]{20,24})/gi,
  whatsappChannel: /(?:https?:\/\/)?(?:www\.)?whatsapp\.com\/channel\/([0-9A-Za-z]+)/gi,
  waMe: /(?:https?:\/\/)?(?:www\.)?wa\.me\/(?:qr\/|join\/)?([0-9A-Za-z+/=_-]+)/gi,
  genericLink: /(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9][\w\-]*[a-zA-Z0-9]*\.[a-zA-Z]{2,}(?:\/[^\s]*)?/gi,
  customDomains: [
    /carmecita\.by/gi,
    /t\.me\//gi,
    /discord\.gg\//gi
  ]
}

function detectLinks(text) {
  const results = {
    whatsappGroup: false,
    whatsappChannel: false,
    waMe: false,
    genericLink: false,
    customDomain: false,
    foundLinks: []
  }
  
  const groupMatches = text.match(regexPatterns.whatsappGroup)
  if (groupMatches) {
    results.whatsappGroup = true
    results.foundLinks.push(...groupMatches)
  }
  
  const channelMatches = text.match(regexPatterns.whatsappChannel)
  if (channelMatches) {
    results.whatsappChannel = true
    results.foundLinks.push(...channelMatches)
  }
  
  const waMeMatches = text.match(regexPatterns.waMe)
  if (waMeMatches) {
    results.waMe = true
    results.foundLinks.push(...waMeMatches)
  }
  
  const genericMatches = text.match(regexPatterns.genericLink)
  if (genericMatches) {
    results.genericLink = true
    results.foundLinks.push(...genericMatches)
  }
  
  for (const customRegex of regexPatterns.customDomains) {
    const customMatches = text.match(customRegex)
    if (customMatches) {
      results.customDomain = true
      results.foundLinks.push(...customMatches)
    }
  }
  
  return results
}

export async function before(m, { conn, isAdmin, isBotAdmin }) {
  try {
    if (!m || !m.text || m.text.trim() === '' || (m.isBaileys && m.fromMe) || !m.isGroup) {
      return true
    }
    
    if (!global.db) global.db = { data: { chats: {} } }
    if (!global.db.data) global.db.data = { chats: {} }
    if (!global.db.data.chats) global.db.data.chats = {}
    if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}
    
    const chat = global.db.data.chats[m.chat]
    
    if (!isBotAdmin) return true
    
    const userNumber = m.sender.split('@')[0]
    const linkDetection = detectLinks(m.text)
    
    if (chat.antiLink) {
      const foundProhibitedLink = linkDetection.whatsappGroup || linkDetection.whatsappChannel || linkDetection.waMe
      
      if (foundProhibitedLink && !isAdmin) {
        if (linkDetection.whatsappGroup) {
          try {
            const groupInviteCode = await conn.groupInviteCode(m.chat)
            if (m.text.includes(groupInviteCode)) {
              return true 
            }
          } catch (error) {
            console.error('❌ [ANTILINK] Error verificando grupo:', error)
          }
        }
        
        console.log(`🚫 [ANTILINK] Expulsando usuario ${userNumber} por enlace prohibido`)
        
        try {
          await conn.reply(
            m.chat,
            `⚽ ¡Fuera de juego! @${userNumber} ha sido expulsado del campo por enviar enlaces de WhatsApp! 🏃‍♂️🔥\n\n🔵 ¡En Blue Lock no permitimos enlaces de grupos/canales!`,
            m,
            { mentions: [m.sender] }
          )
          
          await conn.sendMessage(m.chat, { delete: m.key })
          await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
          
        } catch (error) {
          console.error('❌ [ANTILINK] Error durante expulsión:', error)
        }
        
        return false
      }
    }
    
    if (chat.antiLink2) {
      const foundAnyLink = linkDetection.genericLink || linkDetection.customDomain
      
      if (foundAnyLink && !isAdmin) {
        if (chat.antiLink && (linkDetection.whatsappGroup || linkDetection.whatsappChannel || linkDetection.waMe)) {
          return false
        }
        
        console.log(`🚫 [ANTILINK2] Expulsando usuario ${userNumber} por enlace genérico`)
        
        try {
          await conn.reply(
            m.chat,
            `⚽ ¡Tarjeta roja! @${userNumber} ha sido expulsado por enviar enlaces prohibidos! 🏃‍♂️🔥\n\n🔵 ¡En Blue Lock no permitimos enlaces de ningún tipo!`,
            m,
            { mentions: [m.sender] }
          )
          
          await conn.sendMessage(m.chat, { delete: m.key })
          await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
          
        } catch (error) {
          console.error('❌ [ANTILINK2] Error durante expulsión:', error)
        }
        
        return false
      }
    }
    
    return true
    
  } catch (error) {
    console.error('💥 [ANTILINK] ERROR CRÍTICO:', error)
    return true
  }
}