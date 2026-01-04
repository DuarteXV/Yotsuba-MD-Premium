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
        ? `💙 \`${name2}\` despertó a \`${name}\` con una canción matutina de Miku 🌅☀️` 
        : `💙 \`${name2}\` se despertó feliz en el mundo virtual de Miku 🌅✨`
    
    if (m.isGroup) {
        let pp = 'https://media.tenor.com/xUWFUAZPLUwAAAPo/anime-anime-girl.mp4'
        let pp2 = 'https://media.tenor.com/4lSF0owFF0AAAAPo/frieren-anime.mp4'
        let pp3 = 'https://media.tenor.com/ZEOi6sEqzqQAAAPo/miku-hatsune-miku.mp4'
        let pp4 = 'https://media.tenor.com/6nfl_Ka05msAAAPo/luffy-one-piece.mp4'
        let pp5 = 'https://media.tenor.com/xlwtvJtC6FAAAAPo/jjk-jujutsu-kaisen.mp4'
        let pp6 = 'https://media.tenor.com/jP-ZoWG_N64AAAPo/shadow-garden-good-morning.mp4'
        let pp7 = 'https://media.tenor.com/n1Z5YSSHFkIAAAPo/oreki-houtarou.mp4'
        let pp8 = 'https://media.tenor.com/QpQfzwVZZtIAAAPo/anime-akame-ga-kill.mp4'
        
        const videos = [pp, pp2, pp3, pp4, pp5, pp6, pp7, pp8]
        const video = videos[Math.floor(Math.random() * videos.length)]
        
        conn.sendMessage(m.chat, { video: { url: video }, gifPlayback: true, caption: str, ptt: true, mentions: who ? [who] : [] }, { quoted: m })
    }
}

handler.help = ['morning']
handler.tags = ['anime']
handler.command = ['morning', 'despertar', 'buenosdias', 'despierta', 'wake-up', 'good-morning']
handler.group = true
handler.register = true;
export default handler
