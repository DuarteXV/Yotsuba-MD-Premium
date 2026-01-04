let handler = async (m, { conn, args, participants }) => {
    let users = Object.entries(global.db.data.users).map(([key, value]) => {
        return { ...value, jid: key };
    });

    let sortedLevel = users.sort((a, b) => (b.exp || 0) - (a.exp || 0));
    let page = parseInt(args[0]) || 1;
    let pageSize = 10;
    let startIndex = (page - 1) * pageSize;
    let endIndex = startIndex + pageSize;
    
    let totalPages = Math.ceil(sortedLevel.length / pageSize);
    
    let text = `⚽️ *RANKING ISAGI YOICHI* ⚽️

⚽️ *Top de Usuarios con más XP* 🔥

`;

    text += sortedLevel.slice(startIndex, endIndex).map(({ jid, exp, level }, i) => {
        let position = startIndex + i + 1;
        let medal = position === 1 ? '🥇' : position === 2 ? '🥈' : position === 3 ? '🥉' : '⚽️';
        let userName = participants.some(p => jid === p.jid) ? conn.getName(jid) : jid.split`@`[0];
        
        return `${medal} *#${position}* • ${userName}
   💎 XP: *${exp.toLocaleString()}*
   ⭐ Nivel: *${level}*`;
    }).join('\n\n');

    text += `\n\n📄 Página *${page}* de *${totalPages}*`;
    
    if (page < totalPages) {
        text += `\n💡 Siguiente: *#lb ${page + 1}*`;
    }
    
    text += `\n\n🔥 *Isagi Yoichi Bot* ⚽️`;

    await conn.reply(m.chat, text.trim(), m, { mentions: conn.parseMention(text) });
}

handler.help = ['lb'];
handler.tags = ['rpg'];
handler.command = ['lboard', 'top', 'lb']; 
handler.group = true;
handler.reg = true;
handler.fail = null;
handler.exp = 0;

export default handler;
