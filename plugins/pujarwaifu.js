let handler = async (m, { conn, args }) => {
    const bidder = m.sender;
    const cantidad = parseInt(args[0]);
    // Selecciona subasta: si se menciona al dueño, usa esa, si no y hay una sola activa, la usa
    global.db.waifu = global.db.waifu || {};
    const subastas = global.db.waifu.subastas || {};
    if (!cantidad || cantidad <= 0) return m.reply('Debes indicar una cantidad válida. Ejemplo: .pujarwaifu 150');
    let owner = null;
    // Si se menciona a alguien, usarlo
    if (m.mentionedJid && m.mentionedJid[0]) owner = m.mentionedJid[0];
    else if (args[1]) owner = (args[1].includes('@') ? args[1] : args[1] + '@s.whatsapp.net');
    else {
        // Listar subastas activas con índices si no se especifica dueño
        const keys = Object.keys(subastas);
        if (keys.length === 0) return m.reply('No hay subastas activas en este momento.');
        if (keys.length === 1) owner = keys[0];
        else {
            const list = keys.map((k, i) => `${i + 1}. @${k.split('@')[0]} » ${subastas[k].waifu?.name || 'Sin nombre'} (${subastas[k].mejorPuja || subastas[k].precioInicial} ${global.db?.settings?.moneda || 'coin'})`).join('\n');
            return conn.reply(m.chat, `📢 Subastas activas:\n${list}\n\nUsa: .pujarwaifu <cantidad> <número|@dueño> para pujar en una subasta. Ejemplo: .pujarwaifu 150 2`, m);
        }
    }
    // Si owner es un número (índice de la lista), resolverlo
    if (owner && !owner.includes('@')) {
        const idx = parseInt(owner);
        const keys = Object.keys(subastas);
        if (!isNaN(idx) && keys[idx - 1]) owner = keys[idx - 1];
    }

    const s = subastas[owner];
    if (!s) return m.reply('No se encontró la subasta especificada.');
    // Validar puja
    const min = Math.max(s.precioInicial, s.mejorPuja || 0);
    if (cantidad <= min) return m.reply(`Debes pujar más de ${min} ${global.db?.settings?.moneda || 'coin'}.`);
    // Validar fondos del pujador
    global.db.data = global.db.data || {};
    global.db.data.users = global.db.data.users || {};
    if (!global.db.data.users[bidder] || (global.db.data.users[bidder].coin || 0) < cantidad) return m.reply('No tienes suficientes monedas para esta puja.');
    // Registrar puja (no se deducen monedas hasta finalizar)
    s.mejorPuja = cantidad;
    s.mejorPostor = bidder;
    await conn.reply(m.chat, `💸 Nueva puja en la subasta de @${owner.split('@')[0]}: @${bidder.split('@')[0]} ofrece ${cantidad} ${global.db?.settings?.moneda || 'coin'}.`, m, { mentions: [owner, bidder] });
};

handler.help = ['pujarwaifu <cantidad> [@dueño]'];
handler.tags = ['rpg'];
handler.command = ['pujarwaifu'];
handler.register = true;
handler.group = true;

export default handler;

