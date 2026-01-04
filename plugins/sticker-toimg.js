import webp from 'webp-converter'
import { fileURLToPath } from 'url'
import path from 'path'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let handler = async (m, { conn }) => {
    const notStickerMessage = `> Debes citar un sticker para convertir a imagen.`
    const q = m.quoted || m
    const mime = q.mediaType || ''
    if (!/sticker/.test(mime)) return m.reply(notStickerMessage)

    try {
        const media = await q.download()
        const tempWebp = path.join(__dirname, 'temp.webp')
        const tempPng = path.join(__dirname, 'output.png')
        fs.writeFileSync(tempWebp, media)

        await webp.cwebp(tempWebp, tempPng, "-q 80")

        const buffer = fs.readFileSync(tempPng)

        await conn.sendMessage(m.chat, { image: buffer }, { quoted: m })

        fs.unlinkSync(tempWebp)
        fs.unlinkSync(tempPng)
    } catch (e) {
        console.error(e)
        m.reply('Ocurrió un error al convertir el sticker a imagen.')
    }
}

handler.help = ['toimg (reply)']
handler.tags = ['sticker']
handler.command = ['toimg', 'img', 'png', 'jpg']
handler.reg = true
export default handler