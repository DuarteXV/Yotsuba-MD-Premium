let handler = async (m, { conn, args, usedPrefix, command }) => {
const pp = await conn.profilePictureUrl(m.chat, 'image').catch(_ => icono) 
let isClose = { 
'open': 'not_announcement',
'close': 'announcement',
'abierto': 'not_announcement',
'cerrado': 'announcement',
'abrir': 'not_announcement',
'cerrar': 'announcement',
}[(args[0] || '')]
if (isClose === undefined)
return conn.reply(m.chat, `${emoji} *Elija una opción para configurar el grupo*\n\nEjemplo:\n*🔓 #${command} abrir*\n*📣 #${command} cerrar*\n*🔒 #${command} close*\n*🔈 #${command} open*`, m, global.rcanal)
await conn.groupSettingUpdate(m.chat, isClose)

if (isClose === 'not_announcement'){
m.reply(`${emoji} *Ya pueden escribir en este grupo.*`)
}

if (isClose === 'announcement'){
m.reply(`${emoji2} *Solos los admins pueden escribir en este grupo.*`)
}}
handler.help = ['group open / close', 'grupo abrir / cerrar']
handler.tags = ['grupo']
handler.command = ['group', 'grupo']
handler.admin = true
handler.botAdmin = true

export default handler
