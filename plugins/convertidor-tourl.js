import { createHash } from 'crypto'
import fetch from 'node-fetch'
import uploadFile from '../lib/uploadFile.js'
import uploadImage from '../lib/uploadImage.js'
import { FormData } from "formdata-node"
import { fileTypeFromBuffer } from "file-type"
import { Readable } from 'stream'
import crypto from "crypto"

const handler = async (m, { conn, command, usedPrefix, text }) => {
try {
let q = m.quoted ? m.quoted : m
let mime = (q.msg || q).mimetype || ''
switch (command) {
case 'tourl': {
if (!mime) return conn.reply(m.chat, `❀ Por favor, responde a una *Imagen* o *Vídeo.*`, m)
await m.react('🕒')
const media = await q.download()
const isTele = /image\/(png|jpe?g|gif)|video\/mp4/.test(mime)
const link = await uploadImage(media)
const txt = `*乂 T O U R L - U P L O A D E R 乂*\n\n*» Enlace* : ${link}\n*» Tamaño* : ${formatBytes(media.length)}\n*» Expiración* : ${isTele ? 'No expira' : 'Desconocido'}\n\n> *${dev}*`
await conn.sendFile(m.chat, media, 'thumbnail.jpg', txt, m, fkontak)
await m.react('✔️')
break
}
case 'catbox': {
if (!mime) return conn.reply(m.chat, `❀ Por favor, responde a una *Imagen* o *Vídeo.*`, m)
await m.react('🕒')
const media = await q.download()
const link = await catbox(media)
const txt = `*乂 C A T B O X - U P L O A D E R 乂*\n\n*» Enlace* : ${link}\n*» Tamaño* : ${formatBytes(media.length)}\n*» Expiración* : Permanente\n\n> *${dev}*`
await conn.sendFile(m.chat, media, 'thumbnail.jpg', txt, m, fkontak)
await m.react('✔️')
break
}
case 'quax': {
if (!mime) return conn.reply(m.chat, `❀ Por favor, responde a una *Imagen* o *Vídeo.*`, m)
await m.react('🕒')
const media = await q.download()
const link = await quax(media)
const txt = `*乂 Q U . A X - U P L O A D E R 乂*\n\n*» Enlace* : ${link}\n*» Tamaño* : ${formatBytes(media.length)}\n*» Expiración* : Permanente\n\n> *${dev}*`
await conn.sendFile(m.chat, media, 'thumbnail.jpg', txt, m, fkontak)
await m.react('✔️')
break
}}} catch (error) {
console.error('Error completo:', error)
await m.react('✖️')
await conn.reply(m.chat, `⚠︎ Se ha producido un problema.\n> Usa *${usedPrefix}report* para informarlo.\n\n*Error:* ${error.message || error}`, m)
}}

handler.help = ['tourl', 'catbox', 'quax']
handler.tags = ['tools']
handler.command = ['tourl', 'catbox', 'quax']

export default handler

function formatBytes(bytes) {
if (bytes === 0) return '0 B'
const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
const i = Math.floor(Math.log(bytes) / Math.log(1024))
return `${(bytes / 1024 ** i).toFixed(2)} ${sizes[i]}`
}

async function shortUrl(url) {
try {
const res = await fetch(`https://tinyurl.com/api-create.php?url=${url}`)
return await res.text()
} catch {
return url
}
}

async function catbox(content) {
try {
const buffer = Buffer.isBuffer(content) ? content : Buffer.from(content)
const { ext, mime } = await fileTypeFromBuffer(buffer)
const formData = new FormData()
const randomBytes = crypto.randomBytes(5).toString("hex")
const filename = randomBytes + "." + ext


formData.append("reqtype", "fileupload")
formData.append("fileToUpload", buffer, {
filename: filename,
contentType: mime
})

const response = await fetch("https://catbox.moe/user/api.php", { 
method: "POST", 
body: formData
})

const result = await response.text()
if (result && result.startsWith('http')) {
return result.trim()
}
throw new Error(`Catbox error: ${result}`)
} catch (error) {
throw new Error(`Catbox upload falló: ${error.message}`)
}
}

async function quax(content) {
try {
const buffer = Buffer.isBuffer(content) ? content : Buffer.from(content)
const { ext, mime } = await fileTypeFromBuffer(buffer)
const formData = new FormData()
const randomBytes = crypto.randomBytes(5).toString("hex")
const filename = randomBytes + "." + ext

formData.append("files[]", buffer, {
filename: filename,
contentType: mime
})

const response = await fetch("https://qu.ax/upload.php", { 
method: "POST", 
body: formData
})

const data = await response.json()
if (data.success && data.files?.[0]?.url) {
return data.files[0].url
}
throw new Error(`qu.ax error: ${JSON.stringify(data)}`)
} catch (error) {
throw new Error(`qu.ax upload falló: ${error.message}`)
}
}