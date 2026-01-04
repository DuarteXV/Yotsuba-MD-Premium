import fetch from 'node-fetch'
import FormData from 'form-data'

let handler = async (m, { conn }) => {
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''
  if (!mime) return conn.reply(m.chat, `${emoji} Por favor, responda a una *Imagen* o *Vídeo.*`, m)

  await m.react(rwait)

  try {
    let media = await q.download()

    // Subida a Catbox
    let link = await uploadCatbox(media, mime)

    let img = mime.startsWith('image/')
      ? media
      : await (await fetch('https://files.catbox.moe/1.png')).buffer()

    let txt = `乂  *L I N K - E N L A C E*  乂\n\n`
    txt += `*» Enlace* : ${link}\n`
    txt += `*» Acortado* : ${await shortUrl(link)}\n`
    txt += `*» Tamaño* : ${formatBytes(media.length)}\n`
    txt += `*» Expiración* : No expira\n\n`
    txt += `> *${dev}*`

    await conn.sendFile(m.chat, img, 'thumbnail.jpg', txt, m, fkontak)
    await m.react(done)

  } catch (e) {
    await m.react(error)
  }
}

handler.help = ['tourl']
handler.tags = ['transformador']
handler.command = ['tourl', 'upload']
handler.register = true

export default handler