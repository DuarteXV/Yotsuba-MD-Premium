/* 
🎤💙 Codígo creado por Brauliovh3
https://github.com/Brauliovh3/HATSUNE-MIKU.git 
*/

import fs from 'fs'
import path from 'path'

let handler = async (m, { conn, usedPrefix }) => {
    let who = m.mentionedJid.length > 0 ? m.mentionedJid[0] : (m.quoted ? m.quoted.sender : m.sender)
    let name = conn.getName(who)
    let name2 = conn.getName(m.sender)

    let str = m.mentionedJid.length > 0 || m.quoted 
        ? `\`${name2}\` está tomando café con \`${name || who}\` en el café virtual (≧▽≦) ☕💙` 
        : `\`${name2}\` está tomando café en el mundo virtual ٩(●ᴗ●)۶ ☕`
    
    if (m.isGroup) {
        let pp = 'https://media.tenor.com/16LH1QP3r08AAAPo/bocchi-coffee-bocchi-the-rock.mp4'
        let pp2 = 'https://media.tenor.com/-Iw8oCIT0BMAAAPo/tokyo-ghoul-coffee.mp4'
        let pp3 = 'https://media.tenor.com/yoXaDbOdqb4AAAPo/coffee-overflow.mp4'
        let pp4 = 'https://media.tenor.com/2ztTxOV470gAAAPo/anime.mp4'
        let pp5 = 'https://media.tenor.com/zgxmSzVI_44AAAPo/jojos-bizarre-adventure-dio.mp4'
        let pp6 = 'https://media.tenor.com/Nn4ydcdsdbEAAAPo/manga-rascal-does-not-dream-of-bunny-girl-senpai.mp4'
        let pp7 = 'https://media.tenor.com/CdWhhXbtRvEAAAPo/kobayashi-drinking.mp4'
        let pp8 = 'https://media.tenor.com/Gqm8J8Ia8wsAAAPo/tanya-tanya-the-evil.mp4'
       
        
        const videos = [pp, pp2, pp3, pp4, pp5, pp6, pp7, pp8]
        const video = videos[Math.floor(Math.random() * videos.length)]
        
        conn.sendMessage(m.chat, { video: { url: video }, gifPlayback: true, caption: str, ptt: true, mentions: [who] }, { quoted: m })
    }
}

handler.help = ['coffee']
handler.tags = ['anime']
handler.command = ['coffe','coffee', 'cafe', 'café', 'tomarcafe', 'tomarcafé']
handler.group = true
handler.register = true;
export default handler

