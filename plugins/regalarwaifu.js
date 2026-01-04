let handler = async (m, { conn, args }) => {
    const from = m.sender;
    const to = (m.mentionedJid && m.mentionedJid[0]) || (args[0] && (args[0].includes('@') ? args[0] : args[0] + '@s.whatsapp.net'));
    if (!to) return m.reply('Debes mencionar a quién quieres regalar tu waifu. Ejemplo: .regalarwaifu @usuario <índice|nombre>');
    if (from === to) return m.reply('No puedes regalarte una waifu a ti mismo.');

    // inicializar estructuras
    global.db.waifu = global.db.waifu || {};
    global.db.waifu.collection = global.db.waifu.collection || {};
    global.db.waifu.waifus = global.db.waifu.waifus || {};
    global.db.data = global.db.data || {};
    global.db.data.users = global.db.data.users || {};
    if (!global.db.data.users[to]) global.db.data.users[to] = {};

    const col = global.db.waifu.collection[from] || [];
    const normalize = s => (s || '').toString().normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim();

    // selector puede ser índice o nombre (args[1..])
    const selector = args.slice(1).join(' ').trim();

    // si no pone selector y tiene colección, mostrar lista
    if (!selector && col.length > 0) {
        const list = col.slice(0, 20).map((w, i) => `${i + 1}. ${w.name || 'Sin nombre'} ${w.rarity ? `— ${w.rarity}` : ''}`).join('\n');
        const more = col.length > 20 ? `\n...y ${col.length - 20} más` : '';
        return conn.reply(m.chat, `🗂️ Tu colección:\n${list}${more}\n\nUsa: .regalarwaifu @usuario <índice|nombre> para regalar. Ejemplo: .regalarwaifu @usuario 2`, m);
    }

    let selected = null;
    if (selector) {
        const idx = parseInt(selector);
        if (!isNaN(idx)) selected = col[idx - 1];
        else {
            const norm = normalize(selector);
            selected = col.find(w => w.name && normalize(w.name) === norm) || col.find(w => w.name && normalize(w.name).includes(norm));
        }
    }

    // fallback: slot único
    if (!selected && global.db.waifu.waifus[from]) selected = global.db.waifu.waifus[from];

    if (!selected) return m.reply('No tienes ninguna waifu para regalar. Usa: .regalarwaifu @usuario <índice|nombre>');

    // transferir al receptor
    global.db.waifu.collection[to] = global.db.waifu.collection[to] || [];
    global.db.waifu.collection[to].push(selected);

    // eliminar del origen
    if (col && col.length) {
        const pos = col.findIndex(w => w === selected || (w.name && selected.name && w.name === selected.name));
        if (pos !== -1) col.splice(pos, 1);
    } else if (global.db.waifu.waifus && global.db.waifu.waifus[from]) {
        delete global.db.waifu.waifus[from];
    }

    await conn.reply(m.chat, `🎁 Has regalado ${selected.name} a @${to.split('@')[0]}!`, m, { mentions: [to] });
};

handler.help = ['regalarwaifu @usuario'];
handler.tags = ['rpg'];
handler.command = ['regalarwaifu'];
handler.register = true;
handler.group = true;

export default handler;

