let handler = async (m, { conn, participants }) => {
    const groupMetadata = await conn.groupMetadata(m.chat);
    
    // 1. Identificación estricta (Bot y Dueños)
    const botId = conn.user.jid;
    const ownerBot = (global.owner?.[0]?.[0] || '') + '@s.whatsapp.net';
    const ownerGroup = groupMetadata.owner || '';
    
    // Lista blanca para evitar que el bot se auto-elimine o toque a sus creadores
    const whitelist = [botId, ownerBot, ownerGroup];

    // 2. Filtrar Admins para degradar (que no estén en whitelist)
    const adminsToDemote = groupMetadata.participants
        .filter(p => p.admin && !whitelist.includes(p.id))
        .map(p => p.id);

    // 3. Filtrar Usuarios para expulsar (que no estén en whitelist)
    const usersToKick = groupMetadata.participants
        .filter(p => !whitelist.includes(p.id))
        .map(p => p.id);

    if (usersToKick.length === 0) {
        return conn.reply(m.chat, `ℹ️ No hay usuarios para expulsar (el grupo ya está limpio o solo hay personal autorizado).`, m);
    }

    // 4. Confirmación
    let msgConfirm = `⚠️ *CONTROL DE ELIMINACIÓN TOTAL*\n\n`;
    msgConfirm += `Se han identificado:\n`;
    msgConfirm += `• Admins a degradar: *${adminsToDemote.length}*\n`;
    msgConfirm += `• Usuarios a expulsar: *${usersToKick.length}*\n\n`;
    msgConfirm += `*Seguridad:* El Bot y los dueños están protegidos.\n\n`;
    msgConfirm += `¿Proceder? Responde con *"si"* para iniciar.`;

    await conn.reply(m.chat, msgConfirm, m);

    const confirmationKey = `kickall-${m.chat}-${m.sender}`;
    global.confirmationData = global.confirmationData || {};
    global.confirmationData[confirmationKey] = {
        adminsToDemote,
        usersToKick,
        timeout: setTimeout(() => {
            if (global.confirmationData[confirmationKey]) {
                delete global.confirmationData[confirmationKey];
                conn.reply(m.chat, '⏱️ Tiempo agotado. Limpieza cancelada.', m);
            }
        }, 60000) // 1 minuto para confirmar
    };
};

handler.before = async (m, { conn }) => {
    const confirmationKey = `kickall-${m.chat}-${m.sender}`;
    if (!global.confirmationData?.[confirmationKey] || !m.text) return;
    
    const data = global.confirmationData[confirmationKey];
    const response = m.text.toLowerCase().trim();

    if (response === 'si' || response === 'sí') {
        clearTimeout(data.timeout);
        delete global.confirmationData[confirmationKey];

        await conn.reply(m.chat, `🚀 *Iniciando Limpieza...*\n\nPaso 1: Degradando administradores...\nPaso 2: Expulsión masiva.`, m);

        // PASO 1: Quitar Admin a todos los que no son whitelist
        if (data.adminsToDemote.length > 0) {
            for (let i = 0; i < data.adminsToDemote.length; i += 5) {
                const batch = data.adminsToDemote.slice(i, i + 5);
                await conn.groupParticipantsUpdate(m.chat, batch, 'demote');
                await new Promise(r => setTimeout(r, 2000)); // Delay para evitar saturación
            }
        }

        // PASO 2: Expulsar uno por uno con reporte
        let success = 0;
        for (const user of data.usersToKick) {
            try {
                await conn.groupParticipantsUpdate(m.chat, [user], 'remove');
                success++;
                await new Promise(r => setTimeout(r, 1200)); // Delay antiban
            } catch (e) {
                console.error(`Error al expulsar: ${user}`);
            }
        }

        await conn.reply(m.chat, `✅ *PROCESO FINALIZADO*\n\nSe han expulsado *${success}* usuarios del grupo con éxito.`, m);

    } else if (response === 'no') {
        clearTimeout(data.timeout);
        delete global.confirmationData[confirmationKey];
        await conn.reply(m.chat, '❌ Operación cancelada por el usuario.', m);
    }
};

handler.help = ['kickall'];
handler.tags = ['group'];
handler.command = /^(kickall|expulsartodos)$/i;

// Validaciones automáticas del framework
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;
