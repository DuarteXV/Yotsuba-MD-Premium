let handler = async (m, { conn, usedPrefix }) => {
    
    if (m.isGroup && !db?.data?.chats?.[m.chat]?.nsfw) {
        return m.reply(`💙 El contenido *NSFW* está desactivado en este grupo.\n> Un administrador puede activarlo con el comando » *#nsfw on*`);
    }
    
    let name2 = conn.getName(m.sender) || 'Usuario';
    let name = 'Usuario';
    
    if (m.mentionedJid && m.mentionedJid.length > 0) {
        name = conn.getName(m.mentionedJid[0]) || 'Usuario mencionado';
        var str = `\`${name2}\` *se vino dentro de* \`${name}\`.`;
    } else if (m.quoted && m.quoted.sender) {
        name = conn.getName(m.quoted.sender) || 'Usuario citado';
        var str = `\`${name2}\` *se vino dentro de* \`${name}\`.`;
    } else {
        var str = `\`${name2}\` *se vino dentro de... Omitiremos eso*`;
    }
    
    if (m.isGroup) {
        const videos = [
            'https://telegra.ph/file/9243544e7ab350ce747d7.mp4',
            'https://telegra.ph/file/fadc180ae9c212e2bd3e1.mp4',
            'https://telegra.ph/file/79a5a0042dd8c44754942.mp4',
            'https://telegra.ph/file/035e84b8767a9f1ac070b.mp4',
            'https://telegra.ph/file/0103144b636efcbdc069b.mp4',
            'https://telegra.ph/file/4d97457142dff96a3f382.mp4',
            'https://telegra.ph/file/b1b4c9f48eaae4a79ae0e.mp4',
            'https://telegra.ph/file/5094ac53709aa11683a54.mp4',
            'https://telegra.ph/file/dc279553e1ccfec6783f3.mp4',
            'https://telegra.ph/file/acdb5c2703ee8390aaf33.mp4'
        ];
        
        const video = videos[Math.floor(Math.random() * videos.length)];
        
       
        await m.reply({ video: { url: video }, caption: str, gifPlayback: true });
    }
};

handler.help = ['cum/leche @tag'];
handler.tags = ['nsfw'];
handler.command = ['cum', 'leche', 'venirse'];
handler.group = true;

export default handler;

