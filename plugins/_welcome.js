import fetch from 'node-fetch'

export async function before(m, { conn, participants, groupMetadata }) {
  try {
    if (!m.isGroup) return true
    if (!m.messageStubType) return true

    if (!global.db) global.db = { data: { chats: {} } }
    if (!global.db.data) global.db.data = { chats: {} }
    if (!global.db.data.chats) global.db.data.chats = {}
    if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}

    const chat = global.db.data.chats[m.chat]

    if (chat.welcome === undefined) chat.welcome = true
    if (chat.welcome === false && chat.welcome !== true) chat.welcome = true

    console.log(`🔍 Estado welcome para ${m.chat}:`, chat.welcome)

    if (!chat.welcome) {
      console.log('❌ Welcome desactivado, saltando...')
      return true
    }

    const groupSize = (participants || []).length

    const sendSingleWelcome = async (jid, text, user, quoted) => {
      try {
        let ppUrl = null
        try {
          ppUrl = await conn.profilePictureUrl(user, 'image').catch(() => null)
        } catch (e) {
          console.log('Error obteniendo foto de perfil:', e)
        }

        if (!ppUrl) {
          ppUrl = 'https://raw.githubusercontent.com/ANDERSONARRUE/Img.2/main/upload_1767297311338.jpg'
        }

        console.log('📤 Enviando welcome con imagen no descargable y reenvío desde canal...')

        await conn.sendMessage(jid, {
          text: text,
          contextInfo: {
            mentionedJid: [user],
            forwardingScore: 1,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: global.ch.ch1,
              newsletterName: '⚽️ Isagi Yoichi Bot',
              serverMessageId: -1
            },
            externalAdReply: {
              title: botname,
              body: `Bienvenido al grupo • ${groupSize} miembros`,
              thumbnailUrl: ppUrl,
              mediaType: 1,
              renderLargerThumbnail: true
            }
          }
        }, { quoted })

      } catch (err) {
        console.log('sendSingleWelcome error:', err)
        return await conn.reply(jid, text, quoted, { mentions: [user] })
      }
    }

    if (m.messageStubType === 27) {
      console.log('🎉 Nuevo usuario detectado (tipo 27)')

      const users = m.messageStubParameters || []
      if (users.length === 0) {
        console.log('⚠️ No hay usuarios en messageStubParameters')
        return true
      }

      for (const user of users) {
        if (!user) continue

        const mentionTag = '@' + user.replace(/@.+/, '')

        const welcomeText = `👋 ¡Hola ${mentionTag}!

🎉 Bienvenido a *${groupMetadata?.subject || 'el grupo'}*
🔥 Somos *${groupSize}* miembros
⚽️ ${global.welcom1 || 'El futbol nos une'}
📝 Ayuda: *#help*`

        await sendSingleWelcome(m.chat, welcomeText, user, m)
        console.log(`✅ Welcome enviado a ${mentionTag}`)
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
      return true
    }

    if (m.messageStubType === 28 || m.messageStubType === 32) {
      console.log(`👋 Usuario salió (tipo ${m.messageStubType})`)

      const users = m.messageStubParameters || []
      if (users.length === 0) return true

      for (const user of users) {
        if (!user) continue

        const mentionTag = '@' + user.replace(/@.+/, '')

        const byeText = `👋 ¡Hasta luego ${mentionTag}!

😢 Te extrañaremos en *${groupMetadata?.subject || 'el grupo'}*
🔥 ${global.welcom2 || 'Gracias por ser parte de la comunidad'}`

        await sendSingleWelcome(m.chat, byeText, user, m)
        console.log(`✅ Goodbye enviado a ${mentionTag}`)
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
      return true
    }

    return true

  } catch (e) {
    console.error('plugins/_welcome error', e)
    return true
  }
}