/* 
🎤💙 Codígo creado por Brauliovh3
✧ https://github.com/Brauliovh3/HATSUNE-MIKU.git 
*/

import fs from 'fs'
import path from 'path'

let handler = async (m, { conn, usedPrefix }) => {
    let who = m.mentionedJid.length > 0 ? m.mentionedJid[0] : (m.quoted ? m.quoted.sender : null)
    let name = who ? (await conn.getName(who)) || who.replace('@s.whatsapp.net', '') : null
    let name2 = m.pushName || (await conn.getName(m.sender)) || m.sender.split('@')[0]

    let str = who
        ? `\`${name2}\` está comiendo con \`${name}\` en el café virtual (っ˘ڡ˘ς) 🍰💙` 
        : `\`${name2}\` está comiendo en el mundo virtual (っ˘ڡ˘ς) ✨🎵`
    
    if (m.isGroup) {
        let pp = 'https://media.tenor.com/ZBO4pyuseVcAAAPo/engage-kiss-kanna.mp4'
        let pp2 = 'https://media.tenor.com/uk9xO0xpWoIAAAPo/burger-eating.mp4'
        let pp3 = 'https://media.tenor.com/rL9bf5nEuFUAAAPo/dragon-ball-eating.mp4'
        let pp4 = 'https://media.tenor.com/51l2Vl3A9ZcAAAPo/zombielandsaga-eat.mp4'
        let pp5 = 'https://media.tenor.com/c1l2eqy7SJgAAAPo/sasuke-uchiha-eating.mp4'
        let pp6 = 'https://media.tenor.com/a2sQtVpp8EYAAAPo/she-blushes-with-her-eyes-close-and-speaking-while-eating.mp4'
        let pp7 = 'https://media.tenor.com/EqqzgcETPSoAAAPo/shiroha-naruse.mp4'
        let pp8 = 'https://media.tenor.com/SdQXVzloThEAAAPo/chewzuka-cheeks.mp4'
        
        
        const videos = [pp, pp2, pp3, pp4, pp5, pp6, pp7, pp8]
        const video = videos[Math.floor(Math.random() * videos.length)]
        
        conn.sendMessage(m.chat, { video: { url: video }, gifPlayback: true, caption: str, ptt: true, mentions: who ? [who] : [] }, { quoted: m })
    }
}

handler.help = ['eat']
handler.tags = ['anime']
handler.command = ['eat', 'comer','almorzar','cenar','desayunar','food','comida','snack','tragar','devorar','digerir','masticar','engullir','zampar']
handler.group = true
handler.register = true;
export default handler
