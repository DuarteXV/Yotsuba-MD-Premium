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

<<<<<<< HEAD
*╭╼𝅄꒰𑁍⃪⚽👁️ ꒱ 𐔌 ANÁLISIS TÁCTICO 𐦯*
*|✎ Creador:* 🏆 𝔻𝕦𝕒𝕣𝕥𝕖𝕩𝕍 🏆
*|✎ Jugadores:* ${totalreg.toLocaleString()}
*|✎ Tiempo Activo:* ${uptime}
*|✎ Comandos:* ${totalCommands}
*|✎ Sistema:* Multi Device 
*╰─ׅ─ׅ┈─๋︩︪─⚽👁️─╯*

=======
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

<<<<<<< HEAD
await conn.sendMessage(m.chat, { 
text: txt,
contextInfo: {
mentionedJid: [userId],
isForwarded: true,
forwardedNewsletterMessageInfo: {
  newsletterJid: '120363420979328566@newsletter',
  newsletterName: '⏤͟͞ू⃪𝐁𝕃𝐔𝔼 𝐋𝕆𝐂𝕂 𝐂𝕃𝐔𝔹 𑁯🩵ᰍ',
  serverMessageId: -1
},
externalAdReply: {                
title: 'Isagi Yoichi IA',
body: 'Sistema de Visión Egoísta - Modo Fútbol',
mediaType: 1,
mediaUrl: global.redes || '',
sourceUrl: 'https://whatsapp.com/channel/0029Vb73g1r1NCrTbefbFQ2T',
thumbnail: await (await fetch(global.banner || 'http://files.hostrta.win/files/xzadonix_76.jpg')).buffer(),
showAdAttribution: false,
containsAutoReply: true,
renderLargerThumbnail: true
}}}, { quoted: m })
=======
let gifUrl = 'https://raw.githubusercontent.com/ANDERSONARRUE/Img.2/main/upload_1767146081404.gif'

try {
    // Enviar GIF con caption
    await conn.sendMessage(m.chat, {
        video: { url: gifUrl },
        caption: txt,
        gifPlayback: true,
        mentions: [userId]
    }, { quoted: m })
} catch (error) {
    console.error('Error al enviar GIF:', error)
    // Si falla, enviar solo el texto
    await conn.sendMessage(m.chat, {
        text: txt,
        mentions: [userId]
    }, { quoted: m })
}
>>>>>>> cd5307fbafd0789510bfc1daf942cc2b226ac049
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