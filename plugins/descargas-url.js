import fetch from 'node-fetch'

const handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    if (!text) return conn.reply(m.chat, `Uso: ${usedPrefix}${command} <url>`, m)
    const url = text.trim()
    if (!isValidUrl(url)) return conn.reply(m.chat, 'URL inválida.', m)

    await conn.reply(m.chat, 'Procesando, por favor espera... ⏳', m)

    const apiKey = 'may-5bb2f772'
    const apiUrl = `https://mayapi.ooguy.com/ytdl?url=${encodeURIComponent(url)}&apikey=${apiKey}`

  const res = await fetch(apiUrl, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 30000 })
  if (!res.ok) return conn.reply(m.chat, `Error al consultar la API: ${res.status}`, m)

  const data = await res.json()

  if (!data) return conn.reply(m.chat, 'Respuesta vacía de la API.', m)

    

  const result = data.result || data.data || data

  
  const audioUrl = result?.mp3 || result?.audio || result?.download_mp3 || result?.audio_url || result?.link_audio || result?.audioDownload || null
  const videoUrl = result?.mp4 || result?.video || result?.download_mp4 || result?.video_url || result?.link_video || result?.videoDownload || null

    
    if (command === 'mp3') {
      const dl = audioUrl || result?.link || result?.url || null
      if (!dl) return conn.reply(m.chat, 'No se encontró enlace de audio en la respuesta de la API.', m)

      
      return conn.sendMessage(m.chat, { document: { url: dl }, mimetype: 'audio/mpeg', fileName: 'audio.mp3' }, { quoted: m })
    } else {
      const dl = videoUrl || result?.link || result?.url || null
      if (!dl) return conn.reply(m.chat, 'No se encontró enlace de video en la respuesta de la API.', m)

      
      return conn.sendMessage(m.chat, { document: { url: dl }, mimetype: 'video/mp4', fileName: 'video.mp4', caption: 'Video (documento)' }, { quoted: m })
    }

  } catch (err) {
    console.error('Error en descargas-url:', err)
    return conn.reply(m.chat, `Ocurrió un error: ${err.message}`, m)
  }
}

function isValidUrl (s) {
  try {
    const u = new URL(s)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch (e) {
    return false
  }
}

handler.help = ['mp3 <url>', 'mp4 <url>']
handler.tags = ['downloader']
handler.command = ['mp3', 'mp4']
handler.limit = true

export default handler
