import path from 'path'
import fetch from 'node-fetch'
import PhoneNumber from 'awesome-phonenumber'
import fs from 'fs'
import util from 'util'
import { fileTypeFromBuffer } from 'file-type'
import { fileURLToPath } from 'url'
import store from './store.js'
import * as baileys from "@whiskeysockets/baileys"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const {
    makeWASocket: _makeWASocket,
    proto,
    downloadContentFromMessage,
    jidDecode,
    areJidsSameUser,
    generateWAMessageFromContent,
    generateForwardMessageContent,
    generateWAMessage,
    extractMessageContent,
    WAMessageStubType,
    prepareWAMessageMedia
} = baileys

async function ensureTmpDir() {
    const tmpDir = path.join(__dirname, '../tmp')
    try {
        await fs.promises.access(tmpDir)
        return true
    } catch {
        try {
            await fs.promises.mkdir(tmpDir, { recursive: true, mode: 0o755 })
            return true
        } catch (err) {
            fs.mkdirSync(tmpDir, { recursive: true, mode: 0o755 })
            return true
        }
    }
}

export function makeWASocket(connectionOptions, options = {}) {
    let conn = (global.opts['legacy'] ? makeWALegacySocket : _makeWASocket)(connectionOptions)

    let sock = Object.defineProperties(conn, {
        chats: {
            value: { ...(options.chats || {}) },
            writable: true
        },
        decodeJid: {
            value(jid) {
                if (!jid || typeof jid !== 'string') return (!nullish(jid) && jid) || null
                return jid.decodeJid()
            }
        },
        getFile: {
            async value(PATH, saveToFile = false) {
                let res, filename
                const data = Buffer.isBuffer(PATH) ? PATH : PATH instanceof ArrayBuffer ? PATH.toBuffer() : /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split`,`[1], 'base64') : /^https?:\/\//.test(PATH) ? await (res = await fetch(PATH)).buffer() : fs.existsSync(PATH) ? (filename = PATH, fs.readFileSync(PATH)) : typeof PATH === 'string' ? PATH : Buffer.alloc(0)
                if (!Buffer.isBuffer(data)) throw new TypeError('Result is not a buffer')
                const type = await fileTypeFromBuffer(data) || {
                    mime: 'application/octet-stream',
                    ext: '.bin'
                }
                if (data && saveToFile && !filename) {
                    await ensureTmpDir()
                    filename = path.join(__dirname, '../tmp/' + new Date * 1 + '.' + type.ext)
                    await fs.promises.writeFile(filename, data)
                }
                return {
                    res,
                    filename,
                    ...type,
                    data,
                    deleteFile() {
                        return filename && fs.promises.unlink(filename)
                    }
                }
            },
            enumerable: true
        },
        sendFile: {
            async value(jid, path, filename = '', caption = '', quoted, ptt = false, options = {}) {
                let type = await conn.getFile(path, true)
                let { res, data: file, filename: pathFile } = type
                if (res && res.status !== 200 || file.length <= 65536) {
                    try { throw { json: JSON.parse(file.toString()) } }
                    catch (e) { if (e.json) throw e.json }
                }
                let opt = {}
                if (quoted) opt.quoted = quoted
                if (!type) options.asDocument = true
                let mtype = '', mimetype = options.mimetype || type.mime
                if (/webp/.test(type.mime) || (/image/.test(type.mime) && options.asSticker)) mtype = 'sticker'
                else if (/image/.test(type.mime) || (/webp/.test(type.mime) && options.asImage)) mtype = 'image'
                else if (/video/.test(type.mime)) mtype = 'video'
                else if (/audio/.test(type.mime)) mtype = 'audio'
                else mtype = 'document'
                if (options.asDocument) mtype = 'document'

                delete options.asSticker
                delete options.asLocation
                delete options.asVideo
                delete options.asDocument
                delete options.asImage

                let message = {
                    ...options,
                    caption,
                    ptt,
                    [mtype]: { url: pathFile },
                    mimetype,
                    fileName: filename || pathFile.split('/').pop()
                }
                let m
                try {
                    m = await conn.sendMessage(jid, message, { ...opt, ...options })
                } catch (e) {
                    console.error(e)
                    m = null
                } finally {
                    if (!m) m = await conn.sendMessage(jid, { ...message, [mtype]: file }, { ...opt, ...options })
                    file = null
                    return m
                }
            },
            enumerable: true
        },
        reply: {
            value(jid, text = '', quoted, options) {
                return Buffer.isBuffer(text) ? conn.sendFile(jid, text, 'file', '', quoted, false, options) : conn.sendMessage(jid, { ...options, text }, { quoted, ...options })
            }
        },
        sendButton: {
            async value(jid, text = '', footer = '', buffer, buttons, quoted, options = {}) {
                let type
                if (buffer) {
                    type = await conn.getFile(buffer)
                    buffer = type.data
                }
                const buttonMessage = {
                    text,
                    footer,
                    buttons,
                    headerType: buffer ? (type.mime.startsWith('image') ? 4 : type.mime.startsWith('video') ? 5 : 1) : 1,
                    ...(buffer ? type.mime.startsWith('image') ? { image: buffer } : type.mime.startsWith('video') ? { video: buffer } : {} : {})
                }
                return conn.sendMessage(jid, buttonMessage, { quoted, ...options })
            },
            enumerable: true
        },
        sendList: {
            async value(jid, title, text, footer, buttonText, listSections, quoted, options = {}) {
                const listMessage = {
                    text,
                    footer,
                    title,
                    buttonText,
                    sections: listSections
                }
                return conn.sendMessage(jid, listMessage, { quoted, ...options })
            },
            enumerable: true
        },
        sendMedia: {
            async value(jid, url, quoted = '', options = {}) {
                let { mime, data: buffer, ext, size } = await conn.getFile(url)
                mime = options?.mimetype || mime
                let type = mime.split('/')[0]
                let message = {
                    ...options,
                    [type]: buffer
                }
                return conn.sendMessage(jid, message, { quoted, ...options })
            },
            enumerable: true
        },
        sendButtonMessages: {
            async value(jid, buttons = [], quoted, opts = {}) {
                let message = generateWAMessageFromContent(jid, {
                    viewOnceMessage: {
                        message: {
                            interactiveMessage: {
                                body: { text: opts?.body || '' },
                                footer: { text: opts?.footer || '' },
                                header: {
                                    hasMediaAttachment: false,
                                    ...(opts.header || {})
                                },
                                nativeFlowMessage: {
                                    buttons: buttons.map(btn => ({
                                        name: btn.name || 'quick_reply',
                                        buttonParamsJson: JSON.stringify(btn.buttonParamsJson || {})
                                    })),
                                    messageParamsJson: ''
                                }
                            }
                        }
                    }
                }, { quoted, ...opts })
                await conn.relayMessage(jid, message.message, { messageId: message.key.id })
                return message
            },
            enumerable: true
        },
        sendReactionMessage: {
            async value(jid, emoji, key) {
                return conn.sendMessage(jid, {
                    react: {
                        text: emoji,
                        key: key
                    }
                })
            },
            enumerable: true
        },
        sendPoll: {
            async value(jid, name = '', values = [], selectableCount = 1, quoted, options = {}) {
                return conn.sendMessage(jid, {
                    poll: {
                        name,
                        values,
                        selectableCount
                    },
                    ...options
                }, { quoted, ...options })
            },
            enumerable: true
        },
        sendContact: {
            async value(jid, contact = [], quoted = '', opts = {}) {
                if (!Array.isArray(contact)) contact = [contact]
                let vcard = contact.map(v => {
                    let name = conn.getName(v)
                    let number = v.replace(/[^0-9]/g, '')
                    return `BEGIN:VCARD
VERSION:3.0
FN:${name}
TEL;type=CELL;type=VOICE;waid=${number}:${PhoneNumber('+' + number).getNumber('international')}
END:VCARD`
                }).join('\n\n')
                return conn.sendMessage(jid, {
                    contacts: {
                        displayName: contact.length > 1 ? `${contact.length} contactos` : conn.getName(contact[0]),
                        contacts: [{ vcard }]
                    },
                    ...opts
                }, { quoted, ...opts })
            },
            enumerable: true
        },
        externalReply: {
            async value(jid, text = '', footer = '', media, url = [], quoted, options = {}) {
                let msg = await generateWAMessageFromContent(jid, {
                    extendedTextMessage: {
                        text: text,
                        contextInfo: {
                            externalAdReply: {
                                title: options.title || global.wm,
                                body: footer,
                                thumbnailUrl: options.thumbnailUrl || global.banner,
                                sourceUrl: url[0] || global.channel,
                                mediaType: 1,
                                renderLargerThumbnail: options.largeThumb !== false
                            },
                            mentionedJid: options.mentions || []
                        }
                    }
                }, { quoted, ...options })
                return conn.relayMessage(jid, msg.message, { messageId: msg.key.id })
            },
            enumerable: true
        },
        sendMessageModify: {
            async value(jid, text, quoted, options = {}) {
                if (options.media) {
                    let media = await prepareWAMessageMedia({ image: options.media }, { upload: conn.waUploadToServer })
                    return conn.relayMessage(jid, {
                        extendedTextMessage: {
                            text: text,
                            contextInfo: {
                                mentionedJid: options.mentions || [],
                                externalAdReply: {
                                    title: options.title || global.wm,
                                    body: options.body || '',
                                    thumbnailUrl: options.thumbnailUrl || global.banner,
                                    sourceUrl: options.sourceUrl || global.channel,
                                    mediaType: 1,
                                    showAdAttribution: options.showAd || false,
                                    renderLargerThumbnail: options.largeThumb !== false,
                                    thumbnail: media.imageMessage?.jpegThumbnail
                                }
                            }
                        }
                    }, { quoted })
                } else {
                    return conn.relayMessage(jid, {
                        extendedTextMessage: {
                            text: text,
                            contextInfo: {
                                mentionedJid: options.mentions || [],
                                externalAdReply: {
                                    title: options.title || global.wm,
                                    body: options.body || '',
                                    thumbnailUrl: options.thumbnailUrl || global.banner,
                                    sourceUrl: options.sourceUrl || global.channel,
                                    mediaType: 1,
                                    showAdAttribution: options.showAd || false,
                                    renderLargerThumbnail: options.largeThumb !== false
                                }
                            }
                        }
                    }, { quoted })
                }
            },
            enumerable: true
        },
        downloadM: {
            async value(m, type, saveToFile) {
                let filename
                if (!m || !(m.url || m.directPath)) return Buffer.alloc(0)
                const stream = await downloadContentFromMessage(m, type)
                let buffer = Buffer.from([])
                for await (const chunk of stream) {
                    buffer = Buffer.concat([buffer, chunk])
                }
                if (saveToFile) ({ filename } = await conn.getFile(buffer, true))
                return saveToFile && fs.existsSync(filename) ? filename : buffer
            },
            enumerable: true
        },
        parseMention: {
            value(text = '') {
                return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')
            },
            enumerable: true
        },
        getName: {
            value(jid = '', withoutContact = false) {
                jid = conn.decodeJid(jid)
                withoutContact = conn.withoutContact || withoutContact
                let v
                if (jid.endsWith('@g.us')) return new Promise(async (resolve) => {
                    v = conn.chats[jid] || {}
                    if (!(v.name || v.subject)) v = await conn.groupMetadata(jid) || {}
                    resolve(v.name || v.subject || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international'))
                })
                else v = jid === '0@s.whatsapp.net' ? {
                    jid,
                    vname: 'WhatsApp'
                } : areJidsSameUser(jid, conn.user.id) ?
                    conn.user :
                    (conn.chats[jid] || {})
                let userName = global.db.data.users[jid.replace('@s.whatsapp.net', '')]?.name
                if (!userName) {
                    userName = PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')
                }
                return (withoutContact ? '' : v.name) || v.subject || v.vname || v.notify || v.verifiedName || userName
            },
            enumerable: true
        },
        cMod: {
            value(jid, message, text = '', sender = conn.user.jid, options = {}) {
                if (options.mentions && !Array.isArray(options.mentions)) options.mentions = [options.mentions]
                let copy = message.toJSON()
                delete copy.message.messageContextInfo
                delete copy.message.senderKeyDistributionMessage
                let mtype = Object.keys(copy.message)[0]
                let msg = copy.message
                let content = msg[mtype]
                if (typeof content === 'string') msg[mtype] = text || content
                else if (content.caption) content.caption = text || content.caption
                else if (content.text) content.text = text || content.text
                if (typeof content !== 'string') {
                    msg[mtype] = { ...content, ...options }
                    msg[mtype].contextInfo = {
                        ...(content.contextInfo || {}),
                        mentionedJid: options.mentions || content.contextInfo?.mentionedJid || []
                    }
                }
                if (copy.participant) sender = copy.participant = sender || copy.participant
                else if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant
                if (copy.key.remoteJid.includes('@s.whatsapp.net')) sender = sender || copy.key.remoteJid
                else if (copy.key.remoteJid.includes('@broadcast')) sender = sender || copy.key.remoteJid
                copy.key.remoteJid = jid
                copy.key.fromMe = areJidsSameUser(sender, conn.user.id) || false
                return proto.WebMessageInfo.fromObject(copy)
            },
            enumerable: true
        },
        copyNForward: {
            async value(jid, message, forwardingScore = true, options = {}) {
                let vtype
                if (options.readViewOnce && message.message.viewOnceMessage?.message) {
                    vtype = Object.keys(message.message.viewOnceMessage.message)[0]
                    delete message.message.viewOnceMessage.message[vtype].viewOnce
                    message.message = proto.Message.fromObject(
                        JSON.parse(JSON.stringify(message.message.viewOnceMessage.message))
                    )
                    message.message[vtype].contextInfo = message.message.viewOnceMessage.contextInfo
                }
                let mtype = Object.keys(message.message)[0]
                let m = generateForwardMessageContent(message, !!forwardingScore)
                let ctype = Object.keys(m)[0]
                if (forwardingScore && typeof forwardingScore === 'number' && forwardingScore > 1) m[ctype].contextInfo.forwardingScore += forwardingScore
                m[ctype].contextInfo = {
                    ...(message.message[mtype].contextInfo || {}),
                    ...(m[ctype].contextInfo || {})
                }
                m = generateWAMessageFromContent(jid, m, {
                    ...options,
                    userJid: conn.user.jid
                })
                await conn.relayMessage(jid, m.message, { messageId: m.key.id, additionalAttributes: { ...options } })
                return m
            },
            enumerable: true
        },
        pushMessage: {
            async value(m) {
                if (!m) return
                if (!Array.isArray(m)) m = [m]
                for (const message of m) {
                    try {
                        if (!message) continue
                        if (message.messageStubType && message.messageStubType != WAMessageStubType.CIPHERTEXT) conn.processMessageStubType(message).catch(console.error)
                        const _mtype = Object.keys(message.message || {})
                        const mtype = (!['senderKeyDistributionMessage', 'messageContextInfo'].includes(_mtype[0]) && _mtype[0]) ||
                            (_mtype.length >= 3 && _mtype[1] !== 'messageContextInfo' && _mtype[1]) ||
                            _mtype[_mtype.length - 1]
                        const chat = conn.decodeJid(message.key.remoteJid || message.message?.senderKeyDistributionMessage?.groupId || '')
                        if (message.message?.[mtype]?.contextInfo?.quotedMessage) {
                            let context = message.message[mtype].contextInfo
                            let participant = conn.decodeJid(context.participant)
                            const remoteJid = conn.decodeJid(context.remoteJid || participant)
                            let quoted = message.message[mtype].contextInfo.quotedMessage
                            if ((remoteJid && remoteJid !== 'status@broadcast') && quoted) {
                                let qMtype = Object.keys(quoted)[0]
                                if (qMtype == 'conversation') {
                                    quoted.extendedTextMessage = { text: quoted[qMtype] }
                                    delete quoted.conversation
                                    qMtype = 'extendedTextMessage'
                                }
                                if (!quoted[qMtype].contextInfo) quoted[qMtype].contextInfo = {}
                                quoted[qMtype].contextInfo.mentionedJid = context.mentionedJid || quoted[qMtype].contextInfo.mentionedJid || []
                                const isGroup = remoteJid.endsWith('g.us')
                                if (isGroup && !participant) participant = remoteJid
                                const qM = {
                                    key: {
                                        remoteJid,
                                        fromMe: areJidsSameUser(conn.user.jid, remoteJid),
                                        id: context.stanzaId,
                                        participant,
                                    },
                                    message: JSON.parse(JSON.stringify(quoted)),
                                    ...(isGroup ? { participant } : {})
                                }
                                let qChats = conn.chats[participant]
                                if (!qChats) qChats = conn.chats[participant] = { id: participant, isChats: !isGroup }
                                if (!qChats.messages) qChats.messages = {}
                                if (!qChats.messages[context.stanzaId] && !qM.key.fromMe) qChats.messages[context.stanzaId] = qM
                                let qChatsMessages
                                if ((qChatsMessages = Object.entries(qChats.messages)).length > 40) qChats.messages = Object.fromEntries(qChatsMessages.slice(30, qChatsMessages.length))
                            }
                        }
                        if (!chat || chat === 'status@broadcast') continue
                        const isGroup = chat.endsWith('@g.us')
                        let chats = conn.chats[chat]
                        if (!chats) {
                            chats = conn.chats[chat] = { id: chat, isChats: true, ...(conn.chats[chat] || {}) }
                        }
                        let metadata, sender
                        if (isGroup) {
                            sender = conn.decodeJid(message.key?.fromMe && conn.user.id || message.participant || message.key?.participant || chat || '')
                            if (sender !== chat) {
                                let chats = conn.chats[sender]
                                if (!chats) chats = conn.chats[sender] = { id: sender }
                                if (!chats.name) chats.name = message.pushName || chats.name || ''
                            }
                        } else if (!chats.name) chats.name = message.pushName || chats.name || ''
                        if (['senderKeyDistributionMessage', 'messageContextInfo'].includes(mtype)) continue
                        chats.isChats = true
                        if (!chats.messages) chats.messages = {}
                        const fromMe = message.key.fromMe || areJidsSameUser(sender || chat, conn.user.id)
                        if (!['protocolMessage'].includes(mtype) && !fromMe && message.messageStubType != WAMessageStubType.CIPHERTEXT && message.message) {
                            delete message.message.messageContextInfo
                            delete message.message.senderKeyDistributionMessage
                            chats.messages[message.key.id] = JSON.parse(JSON.stringify(message, null, 2))
                            let chatsMessages
                            if ((chatsMessages = Object.entries(chats.messages)).length > 40) chats.messages = Object.fromEntries(chatsMessages.slice(30, chatsMessages.length))
                        }
                    } catch (e) {
                        console.error(e)
                    }
                }
            }
        },
        serializeM: {
            value(m) {
                return smsg(conn, m)
            }
        },
        processMessageStubType: {
            async value(m) {
                if (!m.messageStubType) return
                const chat = conn.decodeJid(m.key.remoteJid || m.message?.senderKeyDistributionMessage?.groupId || '')
                if (!chat || chat === 'status@broadcast') return
            }
        }
    })
    if (sock.user?.id) sock.user.jid = sock.decodeJid(sock.user.id)
    store.bind(sock)
    return sock
}

