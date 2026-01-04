let handler = async (m, { conn, args, participants }) => {
    let users = Object.entries(global.db.data.users).map(([key, value]) => {
        return { ...value, jid: key };
    });

    let sortedLim = users.sort((a, b) => (b.coin || 0) + (b.bank || 0) - (a.coin || 0) - (a.bank || 0));
    let len = args[0] && args[0].length > 0 ? Math.min(10, Math.max(parseInt(args[0]), 10)) : Math.min(10, sortedLim.length);
    
    let text = `🏆 *RANKING DE BLUE-LOCK-POINTS* 🏆

⚽️ *Top Usuarios con más Blue-Lock-Points* 💰

`;

    text += sortedLim.slice(0, len).map(({ jid, coin, bank }, i) => {
        let total = (coin || 0) + (bank || 0);
        let position = i + 1;
        let medal = position === 1 ? '🥇' : position === 2 ? '🥈' : position === 3 ? '🥉' : '⚽️';
        let userName = participants.some(p => jid === p.jid) ? conn.getName(jid) : jid.split`@`[0];
        
        return `${medal} *#${position}* • ${userName}
   🏆 Total: *${total.toLocaleString()}* Blue-Lock-Points`;
    }).join('\n\n');

    text += `\n\n🔥 *Isagi Yoichi Bot* ⚽️`;

    await conn.reply(m.chat, text.trim(), m, { mentions: conn.parseMention(text) });
}

handler.help = ['baltop'];
handler.tags = ['rpg'];
handler.command = ['baltop', 'eboard'];
handler.group = true;
handler.register = true;
handler.fail = null;
handler.exp = 0;

export default handler;

function sort(property, ascending = true) {
    if (property) return (...args) => args[ascending & 1][property] - args[!ascending & 1][property];
    else return (...args) => args[ascending & 1] - args[!ascending & 1];
}

function toNumber(property, _default = 0) {
    if (property) return (a, i, b) => {
        return { ...b[i], [property]: a[property] === undefined ? _default : a[property] };
    }
    else return a => a === undefined ? _default : a;
}

function enumGetKey(a) {
    return a.jid;
}
