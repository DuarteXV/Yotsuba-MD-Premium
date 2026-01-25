import PhoneNumber from 'awesome-phonenumber'
import chalk from 'chalk'
import { watchFile } from 'fs'

const terminalImage = global.opts['img'] ? require('terminal-image') : ''
const urlRegex = (await import('url-regex-safe')).default({ strict: false })

export default async function (m, conn = { user: {} }) {
    if (m.mtype && m.mtype.includes('buttonsResponseMessage')) return
    if (m.sender === conn.user?.jid) return

    let _name = await conn.getName(m.sender)
    let sender = PhoneNumber('+' + m.sender.replace('@s.whatsapp.net', '')).getNumber('international') + (_name ? ' ~' + _name : '')
    let chat = await conn.getName(m.chat)
    let img

    try {
        if (global.opts['img']) {
            img = /sticker|image/gi.test(m.mtype) ? await terminalImage.buffer(await m.download()) : false
        }
    } catch (e) {
        console.error(e)
    }

    let filesize = (m.msg ?
        m.msg.vcard ?
            m.msg.vcard.length :
            m.msg.fileLength ?
                m.msg.fileLength.low || m.msg.fileLength :
                m.msg.axolotlSenderKeyDistributionMessage ?
                    m.msg.axolotlSenderKeyDistributionMessage.length :
                    m.text ?
                        m.text.length :
                        0
            : m.text ? m.text.length : 0) || 0

    let user = global.db.data.users[m.sender]
    let me = PhoneNumber('+' + (conn.user?.jid).replace('@s.whatsapp.net', '')).getNumber('international')
    let now = new Date()
    let time = now.toLocaleString('es-PE', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    let chatName = chat ? (m.isGroup ? '[GRUPO] ' + chat : '[PRIVADO] ' + chat) : ''

    console.log(`
${chalk.black(chalk.bgCyan('┌─[ BOT ACTIVO ]'))} ${chalk.cyan(time)}

├─ BOT       │ ${chalk.cyan(me + ' ~' + conn.user.name)}
├─ TIPO      │ ${chalk.cyan(m.messageStubType || 'Mensaje')}
├─ TAMAÑO    │ ${chalk.cyan(filesize === 0 ? '0B' : (filesize / 1000 ** Math.floor(Math.log(filesize) / Math.log(1000))).toFixed(1) + ['B', 'KB', 'MB', 'GB', 'TB'][Math.floor(Math.log(filesize) / Math.log(1000))])}
├─ DE        │ ${chalk.white(sender)}
├─ EXP/LVL   │ ${chalk.white(m ? m.exp || 0 : 0)}${user ? ' | ' + user.exp + ' | Lv.' + user.level : ''}
├─ CHAT      │ ${chalk.cyan(chatName)}
└─ FORMATO   │ ${chalk.cyan(m.mtype ? m.mtype.replace(/message$/i, '').replace('audio', m.msg.ptt ? 'PTT' : 'Audio').replace(/^./, v => v.toUpperCase()) : 'Desconocido')}
`.trim())

    if (img) console.log(img.trimEnd())

    if (typeof m.text === 'string' && m.text) {
        let log = m.text.replace(/\u200e+/g, '')
        let mdRegex = /(?<=(?:^|[\s\n])\S?)(?:([*_~])(.+?)\1|```((?:.||[\n\r])+?)```)(?=\S?(?:[\s\n]|$))/g
        let mdFormat = (depth = 4) => (_, type, text, monospace) => {
            let types = { '_': 'italic', '*': 'bold', '~': 'strikethrough' }
            text = text || monospace
            let formatted = !types[type] || depth < 1 ? text : chalk[types[type]](text.replace(mdRegex, mdFormat(depth - 1)))
            return formatted
        }

        if (log.length < 4096) {
            log = log.replace(urlRegex, (url, i, text) => {
                let end = url.length + i
                return i === 0 || end === text.length || (/^\s$/.test(text[end]) && /^\s$/.test(text[i - 1])) ? chalk.cyan(url) : url
            })
        }

        log = log.replace(mdRegex, mdFormat(4))

        if (m.mentionedJid) {
            for (let user of m.mentionedJid) {
                log = log.replace('@' + user.split`@`[0], chalk.cyan('@' + await conn.getName(user)))
            }
        }

        console.log(m.error != null ? chalk.red(log) : m.isCommand ? chalk.yellow(log) : log)
    }

    if (m.messageStubParameters) {
        console.log(m.messageStubParameters.map(jid => {
            jid = conn.decodeJid(jid)
            let name = conn.getName(jid)
            const phoneNumber = PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')
            return name ? chalk.gray(`${phoneNumber} (${name})`) : ''
        }).filter(Boolean).join(', '))
    }

    if (/document/i.test(m.mtype)) {
        console.log(`├─ ARCHIVO   │ ${m.msg.fileName || m.msg.displayName || 'Documento'}`)
    } else if (/ContactsArray/i.test(m.mtype)) {
        console.log(`├─ CONTACTOS │ ${m.msg.contacts?.length || 0}`)
    } else if (/contact/i.test(m.mtype)) {
        console.log(`├─ CONTACTO  │ ${m.msg.displayName || 'Sin nombre'}`)
    } else if (/audio/i.test(m.mtype)) {
        const duration = m.msg.seconds || 0
        console.log(`├─ AUDIO     │ ${m.msg.ptt ? 'PTT' : 'Audio'} ${Math.floor(duration / 60).toString().padStart(2, 0)}:${(duration % 60).toString().padStart(2, 0)}`)
    }

    console.log()
}

let file = global.__filename(import.meta.url)
watchFile(file, () => {
    console.log(chalk.redBright("└─[ ACTUALIZADO ] print.js"))
})