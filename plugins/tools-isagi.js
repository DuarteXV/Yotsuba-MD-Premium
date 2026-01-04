import axios from 'axios'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`*⚡ Gemini AI ⚡*\n\nPor favor, escribe tu mensaje.\nEjemplo: ${usedPrefix + command} Hola, ¿cómo estás?`)
  }

  try {
    // Enviar indicador de que está escribiendo
    await conn.sendPresenceUpdate('composing', m.chat)
    
    // Obtener respuesta de Gemini
    const response = await geminiChat(text)
    
    // Responder al usuario
    await m.reply(response)
    
  } catch (error) {
    console.error('Error en handler:', error)
    await m.reply(`*😕 Mi visión no es clara en este momento...*\n\nIntenta nuevamente en un momento.`)
  }
}

// Función principal para Gemini
async function geminiChat(message) {
  const apiKey = 'DuarteXVKey34'
  const baseUrl = 'https://api-adonix.ultraplus.click/ai/gemini'
  
  // Construir la URL correctamente
  const url = `${baseUrl}?apikey=${encodeURIComponent(apiKey)}&prompt=${encodeURIComponent(message)}`
  
  console.log('URL de solicitud:', url.replace(apiKey, '***')) // Ocultar API key en logs
  
  try {
    const response = await axios.get(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 30000
    })
    
    console.log('Respuesta recibida:', response.data)
    
    // Procesar diferentes formatos de respuesta
    if (response.data) {
      // Si la respuesta es un string directo
      if (typeof response.data === 'string') {
        return response.data
      }
      // Si es un objeto con propiedad 'result'
      if (response.data.result) {
        return response.data.result
      }
      // Si es un objeto con propiedad 'response'
      if (response.data.response) {
        return response.data.response
      }
      // Si es un objeto con propiedad 'message'
      if (response.data.message) {
        return response.data.message
      }
      // Si es un objeto con propiedad 'text'
      if (response.data.text) {
        return response.data.text
      }
      // Si es un objeto con estructura data.text
      if (response.data.data && response.data.data.text) {
        return response.data.data.text
      }
      // Si no reconocemos la estructura, devolver como JSON
      return JSON.stringify(response.data)
    }
    
    return '⚠️ No recibí una respuesta válida.'
    
  } catch (error) {
    console.error('Error en geminiChat:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: url.replace(apiKey, '***')
    })
    
    // Manejo específico de errores
    if (error.response) {
      switch (error.response.status) {
        case 400:
          // Probemos con un enfoque alternativo
          return await tryAlternativeApproach(message, apiKey, baseUrl)
        case 401:
          throw new Error('API Key no válida')
        case 429:
          throw new Error('Demasiadas solicitudes. Espera un momento.')
        case 500:
          throw new Error('Error interno del servidor')
        default:
          throw new Error(`Error ${error.response.status}`)
      }
    } else if (error.request) {
      throw new Error('No se pudo conectar con el servidor')
    } else {
      throw error
    }
  }
}

// Enfoque alternativo si el primero falla
async function tryAlternativeApproach(message, apiKey, baseUrl) {
  console.log('Intentando enfoque alternativo...')
  
  // Enfoque 1: Solo query sin prompt
  try {
    const url1 = `${baseUrl}?apikey=${encodeURIComponent(apiKey)}&query=${encodeURIComponent(message)}`
    console.log('Alternativo URL 1:', url1.replace(apiKey, '***'))
    
    const response1 = await axios.get(url1, {
      headers: {
        'Accept': 'application/json'
      },
      timeout: 15000
    })
    
    if (response1.data) {
      return extractResponse(response1.data)
    }
  } catch (e) {
    console.log('Enfoque 1 falló:', e.message)
  }
  
  // Enfoque 2: Con diferentes parámetros
  try {
    const url2 = `${baseUrl}?apikey=${encodeURIComponent(apiKey)}&text=${encodeURIComponent(message)}`
    console.log('Alternativo URL 2:', url2.replace(apiKey, '***'))
    
    const response2 = await axios.get(url2, {
      headers: {
        'Accept': 'application/json'
      },
      timeout: 15000
    })
    
    if (response2.data) {
      return extractResponse(response2.data)
    }
  } catch (e) {
    console.log('Enfoque 2 falló:', e.message)
  }
  
  // Enfoque 3: Con pregunta específica
  try {
    const url3 = `${baseUrl}?apikey=${encodeURIComponent(apiKey)}&pregunta=${encodeURIComponent(message)}`
    console.log('Alternativo URL 3:', url3.replace(apiKey, '***'))
    
    const response3 = await axios.get(url3, {
      headers: {
        'Accept': 'application/json'
      },
      timeout: 15000
    })
    
    if (response3.data) {
      return extractResponse(response3.data)
    }
  } catch (e) {
    console.log('Enfoque 3 falló:', e.message)
  }
  
  throw new Error('No se pudo conectar con la API después de varios intentos')
}

// Función para extraer respuesta de diferentes formatos
function extractResponse(data) {
  if (typeof data === 'string') return data
  if (data.result) return data.result
  if (data.response) return data.response
  if (data.message) return data.message
  if (data.text) return data.text
  if (data.data && data.data.text) return data.data.text
  if (data.data && data.data.response) return data.data.response
  
  // Intentar convertir a string
  try {
    return JSON.stringify(data)
  } catch {
    return 'Respuesta recibida pero en formato no reconocido'
  }
}

// Comando con diferentes aliases
handler.help = ['gemini <texto>']
handler.tags = ['ai']
handler.command = /^(gemini|ai|gpt|ia|ask)$/i
handler.register = true
handler.limit = true

export default handler