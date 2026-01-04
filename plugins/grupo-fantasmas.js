import { areJidsSameUser } from '@whiskeysockets/baileys'

const delay = ms => new Promise(res => setTimeout(res, ms))

const processingChats = new Set()

var handler = async (m, { conn, text, participants, args, command }) => {

if (processingChats.has(m.chat)) return
if (text && text.toLowerCase().includes('eliminar')) {
processingChats.add(m.chat)
}

let member = participants.map(u => u.id)
let isEliminar = text && text.toLowerCase().includes('eliminar')
let sum = (!text || isEliminar) ? member.length : parseInt(text) || member.length
let total = 0
let sider = []

for (let i = 0; i < sum; i++) {
let users = m.isGroup ? participants.find(u => u.id == member[i]) : {}
if ((typeof global.db.data.users[member[i]] == 'undefined' || global.db.data.users[member[i]].chat == 0) && !users.isAdmin && !users.isSuperAdmin) { 
if (typeof global.db.data.users[member[i]] !== 'undefined'){
if (global.db.data.users[member[i]].whitelist == false){
total++
sider.push(member[i])}
}else {
total++
sider.push(member[i])}}}
if(total == 0) return conn.reply(m.chat, `${emoji} Este grupo es activo, no tiene fantasmas.`, m)

if (!isEliminar) {
let userList = []
for (let jid of sider) {
let participant = participants.find(u => u.id === jid)
let name = participant ? (await conn.getName(jid)) : jid.split('@')[0]
userList.push(`• ${name} (@${jid.split('@')[0]})`)
}

const listMsg = `${emoji} *${command === 'fantasmas' ? 'Revisión' : 'Eliminación'} de inactivos*\n\n${emoji2} *Lista de fantasmas:*\n${userList.join('\n')}\n\n⚠️ *Total: ${total} usuarios*\n\n${command === 'fantasmas' ? '📝 *NOTA:* Esto no es al 100% acertado, el bot inicia el conteo de mensajes a partir de que se active en este número\n\n' : ''}💡 Presiona el botón de abajo para eliminarlos:`

const interactiveMessage = {
header: {
title: '👻 Usuarios Fantasmas Detectados',
hasMediaAttachment: false
},
body: { text: listMsg },
footer: { text: '⚽️ Isagi Yoichi Bot' },
nativeFlowMessage: {
buttons: [{
name: 'quick_reply',
buttonParamsJson: JSON.stringify({
display_text: '🗑️ Eliminar Inactivos',
id: `.${command} eliminar`
})
}]
}
}

return await conn.relayMessage(m.chat, {
viewOnceMessage: {
message: {
interactiveMessage
}
}
}, { quoted: m })
}

let chat = global.db.data.chats[m.chat]
let originalWelcome = chat.welcome
chat.welcome = false

let eliminated = 0
let errors = 0

try {
for (let user of sider) {
if (!user.endsWith('@s.whatsapp.net')) continue

let participant = participants.find(v => areJidsSameUser(v.id, user))
if (!participant) continue

if (participant.admin === 'admin' || participant.admin === 'superadmin') {
continue
}

try {
await conn.groupParticipantsUpdate(m.chat, [user], 'remove')
eliminated++
await delay(3000)
} catch (e) {
errors++
console.error(`❌ Error eliminando ${user}:`, e)
}
}
} finally {
chat.welcome = originalWelcome
processingChats.delete(m.chat)
}

await conn.reply(m.chat, `🏁 **PROCESO COMPLETADO**\n\n✅ Usuarios eliminados: ${eliminated}\n❌ Errores: ${errors}\n👻 Total procesados: ${total}`, m)

}
handler.tags = ['grupo']
handler.command = ['fantasmas', 'kickfantasmas']
handler.group = true
handler.botAdmin = true
handler.admin = true
handler.fail = null

export default handler

