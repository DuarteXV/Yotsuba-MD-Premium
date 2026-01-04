import { delay } from '@whiskeysockets/baileys';

const salasRuleta = {};

const handler = async (m, { conn }) => {
    const chatId = m.chat;
    const senderId = m.sender;

    if (salasRuleta[chatId]) 
        return conn.reply(m.chat, '⚽🔥 Ya hay un duelo Blue Lock activo en este grupo. Espera a que termine.', m);

    salasRuleta[chatId] = { jugadores: [senderId], estado: 'esperando' };

    await conn.sendMessage(m.chat, { 
        text: `⚽ *DUELO BLUE LOCK* 🔥\n\n@${senderId.split('@')[0]} inició un duelo de egos.\n> 🎯 Para aceptar el desafío responde con *acepto*\n> ⏰ Tiempo restante: 60 segundos...`, 
        mentions: [senderId] 
    }, { quoted: m });

    await delay(60000);
    if (salasRuleta[chatId] && salasRuleta[chatId].estado === 'esperando') {
        delete salasRuleta[chatId];
        await conn.sendMessage(m.chat, { text: '💀 Nadie tuvo el ego suficiente para aceptar el desafío. Duelo cancelado.' });
    }
};

handler.command = ['ruletamuerte', 'duelobluelock', 'dueloego'];
handler.botAdmin = true

export default handler;

handler.before = async (m, { conn }) => {
    const chatId = m.chat;
    const senderId = m.sender;
    const texto = m.text?.toLowerCase();

    if (!salasRuleta[chatId]) return

    if (texto === 'acepto' || texto === 'aceptar') {
        if (salasRuleta[chatId].jugadores.length >= 2) 
            return conn.reply(m.chat, '⚽ Ya hay dos depredadores en este duelo.', m);

        if (senderId === salasRuleta[chatId].jugadores[0])
            return conn.reply(m.chat, '🎯 No puedes aceptar tu propio desafío egoísta.', m);

        salasRuleta[chatId].jugadores.push(senderId);
        salasRuleta[chatId].estado = 'completa';

        await conn.sendMessage(m.chat, { 
            audio: { url: "https://qu.ax/iwAmy.mp3" }, 
            mimetype: "audio/mp4", 
            ptt: true 
        });

        await conn.sendMessage(m.chat, { 
            text: '⚽ *DUELO BLUE LOCK* 🔥\n\n💎 ¡El duelo está listo!\n\n> 🎯 Analizando potencial egoísta...' 
        });

        const loadingMessages = [
            "《 █▒▒▒▒▒▒▒▒▒▒▒》10%\n- Calculando visión directa...",
            "《 ████▒▒▒▒▒▒▒▒》30%\n- Evaluando hambre de victoria...",
            "《 ███████▒▒▒▒▒》50%\n- Meta-visión activada...",
            "《 ██████████▒▒》80%\n- ¡El perdedor será revelado!",
            "《 ████████████》100%\n- ¡Resultado definitivo!"
        ];

        let { key } = await conn.sendMessage(m.chat, { text: "🔥 ¡Activando análisis Blue Lock!" }, { quoted: m });

        for (let msg of loadingMessages) {
            await delay(3000);
            await conn.sendMessage(m.chat, { text: msg, edit: key }, { quoted: m });
        }

        const [jugador1, jugador2] = salasRuleta[chatId].jugadores;
        const perdedor = Math.random() < 0.5 ? jugador1 : jugador2;
        const ganador = perdedor === jugador1 ? jugador2 : jugador1;

        await conn.sendMessage(m.chat, { 
            text: `⚽ *VEREDICTO FINAL* 🏆\n\n@${perdedor.split('@')[0]} ha sido eliminado.\n@${ganador.split('@')[0]} demuestra su superioridad egoísta.\n\n> 💀 Tienes 60 segundos para tus últimas palabras...`, 
            mentions: [perdedor, ganador] 
        });

        await delay(60000);        
            await conn.groupParticipantsUpdate(m.chat, [perdedor], 'remove');
            await conn.sendMessage(m.chat, { 
                text: `💀 @${perdedor.split('@')[0]} ha sido expulsado de Blue Lock. Solo los más fuertes sobreviven.`, 
                mentions: [perdedor] 
            });        
        delete salasRuleta[chatId];
    }

    if (texto === 'rechazar' && senderId === salasRuleta[chatId].jugadores[0]) {
        delete salasRuleta[chatId];
        await conn.sendMessage(m.chat, { text: '🚫 El duelo ha sido cancelado. El ego no era suficiente.' });
    }
};