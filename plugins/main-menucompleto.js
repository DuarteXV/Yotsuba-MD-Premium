import fetch from 'node-fetch'


let gifBuffer = null

const getGif = async (url) => {
  try {
    if (gifBuffer) return gifBuffer
    const response = await fetch(url)
    if (!response.ok) throw new Error('Error al descargar GIF')
    gifBuffer = await response.buffer()
    return gifBuffer
  } catch (error) {
    console.error('Error descargando GIF:', error)
    return null
  }
}

let handler = async (m, { conn, args }) => {
  let userId = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender
  let user = global.db.data.users[userId]
  let name = conn.getName(userId)
  let _uptime = process.uptime() * 1000
  let uptime = clockString(_uptime)
  let totalreg = Object.keys(global.db.data.users).length
  let totalCommands = Object.values(global.plugins).filter((v) => v.help && v.tags).length

  let txt = `▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄
🎯 *¡VISIÓN EGOÍSTA ACTIVADA!*

Soy *Isagi Yoichi IA* ⚽👁️ *${(conn.user.jid == global.conn.user.jid ? '(Bot Principal)' : '(Sub-Bot)')}*

> ꒰⚽ ʚ˚₊‧ ✎ ꒱ FILOSOFÍA:
- Cada comando es una jugada estratégica
- La precisión define la victoria final  
- Opero bajo la filosofía del "Fútbol Egoísta"

*╭╼𝅄꒰𑁍⃪⚽👁️ ꒱ 𐔌 ANÁLISIS TÁCTICO 𐦯*
*|✎ Creador:* 🏆 𝔻𝕦𝕒𝕣𝕥𝕖𝕩𝕍 🏆
*|✎ Jugadores:* ${totalreg.toLocaleString()}
*|✎ Tiempo Activo:* ${uptime}
*|✎ Comandos:* ${totalCommands}
*|✎ Sistema:* Multi Device 
*╰─ׅ─ׅ┈─๋︩︪─⚽👁️─╯*

*꒰ 🥅ຼິ ANÁLISIS TÁCTICO 𐦯*
*᎒֑֬֫⚽ִִֺּֽֽׂ֪֤֭ׄؒᬼ-• Creador:* 🏆 𝔻𝕦𝕒𝕣𝕥𝕖𝕩𝕍 🏆
*᎒֑֬֫💫ִִֺּֽֽׂ֪֤֭ׄؒᬼ-• Jugadores:* ${totalreg.toLocaleString()}
*᎒֑֬֫⚽ִִֺּֽֽׂ֪֤֭ׄؒᬼ-• Tiempo Activo:* ${uptime}
*᎒֑֬֫💫ִִֺּֽֽׂ֪֤֭ׄؒᬼ-• Comandos:* ${totalCommands}
*᎒֑֬֫⚽ִִֺּֽֽׂ֪֤֭ׄؒᬼ-• Sistema:* Multi Device 
>>>>>>> cd5307fbafd0789510bfc1daf942cc2b226ac049

*꒰👁️ຼິ ︵ ESTADÍSTICAS PERSONALES 𐦯*
*᎒֑֬֫⚽ִִֺּֽֽׂ֪֤֭ׄؒᬼ-• Nombre:* ${name}
*᎒֑֬֫💫ִִֺּֽֽׂ֪֤֭ׄؒᬼ-• Nivel:* ${user.level || 1}
*᎒֑֬֫⚽ִִֺּֽֽׂ֪֤֭ׄؒᬼ-• Experiencia:* ${user.exp || 0}

╭─「 *BUSCADORES* 」
├ ◯⃘🏆̸̷᪶⃞⍣⸽𝆹𝅥𝆺𝅥 .pinterest
├ ◯⃘🏆̸̷᪶⃞⍣⸽𝆹𝅥𝆺𝅥 .google
├ ◯⃘🏆̸̷᪶⃞⍣⸽𝆹𝅥𝆺𝅥 .yts
├ ◯⃘🏆̸̷᪶⃞⍣⸽𝆹𝅥𝆺𝅥 .imagen
├ ◯⃘🏆̸̷᪶⃞⍣⸽𝆹𝅥𝆺𝅥 .infoanime
├ ◯⃘🏆̸̷᪶⃞⍣⸽𝆹𝅥𝆺𝅥 .tiktoksearch
├ ◯⃘🏆̸̷᪶⃞⍣⸽𝆹𝅥𝆺𝅥 .githubsearch
├ ◯⃘🏆̸̷᪶⃞⍣⸽𝆹𝅥𝆺𝅥 .cuevana
├ ◯⃘🏆̸̷᪶⃞⍣⸽𝆹𝅥𝆺𝅥 .tweetposts
╰ ◯⃘🏆̸̷᪶⃞⍣⸽𝆹𝅥𝆺𝅥 .npmjs

╭─「 *DESCARGAS* 」
├ 𑁍⃪⚽ ❏ .play
├ 𑁍⃪⚽ ❏ .tiktok
├ 𑁍⃪⚽ ❏ .instagram
├ 𑁍⃪⚽ ❏ .facebook
├ 𑁍⃪⚽ ❏ .mediafire
├ 𑁍⃪⚽ ❏ .mega
├ 𑁍⃪⚽ ❏ .twitter
├ 𑁍⃪⚽ ❏ .ytmp3
├ 𑁍⃪⚽ ❏ .ytmp4
├ 𑁍⃪⚽ ❏ .gitclone
╰ 𑁍⃪⚽ ❏ .apk

╭─「 *STICKERS* 」
├ ◯⃘🏆̸̷᪶⃞⍣⸽𝆹𝅥𝆺𝅥 .s
├ ◯⃘🏆̸̷᪶⃞⍣⸽𝆹𝅥𝆺𝅥 .toimg
├ ◯⃘🏆̸̷᪶⃞⍣⸽𝆹𝅥𝆺𝅥 .emojimix
├ ◯⃘🏆̸̷᪶⃞⍣⸽𝆹𝅥𝆺𝅥 .qc
├ ◯⃘🏆̸̷᪶⃞⍣⸽𝆹𝅥𝆺𝅥 .ttp
├ ◯⃘🏆̸̷᪶⃞⍣⸽𝆹𝅥𝆺𝅥 .attp
├ ◯⃘🏆̸̷᪶⃞⍣⸽𝆹𝅥𝆺𝅥 .brat
├ ◯⃘🏆̸̷᪶⃞⍣⸽𝆹𝅥𝆺𝅥 .wm
├ ◯⃘🏆̸̷᪶⃞⍣⸽𝆹𝅥𝆺𝅥 .setmeta
╰ ◯⃘🏆̸̷᪶⃞⍣⸽𝆹𝅥𝆺𝅥 .delmeta

╭─「 *ECONOMÍA* 」
├ ᎒֑֬֫⚽ִִֺּֽֽׂ֪֤֭ׄؒᬼ-• .work
├ ᎒֑֬֫💫ִִֺּֽֽׂ֪֤֭ׄؒᬼ-• .daily
├ ᎒֑֬֫⚽ִִֺּֽֽׂ֪֤֭ׄؒᬼ-• .mine
├ ᎒֑֬֫💫ִִֺּֽֽׂ֪֤֭ׄؒᬼ-• .casino
├ ᎒֑֬֫⚽ִִֺּֽֽׂ֪֤֭ׄؒᬼ-• .cf
├ ᎒֑֬֫💫ִִֺּֽֽׂ֪֤֭ׄؒᬼ-• .slot
├ ᎒֑֬֫⚽ִִֺּֽֽׂ֪֤֭ׄؒᬼ-• .ruleta
├ ᎒֑֬֫💫ִִֺּֽֽׂ֪֤֭ׄؒᬼ-• .steal
├ ᎒֑֬֫⚽ִִֺּֽֽׂ֪֤֭ׄؒᬼ-• .robarxp
├ ᎒֑֬֫💫ִִֺּֽֽׂ֪֤֭ׄؒᬼ-• .bank
├ ᎒֑֬֫⚽ִִֺּֽֽׂ֪֤֭ׄؒᬼ-• .wallet
├ ᎒֑֬֫💫ִִֺּֽֽׂ֪֤֭ׄؒᬼ-• .deposit
├ ᎒֑֬֫⚽ִִֺּֽֽׂ֪֤֭ׄؒᬼ-• .withdraw
├ ᎒֑֬֫💫ִִֺּֽֽׂ֪֤֭ׄؒᬼ-• .transfer
├ ᎒֑֬֫⚽ִִֺּֽֽׂ֪֤֭ׄؒᬼ-• .buyall
├ ᎒֑֬֫💫ִִֺּֽֽׂ֪֤֭ׄؒᬼ-• .cofre
├ ᎒֑֬֫⚽ִִֺּֽֽׂ֪֤֭ׄؒᬼ-• .weekly
╰ ᎒֑֬֫💫ִִֺּֽֽׂ֪֤֭ׄؒᬼ-• .monthly

╭─「 *GACHA* 」
├ 𑁍⃪⚽ ❏ .rollwaifu
├ 𑁍⃪⚽ ❏ .claim
├ 𑁍⃪⚽ ❏ .harem
├ 𑁍⃪⚽ ❏ .charimage
├ 𑁍⃪⚽ ❏ .charinfo
├ 𑁍⃪⚽ ❏ .givechar
├ 𑁍⃪⚽ ❏ .vote
╰ 𑁍⃪⚽ ❏ .waifusboard

╭─「 *JUEGOS* 」
├ ◯⃘🏆̸̷᪶⃞⍣⸽𝆹𝅥𝆺𝅥 .ttt
├ ◯⃘🏆̸̷᪶⃞⍣⸽𝆹𝅥𝆺𝅥 .ppt
├ ◯⃘🏆̸̷᪶⃞⍣⸽𝆹𝅥𝆺𝅥 .matematicas
├ ◯⃘🏆̸̷᪶⃞⍣⸽𝆹𝅥𝆺𝅥 .ahorcado
├ ◯⃘🏆̸̷᪶⃞⍣⸽𝆹𝅥𝆺𝅥 .sopa
╰ ◯⃘🏆̸̷᪶⃞⍣⸽𝆹𝅥𝆺𝅥 .pvp

╭─「 *GRUPOS* 」
├ 𑁍⃪⚽ ❏ .hidetag
├ 𑁍⃪⚽ ❏ .kick
├ 𑁍⃪⚽ ❏ .add
├ 𑁍⃪⚽ ❏ .promote
├ 𑁍⃪⚽ ❏ .demote
├ 𑁍⃪⚽ ❏ .link
├ 𑁍⃪⚽ ❏ .revoke
├ 𑁍⃪⚽ ❏ .group
├ 𑁍⃪⚽ ❏ .warn
├ 𑁍⃪⚽ ❏ .unwarn
├ 𑁍⃪⚽ ❏ .mute
├ 𑁍⃪⚽ ❏ .unmute
├ 𑁍⃪⚽ ❏ .delete
├ 𑁍⃪⚽ ❏ .admins
├ 𑁍⃪⚽ ❏ .gp
├ 𑁍⃪⚽ ❏ .setwelcome
├ 𑁍⃪⚽ ❏ .setbye
├ 𑁍⃪⚽ ❏ .encuesta
├ 𑁍⃪⚽ ❏ .invocar
├ 𑁍⃪⚽ ❏ .gpbanner
├ 𑁍⃪⚽ ❏ .gpname
├ 𑁍⃪⚽ ❏ .gpdesc
╰ 𑁍⃪⚽ ❏ .bot

╭─「 *HERRAMIENTAS* 」
├ ᎒֑֬֫⚽ִִֺּֽֽׂ֪֤֭ׄؒᬼ-• .clima
├ ᎒֑֬֫💫ִִֺּֽֽׂ֪֤֭ׄؒᬼ-• .translate
├ ᎒֑֬֫⚽ִִֺּֽֽׂ֪֤֭ׄؒᬼ-• .enhance
├ ᎒֑֬֫💫ִִֺּֽֽׂ֪֤֭ׄؒᬼ-• .calcular
├ ᎒֑֬֫⚽ִִֺּֽֽׂ֪֤֭ׄؒᬼ-• .fake
├ ᎒֑֬֫💫ִִֺּֽֽׂ֪֤֭ׄؒᬼ-• .letra
├ ᎒֑֬֫⚽ִִֺּֽֽׂ֪֤֭ׄؒᬼ-• .read
├ ᎒֑֬֫💫ִִֺּֽֽׂ֪֤֭ׄؒᬼ-• .whatmusic
├ ᎒֑֬֫⚽ִִֺּֽֽׂ֪֤֭ׄؒᬼ-• .ss
├ ᎒֑֬֫💫ִִֺּֽֽׂ֪֤֭ׄؒᬼ-• .length
├ ᎒֑֬֫⚽ִִֺּֽֽׂ֪֤֭ׄؒᬼ-• .say
├ ᎒֑֬֫💫ִִֺּֽֽׂ֪֤֭ׄؒᬼ-• .todoc
╰ ᎒֑֬֫⚽ִִֺּֽֽׂ֪֤֭ׄؒᬼ-• .horario

╭─「 *REACCIONES* 」
├ 𑁍⃪⚽ ❏ .hug
├ 𑁍⃪⚽ ❏ .kiss
├ 𑁍⃪⚽ ❏ .pat
├ 𑁍⃪⚽ ❏ .slap
├ 𑁍⃪⚽ ❏ .cry
├ 𑁍⃪⚽ ❏ .happy
├ 𑁍⃪⚽ ❏ .angry
├ 𑁍⃪⚽ ❏ .love
├ 𑁍⃪⚽ ❏ .dance
├ 𑁍⃪⚽ ❏ .laugh
├ 𑁍⃪⚽ ❏ .run
├ 𑁍⃪⚽ ❏ .dias
├ 𑁍⃪⚽ ❏ .noches
╰ 𑁍⃪⚽ ❏ .think

╭─「 *PERFIL* 」
├ ◯⃘🏆̸̷᪶⃞⍣⸽𝆹𝅥𝆺𝅥 .reg
├ ◯⃘🏆̸̷᪶⃞⍣⸽𝆹𝅥𝆺𝅥 .unreg
├ ◯⃘🏆̸̷᪶⃞⍣⸽𝆹𝅥𝆺𝅥 .profile
├ ◯⃘🏆̸̷᪶⃞⍣⸽𝆹𝅥𝆺𝅥 .marry
├ ◯⃘🏆̸̷᪶⃞⍣⸽𝆹𝅥𝆺𝅥 .divorce
├ ◯⃘🏆̸̷᪶⃞⍣⸽𝆹𝅥𝆺𝅥 .setgenre
├ ◯⃘🏆̸̷᪶⃞⍣⸽𝆹𝅥𝆺𝅥 .setbirth
├ ◯⃘🏆̸̷᪶⃞⍣⸽𝆹𝅥𝆺𝅥 .setdescription
├ ◯⃘🏆̸̷᪶⃞⍣⸽𝆹𝅥𝆺𝅥 .lb
├ ◯⃘🏆̸̷᪶⃞⍣⸽𝆹𝅥𝆺𝅥 .level
├ ◯⃘🏆̸̷᪶⃞⍣⸽𝆹𝅥𝆺𝅥 .comprarpremium
╰ ◯⃘🏆̸̷᪶⃞⍣⸽𝆹𝅥𝆺𝅥 .confesiones

╭─「 *CONFIGURACIÓN* 」
├ 𑁍⃪⚽ ❏ .ping
├ 𑁍⃪⚽ ❏ .uptime
├ 𑁍⃪⚽ ❏ .serbot
├ 𑁍⃪⚽ ❏ .qr
├ 𑁍⃪⚽ ❏ .status
├ 𑁍⃪⚽ ❏ .infobot
├ 𑁍⃪⚽ ❏ .script
├ 𑁍⃪⚽ ❏ .staff
├ 𑁍⃪⚽ ❏ .bots
├ 𑁍⃪⚽ ❏ .links
├ 𑁍⃪⚽ ❏ .sug
├ 𑁍⃪⚽ ❏ .reporte
├ 𑁍⃪⚽ ❏ .sistema
├ 𑁍⃪⚽ ❏ .speed
├ 𑁍⃪⚽ ❏ .views
├ 𑁍⃪⚽ ❏ .funciones
╰ 𑁍⃪⚽ ❏ .ds

> ⚽ *Cada comando es una oportunidad de gol* 👁️`.trim()

  let gifUrl = 'https://raw.githubusercontent.com/ANDERSONARRUE/Img.2/main/upload_1767146081404.gif'

  const gif = await getGif(gifUrl)
  
  await conn.sendMessage(m.chat, {
    video: gif,
    caption: txt,
    gifPlayback: true,
    contextInfo: {
      mentionedJid: [userId],
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363420979328566@newsletter',
        newsletterName: '⏤͟͞ू⃪𝐁𝕃𝐔𝔼 𝐋𝕆𝐂𝕂 𝐂𝕃𝐔𝔹 𑁯🩵ᰍ',
        serverMessageId: -1
      }
    }
  }, { quoted: m })
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = ['menu','help','allmenu', 'menuall']

export default handler

function clockString(ms) {
  let seconds = Math.floor((ms / 1000) % 60)
  let minutes = Math.floor((ms / (1000 * 60)) % 60)
  let hours = Math.floor((ms / (1000 * 60 * 60)) % 24)
  return `${hours}h ${minutes}m ${seconds}s`
}