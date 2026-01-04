/* 
🎤💙 Código creado por Brauliovh3 
✧ https://github.com/Brauliovh3/HATSUNE-MIKU.git 
💙 Hatsune Miku Bot - Virtual Concert Experience 🎵✨
*/

import fs from 'fs'
import path from 'path'

let handler = async (m, { conn, usedPrefix }) => {
    let who = m.mentionedJid.length > 0 ? m.mentionedJid[0] : (m.quoted ? m.quoted.sender : null)
    let name = who ? (await conn.getName(who)) || who.replace('@s.whatsapp.net', '') : null
    let name2 = m.pushName || (await conn.getName(m.sender)) || m.sender.split('@')[0]

    let str = who
        ? `💙 \`${name2}\` se está riendo con \`${name}\` en el concierto virtual 😄` 
        : `💙 \`${name2}\` se ríe felizmente en el mundo virtual de Miku 😄`
    
    if (m.isGroup) {
        let pp = 'https://media.tenor.com/9s-im1zHOqsAAAPo/obito-obito-uchiha.mp4'
        let pp2 = 'https://media.tenor.com/4-naM7LyYJAAAAPo/goon-tuah.mp4'
        let pp3 = 'https://media.tenor.com/CXsIEWMlv6kAAAPo/funny-mio-mio-mio-ni.mp4'
        let pp4 = 'https://media.tenor.com/RqKEPJqkI0wAAAPo/death-note-light-yagami.mp4'
        let pp5 = 'https://media.tenor.com/CG8uhh9CoJcAAAPo/shikimori-shikimoris-not-just-cute.mp4'
        let pp6 = 'https://media.tenor.com/0CmFMbcGVKUAAAPo/spy-x-family-anime.mp4'
        let pp7 = 'https://media.tenor.com/mzIscFHY8L0AAAPo/blue-box-ao-no-hako.mp4'
        let pp8 = 'https://media.tenor.com/GQ0owvcafUEAAAPo/jujutsu-kaisen-toji.mp4'
        
        
        const videos = [pp, pp2, pp3, pp4, pp5, pp6, pp7, pp8]
        const video = videos[Math.floor(Math.random() * videos.length)]
        
        conn.sendMessage(m.chat, { video: { url: video }, gifPlayback: true, caption: str, ptt: true, mentions: who ? [who] : [] }, { quoted: m })
    }
}

handler.help = ['laugh']
handler.tags = ['anime']
handler.command = ['laugh', 'reirse', 'risa']
handler.group = true
handler.register = true;
export default handler
