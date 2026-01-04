import yts from 'yt-search'

const handler = async (m, { text, conn }) => {
  if (!text) return conn.reply(m.chat, `⚽️ Por favor, ingresa una búsqueda de YouTube.`, m, global.rcanal)

  conn.reply(m.chat, '⚽️ Buscando...', m, global.rcanal)

  try {
    const results = await yts(text)
    const videos = results.all.filter(v => v.type === 'video').slice(0, 5)
    
    if (!videos.length) {
      return conn.reply(m.chat, '⚽️ No se encontraron resultados.', m, global.rcanal)
    }

    const teks = videos.map(v => 
      `> ☁️ Título » *${v.title}*\n` +
      `> 🍬 Canal » *${v.author.name}*\n` +
      `> 🕝 Duración » *${v.timestamp}*\n` +
      `> 📆 Subido » *${v.ago}*\n` +
      `> 👀 Vistas » *${v.views}*\n` +
      `> 🔗 Enlace » ${v.url}`
    ).join('\n\n••••••••••••••••••••••••••••••••••••\n\n')

    const finalText = `⚽️ Resultados de la búsqueda para *<${text}>*\n\n${teks}`
    
    conn.sendFile(m.chat, videos[0].thumbnail, 'yts.jpeg', finalText, m)
  } catch (error) {
    conn.reply(m.chat, '⚽️ Error en la búsqueda.', m, global.rcanal)
  }
}
handler.help = ['ytsearch']
handler.tags = ['buscador']
handler.command = ['ytbuscar', 'ytsearch', 'yts']
handler.register = true
handler.coin = 1

export default handler

