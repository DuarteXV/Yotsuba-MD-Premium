/* 
🎤💙 Código creado por Brauliovh3 
 https://github.com/Brauliovh3/HATSUNE-MIKU.git 
💙 Hatsune Miku Bot - Virtual Concert Experience 🎵✨
*/

import fs from 'fs'
import path from 'path'

let handler = async (m, { conn, usedPrefix }) => {
    let who = m.mentionedJid.length > 0 ? m.mentionedJid[0] : (m.quoted ? m.quoted.sender : m.sender)
    let name = conn.getName(who)
    let name2 = conn.getName(m.sender)

    let str = m.mentionedJid.length > 0 || m.quoted 
        ? ` \`${name2}\`se está bañando con \${name || who}\` 🛁` 
        : ` \`${name2}\` está tomando un baño relajante 🛁`
    
    if (m.isGroup) {
        let pp = 'https://files.catbox.moe/6hd5vu.mp4'
        let pp2 = 'https://files.catbox.moe/3nl2f1.mp4'
        let pp3 = 'https://files.catbox.moe/i8yhzh.mp4'
        let pp4 = 'https://files.catbox.moe/62xy3k.mp4'
        let pp5 = 'https://files.catbox.moe/4jmu2o.mp4'
        let pp6 = 'https://files.catbox.moe/tgq1fe.mp4'
        let pp7 = 'https://files.catbox.moe/h0sncb.mp4'
        let pp8 = 'https://files.catbox.moe/dg46q7.mp4'
    
        
        const videos = [pp, pp2, pp3, pp4, pp5, pp6, pp7, pp8]
        const video = videos[Math.floor(Math.random() * videos.length)]
        
        conn.sendMessage(m.chat, { video: { url: video }, gifPlayback: true, caption: str, ptt: true, mentions: [who] }, { quoted: m })
    }
}

handler.help = ['bath']
handler.tags = ['anime']
handler.help = ['bath']
handler.command = ['bath', 'bañarse', 'ducha', 'relajarse', 'relajación']
handler.group = true
handler.register = true;

export default handler

