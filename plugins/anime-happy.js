/* 
🎤💙 Código creado por Brauliovh3 
✧ https://github.com/Brauliovh3/HATSUNE-MIKU.git 
💙 Hatsune Miku Bot - Virtual Concert Experience 🎵✨
*/

import fs from 'fs'
import path from 'path'

let handler = async (m, { conn, usedPrefix }) => {
    let who = m.mentionedJid.length > 0 ? m.mentionedJid[0] : (m.quoted ? m.quoted.sender : m.sender)
    let name = conn.getName(who)
    let name2 = conn.getName(m.sender)

    let str = m.mentionedJid.length > 0 || m.quoted 
        ? `💙 \`${name2}\` está súper feliz en el concierto virtual por \`${name || who}\` 😊` 
        : `💙 \`${name2}\` está radiante de felicidad virtual como Miku 😊`
    
    if (m.isGroup) {
        let pp = 'https://media.tenor.com/D05kuhjm9rUAAAPo/jjk-anime.mp4'
        let pp2 = 'https://media.tenor.com/UemiFBIwaU4AAAPo/sono-bisque-doll-wa-koi-wo-suru-royalmale.mp4'
        let pp3 = 'https://media.tenor.com/MM3La2Dx0c4AAAPo/onimai-cute-anime-girl-smile-smiling.mp4'
        let pp4 = 'https://media.tenor.com/9TzshBF2xAIAAAPo/kusuriya-no-hitorigoto-apothecary.mp4'
        let pp5 = 'https://media.tenor.com/NACzM0o4iv4AAAPo/happy-easter.mp4'
        let pp6 = 'https://media.tenor.com/ST4p-nweZmkAAAPo/re-zero-cute.mp4'
        let pp7 = 'https://media.tenor.com/a7h5O_FFAc8AAAPo/turbo-granny-dandadan.mp4'
        let pp8 = 'https://media.tenor.com/7oDs8Q4UdRkAAAPo/aaaa.mp4'
        
        
        const videos = [pp, pp2, pp3, pp4, pp5, pp6, pp7, pp8]
        const video = videos[Math.floor(Math.random() * videos.length)]
        
        conn.sendMessage(m.chat, { video: { url: video }, gifPlayback: true, caption: str, ptt: true, mentions: [who] }, { quoted: m })
    }
}

handler.help = ['happy']
handler.tags = ['anime']
handler.command = ['happy', 'feliz']
handler.group = true
handler.register = true;
export default handler