export function smsg(conn, m, hasParent) {
    if (!m) return m
    let M = proto.WebMessageInfo
    m = M.fromObject(m)
    m.conn = conn
    let protocolMessageKey
    if (m.message) {
        if (m.mtype == 'protocolMessage' && m.msg.key) {
            protocolMessageKey = m.msg.key
            if (protocolMessageKey == 'status@broadcast') protocolMessageKey.remoteJid = m.chat
            if (!protocolMessageKey.participant || protocolMessageKey.participant == 'status_me') protocolMessageKey.participant = m.sender
            protocolMessageKey.fromMe = conn.decodeJid(protocolMessageKey.participant) === conn.decodeJid(conn.user.id)
            if (!protocolMessageKey.fromMe && protocolMessageKey.remoteJid === conn.decodeJid(conn.user.id)) protocolMessageKey.remoteJid = m.sender
        }
        if (m.quoted) if (!m.quoted.mediaMessage) delete m.quoted.download
    }
    if (!m.mediaMessage) delete m.download

    try {
        if (protocolMessageKey && m.mtype == 'protocolMessage') conn.ev.emit('message.delete', protocolMessageKey)
    } catch (e) {
        console.error(e)
    }
    return m
}

export function serialize() {
    const MediaType = ['imageMessage', 'videoMessage', 'audioMessage', 'stickerMessage', 'documentMessage']
    return Object.defineProperties(proto.WebMessageInfo.prototype, {
        conn: {
            value: undefined,
            enumerable: false,
            writable: true
        },
        id: {
            get() {
                return this.key?.id
            }
        },
        isBaileys: {
            get() {
                return (this?.fromMe || areJidsSameUser(this.conn?.user.id, this.sender)) && this.id.startsWith('3EB0') && (this.id.length === 20 || this.id.length === 22 || this.id.length === 12) || false
            },
        },
        chat: {
            get() {
                const senderKeyDistributionMessage = this.message?.senderKeyDistributionMessage?.groupId
                return (
                    this.key?.remoteJid ||
                    (senderKeyDistributionMessage &&
                        senderKeyDistributionMessage !== 'status@broadcast'
                    ) || ''
                ).decodeJid()
            }
        },
        isGroup: {
            get() {
                return this.chat.endsWith('@g.us')
            },
            enumerable: true
        },
        sender: {
            get() {
                return this.conn?.decodeJid(this.key?.fromMe && this.conn?.user.id || this.participant || this.key.participant || this.chat || '')
            },
            enumerable: true
        },
        fromMe: {
            get() {
                return this.key?.fromMe || areJidsSameUser(this.conn?.user.id, this.sender) || false
            }
        },
        mtype: {
            get() {
                if (!this.message) return ''
                const type = Object.keys(this.message)
                return (!['senderKeyDistributionMessage', 'messageContextInfo'].includes(type[0]) && type[0]) ||
                    (type.length >= 3 && type[1] !== 'messageContextInfo' && type[1]) ||
                    type[type.length - 1]
            },
            enumerable: true
        },
        msg: {
            get() {
                if (!this.message) return null
                return this.message[this.mtype]
            }
        },
        mediaMessage: {
            get() {
                if (!this.message) return null
                const Message = ((this.msg?.url || this.msg?.directPath) ? { ...this.message } : extractMessageContent(this.message)) || null
                if (!Message) return null
                const mtype = Object.keys(Message)[0]
                return MediaType.includes(mtype) ? Message : null
            },
            enumerable: true
        },
        mediaType: {
            get() {
                let message
                if (!(message = this.mediaMessage)) return null
                return Object.keys(message)[0]
            },
            enumerable: true,
        },
        quoted: {
            get() {
                const self = this
                const msg = self.msg
                const contextInfo = msg?.contextInfo
                const quoted = contextInfo?.quotedMessage
                if (!msg || !contextInfo || !quoted) return null
                const type = Object.keys(quoted)[0]
                let q = quoted[type]
                const text = typeof q === 'string' ? q : q.text
                return Object.defineProperties(JSON.parse(JSON.stringify(typeof q === 'string' ? { text: q } : q)), {
                    mtype: {
                        get() {
                            return type
                        },
                        enumerable: true
                    },
                    mediaMessage: {
                        get() {
                            const Message = ((q.url || q.directPath) ? { ...quoted } : extractMessageContent(quoted)) || null
                            if (!Message) return null
                            const mtype = Object.keys(Message)[0]
                            return MediaType.includes(mtype) ? Message : null
                        },
                        enumerable: true
                    },
                    id: {
                        get() {
                            return contextInfo.stanzaId
                        },
                        enumerable: true
                    },
                    chat: {
                        get() {
                            return contextInfo.remoteJid || self.chat
                        },
                        enumerable: true
                    },
                    sender: {
                        get() {
                            return (contextInfo.participant || this.chat || '').decodeJid()
                        },
                        enumerable: true
                    },
                    fromMe: {
                        get() {
                            return areJidsSameUser(this.sender, self.conn?.user.jid)
                        },
                        enumerable: true,
                    },
                    text: {
                        get() {
                            return text || this.caption || this.contentText || ''
                        },
                        enumerable: true
                    },
                    download: {
                        value(saveToFile = false) {
                            const mtype = this.mediaType
                            return self.conn?.downloadM(this.mediaMessage[mtype], mtype.replace(/message/i, ''), saveToFile)
                        },
                        enumerable: true,
                        configurable: true,
                    }
                })
            },
            enumerable: true
        },
        _text: {
            value: null,
            writable: true,
        },
        text: {
            get() {
                const msg = this.msg

                if (this.message?.interactiveResponseMessage) {
                    const response = this.message.interactiveResponseMessage
                    if (response.nativeFlowResponseMessage?.paramsJson) {
                        try {
                            const params = JSON.parse(response.nativeFlowResponseMessage.paramsJson)
                            return params.id || ''
                        } catch {}
                    }
                }

                if (this.message?.buttonsResponseMessage) {
                    return this.message.buttonsResponseMessage.selectedButtonId || ''
                }

                if (this.message?.listResponseMessage) {
                    return this.message.listResponseMessage.singleSelectReply?.selectedRowId || ''
                }

                const text = (typeof msg === 'string' ? msg : msg?.text) || msg?.caption || msg?.contentText || ''
                return typeof this._text === 'string' ? this._text : text || ''
            },
            set(str) {
                return this._text = str
            },
            enumerable: true
        },
        mentionedJid: {
            get() {
                return this.msg?.contextInfo?.mentionedJid?.length && this.msg.contextInfo.mentionedJid || []
            },
            enumerable: true
        },
        name: {
            get() {
                return !nullish(this.pushName) && this.pushName || this.conn?.getName(this.sender)
            },
            enumerable: true
        },
        download: {
            value(saveToFile = false) {
                const mtype = this.mediaType
                return this.conn?.downloadM(this.mediaMessage[mtype], mtype.replace(/message/i, ''), saveToFile)
            },
            enumerable: true,
            configurable: true
        },
        reply: {
            value(text, chatId, options) {
                return this.conn?.reply(chatId ? chatId : this.chat, text, this, options)
            }
        },
        react: {
            async value(emoji) {
                return await this.conn?.sendMessage(this.chat, { 
                    react: { 
                        text: emoji, 
                        key: this.key 
                    } 
                })
            },
            enumerable: true
        },
        copy: {
            value() {
                const M = proto.WebMessageInfo
                return smsg(this.conn, M.fromObject(M.toObject(this)))
            },
            enumerable: true
        }
    })
}

