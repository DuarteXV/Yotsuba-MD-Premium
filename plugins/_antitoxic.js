const toxicWords = {
  basic: [
    'puto', 'puta', 'cabron', 'cabrón', 'pendejo', 'pendeja',
    'idiota', 'estupido', 'estúpido', 'imbecil', 'imbécil',
    'mierda', 'joder', 'coño', 'cono', 'carajo', 'verga',
    'chingar', 'chinga', 'pinche', 'culero', 'culera',
    'marica', 'maricon', 'maricón', 'gay', 'joto', 'pargo','pinga',
    'chobolo dow'
  ],
  
  severe: [
    'hijo de puta', 'hijueputa', 'la concha de tu madre',
    'vete a la mierda', 'chupa pija', 'come mierda',
    'malparido', 'malparida', 'gonorrea', 'hp',
    'hdp', 'hdspm', 'ptm', 'ctm','zarnoso','sarnoso','sarnosa'
  ],
  
  discriminatory: [
    'negro', 'negra', 'indio', 'india', 'chino', 'china',
    'sudaca', 'sudaco', 'pocho', 'pocha', 'gringo', 'gringa'
  ],
  
  inappropriate: [
    'matar', 'morir', 'suicidio', 'suicidate', 'matate',
    'droga', 'cocaina', 'marihuana', 'mota', 'porro'
  ]
}

function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') 
    .replace(/[^a-z0-9\s]/g, '') 
    .replace(/\s+/g, ' ') 
    .trim()
}

function detectToxicContent(text) {
  const normalizedText = normalizeText(text)
  
  const detection = {
    isToxic: false,
    severity: 'none',
    foundWords: [],
    category: ''
  }
  
  for (const word of toxicWords.severe) {
    const normalizedWord = normalizeText(word)
    if (normalizedText.includes(normalizedWord)) {
      detection.isToxic = true
      detection.severity = 'severe'
      detection.foundWords.push(word)
      detection.category = 'Lenguaje extremadamente ofensivo'
    }
  }
  
  if (!detection.isToxic) {
    for (const word of toxicWords.discriminatory) {
      const normalizedWord = normalizeText(word)
      if (normalizedText.includes(normalizedWord)) {
        detection.isToxic = true
        detection.severity = 'discriminatory'
        detection.foundWords.push(word)
        detection.category = 'Lenguaje discriminatorio'
      }
    }
  }
  
  if (!detection.isToxic) {
    for (const word of toxicWords.inappropriate) {
      const normalizedWord = normalizeText(word)
      if (normalizedText.includes(normalizedWord)) {
        detection.isToxic = true
        detection.severity = 'inappropriate'
        detection.foundWords.push(word)
        detection.category = 'Contenido inapropiado'
      }
    }
  }
  
  if (!detection.isToxic) {
    for (const word of toxicWords.basic) {
      const normalizedWord = normalizeText(word)
      if (normalizedText.includes(normalizedWord)) {
        detection.isToxic = true
        detection.severity = 'basic'
        detection.foundWords.push(word)
        detection.category = 'Lenguaje ofensivo'
      }
    }
  }
  
  return detection
}

function getToxicMessage(userNumber, severity) {
  const messages = {
    basic: `⚽ ¡Tarjeta amarilla! @${userNumber} ha sido advertido por usar lenguaje inapropiado! 🏃‍♂️🔥\n\n🔵 ¡En Blue Lock mantenemos un ambiente de respeto y competitividad sana!`,
    
    severe: `⚽ ¡Tarjeta roja! @${userNumber} ha sido expulsado del campo por lenguaje extremadamente ofensivo! 🏃‍♂️🔥\n\n🔵 ¡En Blue Lock no toleramos este tipo de comportamiento!`,
    
    discriminatory: `⚽ ¡Expulsión inmediata! @${userNumber} ha sido expulsado por lenguaje discriminatorio! 🏃‍♂️🔥\n\n🔵 ¡En Blue Lock respetamos a todos los jugadores sin distinción!`,
    
    inappropriate: `⚽ ¡Falta técnica! @${userNumber} ha sido advertido por contenido inapropiado! 🏃‍♂️🔥\n\n🔵 ¡En Blue Lock mantenemos conversaciones enfocadas en el fútbol!`
  }
  
  return messages[severity] || messages.basic
}

export async function before(m, { conn, isAdmin, isBotAdmin }) {
  try {
    if (!m || !m.text || m.text.trim() === '' || (m.isBaileys && m.fromMe) || !m.isGroup) {
      return true
    }
    
    if (!global.db) global.db = { data: { chats: {} } }
    if (!global.db.data) global.db.data = { chats: {} }
    if (!global.db.data.chats) global.db.data.chats = {}
    if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = { antitoxic: false }
    
    const chat = global.db.data.chats[m.chat]
    
    if (chat.antitoxic === undefined) {
      chat.antitoxic = false
    }
    
    if (!chat.antitoxic || isAdmin) {
      return true
    }
    
    const userNumber = m.sender.split('@')[0]
    const toxicDetection = detectToxicContent(m.text)
    
    if (toxicDetection.isToxic) {
      console.log(`⚽ [ANTITOXIC] Moderando usuario ${userNumber} por ${toxicDetection.severity}`)
      
      try {
        if (isBotAdmin) {
          await conn.sendMessage(m.chat, { delete: m.key })
        }
        
        const warningMessage = getToxicMessage(userNumber, toxicDetection.severity)
        await conn.reply(m.chat, warningMessage, m, { mentions: [m.sender] })
        
        if (isBotAdmin && (toxicDetection.severity === 'severe' || toxicDetection.severity === 'discriminatory')) {
          await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
        }
        
        return false
        
      } catch (error) {
        console.error('❌ [ANTITOXIC] Error durante moderación:', error)
      }
    }
    
    return true
    
  } catch (error) {
    console.error('💥 [ANTITOXIC] ERROR CRÍTICO:', error)
    return true
  }
}