export function protoType() {
    Buffer.prototype.toArrayBuffer = function toArrayBufferV2() {
        const ab = new ArrayBuffer(this.length)
        const view = new Uint8Array(ab)
        for (let i = 0; i < this.length; ++i) {
            view[i] = this[i]
        }
        return ab
    }

    Buffer.prototype.toArrayBufferV2 = function toArrayBuffer() {
        return this.buffer.slice(this.byteOffset, this.byteOffset + this.byteLength)
    }

    ArrayBuffer.prototype.toBuffer = function toBuffer() {
        return Buffer.from(new Uint8Array(this))
    }

    Uint8Array.prototype.getFileType = ArrayBuffer.prototype.getFileType = Buffer.prototype.getFileType = async function getFileType() {
        return await fileTypeFromBuffer(this)
    }

    String.prototype.isNumber = Number.prototype.isNumber = isNumber

    String.prototype.capitalize = function capitalize() {
        return this.charAt(0).toUpperCase() + this.slice(1, this.length)
    }

    String.prototype.decodeJid = function decodeJid() {
        if (/:\d+@/gi.test(this)) {
            const decode = jidDecode(this) || {}
            return (decode.user && decode.server && decode.user + '@' + decode.server || this).trim()
        } else return this.trim()
    }

    Number.prototype.toTimeString = function toTimeString() {
        const seconds = Math.floor((this / 1000) % 60)
        const minutes = Math.floor((this / (60 * 1000)) % 60)
        const hours = Math.floor((this / (60 * 60 * 1000)) % 24)
        const days = Math.floor((this / (24 * 60 * 60 * 1000)))
        return (
            (days ? `${days} day(s) ` : '') +
            (hours ? `${hours} hour(s) ` : '') +
            (minutes ? `${minutes} minute(s) ` : '') +
            (seconds ? `${seconds} second(s)` : '')
        ).trim() || '0 second(s)'
    }
}

function nullish(args) {
    return !(args !== null && args !== undefined)
}

function isNumber() {
    const int = parseInt(this)
    return typeof int === 'number' && !isNaN(int)
}

export default {
    makeWASocket,
    smsg,
    serialize,
    protoType
}