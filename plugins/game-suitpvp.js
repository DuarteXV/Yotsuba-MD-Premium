import { areJidsSameUser } from '@whiskeysockets/baileys'

const timeout = 60000;
const poin = 500;
const poin_lose = -100;

// Handler principal del comando
const handler = async (m, { conn, usedPrefix, command }) => {
    conn.suit = conn.suit || {};
    
    // Obtener usuario mencionado
    const userToChallenge = m.mentionedJid[0] || 
        (m.quoted && m.quoted.sender) || 
        (m.text.split(' ')[1] && m.text.split(' ')[1].replace(/[^0-9]/g, '') + '@s.whatsapp.net');

    // Verificar si el retador está en una partida
    const userInGame = Object.values(conn.suit).find(room => 
        room.id?.startsWith('suit') && 
        [room.p, room.p2].some(jid => areJidsSameUser(jid, m.sender))
    );
    
    if (userInGame) {
        return m.reply('🎮 Termina tu partida actual antes de iniciar otra.');
    }

    // Mensaje de ayuda
    if (!userToChallenge || areJidsSameUser(userToChallenge, m.sender)) {
        return m.reply(`🎮 *¿A QUIÉN QUIERES DESAFIAR?*\n\n*—◉ MENCIÓN:*\n${usedPrefix + command} @usuario\n\n*—◉ EJEMPLO:*\n${usedPrefix + command} @${m.sender.split('@')[0]}`);
    }

    // Verificar si el desafiado está en una partida
    const targetInGame = Object.values(conn.suit).find(room => 
        room.id?.startsWith('suit') && 
        [room.p, room.p2].some(jid => areJidsSameUser(jid, userToChallenge))
    );
    
    if (targetInGame) {
        return m.reply('🎮 El usuario está en una partida actualmente. Espera a que termine.');
    }

    // Verificar si el desafiado es el bot
    if (areJidsSameUser(userToChallenge, conn.user.jid)) {
        return m.reply('🤖 No puedes desafiar al bot, usa .suitbot para jugar contra mí.');
    }

    // Crear ID único para la sala
    const id = 'suit_' + new Date().getTime() + Math.random().toString(36).substr(2, 9);
    
    const caption = `🎮 *DESAFÍO PVP - PIEDRA, PAPEL O TIJERA* 🎮

👤 *RETADOR:* @${m.sender.split('@')[0]}
🎯 *DESAFIADO:* @${userToChallenge.split('@')[0]}

*—◉ INSTRUCCIONES:*
El usuario desafiado debe responder a este mensaje con:

✅ *"aceptar"* → Para aceptar el desafío
❌ *"rechazar"* → Para rechazar el desafío

⏰ *TIEMPO LIMITE:* ${timeout/1000} segundos

🏆 *RECOMPENSA:* ${poin} puntos
💔 *PENALIZACIÓN:* ${Math.abs(poin_lose)} puntos`;

    // Enviar mensaje del desafío
    const challengeMsg = await conn.sendMessage(
        m.chat, 
        {
            text: caption,
            mentions: [m.sender, userToChallenge],
            contextInfo: {
                mentionedJid: [m.sender, userToChallenge]
            }
        }, 
        { quoted: m }
    );

    // Crear sala de juego
    conn.suit[id] = {
        id: id,
        p: m.sender,           // Retador
        p2: userToChallenge,   // Desafiado
        status: 'wait',        // Estado: esperando respuesta
        chatId: m.chat,        // ID del chat
        msgId: challengeMsg.key.id, // ID del mensaje
        waktu: setTimeout(() => {
            // Tiempo agotado
            if (conn.suit[id]) {
                const timeoutMsg = `⏰ *TIEMPO AGOTADO*\n\nEl desafío de @${m.sender.split('@')[0]} a @${userToChallenge.split('@')[0]} ha sido cancelado por falta de respuesta.`;
                conn.sendMessage(m.chat, { 
                    text: timeoutMsg, 
                    mentions: [m.sender, userToChallenge] 
                }, { quoted: challengeMsg });
                delete conn.suit[id];
            }
        }, timeout),
        poin: poin,
        poin_lose: poin_lose,
        timeout: timeout,
        choiceP1: null,
        choiceP2: null,
        startTime: Date.now()
    };
    
    // Reacción para confirmar
    await m.react('🎮');
};

// Función para procesar respuestas del PVP
const procesarSuitRespuesta = async (m, conn) => {
    conn.suit = conn.suit || {};
    
    const text = m.text?.toLowerCase()?.trim();
    
    // 1. Buscar sala donde el usuario es el desafiado (p2)
    const roomWait = Object.values(conn.suit).find(room => 
        room.id?.startsWith('suit') && 
        room.status === 'wait' && 
        areJidsSameUser(room.p2, m.sender) &&
        m.quoted?.id === room.msgId
    );
    
    // 2. Buscar sala donde el usuario está jugando
    const roomPlay = Object.values(conn.suit).find(room => 
        room.id?.startsWith('suit') && 
        room.status === 'play' && 
        [room.p, room.p2].some(jid => areJidsSameUser(jid, m.sender))
    );

    // Procesar ACEPTAR o RECHAZAR
    if ((text === 'aceptar' || text === 'rechazar') && roomWait) {
        clearTimeout(roomWait.waktu);
        
        if (text === 'aceptar') {
            roomWait.status = 'play';
            
            const startMsg = `🎮 *¡DESAFÍO ACEPTADO!* 🎮

👤 @${roomWait.p.split('@')[0]} 🆚 @${roomWait.p2.split('@')[0]}

*—◉ ELIGE UNA OPCIÓN:*
• 🪨 "piedra"
• 📄 "papel"  
• ✂️ "tijera"

*—◉ EJEMPLOS:*
» piedra
» papel
» tijera

⏰ *TIEMPO:* ${roomWait.timeout/1000} segundos

🏆 *PREMIOS:*
✅ Ganador: +${roomWait.poin} puntos
❌ Perdedor: ${roomWait.poin_lose} puntos
🤝 Empate: +${Math.floor(roomWait.poin/2)} puntos cada uno`;
            
            await conn.sendMessage(m.chat, {
                text: startMsg,
                mentions: [roomWait.p, roomWait.p2]
            }, { quoted: m });
            
            // Nuevo temporizador para las elecciones
            roomWait.waktu = setTimeout(async () => {
                if (conn.suit[roomWait.id]) {
                    let timeoutResult = `⏰ *TIEMPO AGOTADO*\n\n`;
                    
                    if (roomWait.choiceP1 && !roomWait.choiceP2) {
                        timeoutResult += `@${roomWait.p.split('@')[0]} eligió pero @${roomWait.p2.split('@')[0]} no respondió.\n`;
                        timeoutResult += `🏆 @${roomWait.p.split('@')[0]} gana por default: +${roomWait.poin} puntos`;
                        
                        // Dar puntos al jugador 1
                        if (global.db?.data?.users?.[roomWait.p]) {
                            global.db.data.users[roomWait.p].coin = (global.db.data.users[roomWait.p].coin || 0) + roomWait.poin;
                        }
                    } else if (!roomWait.choiceP1 && roomWait.choiceP2) {
                        timeoutResult += `@${roomWait.p2.split('@')[0]} eligió pero @${roomWait.p.split('@')[0]} no respondió.\n`;
                        timeoutResult += `🏆 @${roomWait.p2.split('@')[0]} gana por default: +${roomWait.poin} puntos`;
                        
                        // Dar puntos al jugador 2
                        if (global.db?.data?.users?.[roomWait.p2]) {
                            global.db.data.users[roomWait.p2].coin = (global.db.data.users[roomWait.p2].coin || 0) + roomWait.poin;
                        }
                    } else {
                        timeoutResult += `Ninguno de los dos jugadores eligió.\n`;
                        timeoutResult += `❌ Partida cancelada.`;
                    }
                    
                    await conn.sendMessage(m.chat, {
                        text: timeoutResult,
                        mentions: [roomWait.p, roomWait.p2]
                    }, { quoted: m });
                    
                    delete conn.suit[roomWait.id];
                }
            }, roomWait.timeout);
            
        } else if (text === 'rechazar') {
            const rejectMsg = `❌ *DESAFÍO RECHAZADO*\n\n@${roomWait.p2.split('@')[0]} rechazó el desafío de @${roomWait.p.split('@')[0]}`;
            
            await conn.sendMessage(m.chat, {
                text: rejectMsg,
                mentions: [roomWait.p, roomWait.p2]
            }, { quoted: m });
            
            delete conn.suit[roomWait.id];
        }
        
        // Reacción según respuesta
        await m.react(text === 'aceptar' ? '✅' : '❌');
        return true;
    }
    
    // Procesar ELECCIONES (piedra, papel, tijera)
    const opcionesValidas = ['piedra', 'papel', 'tijera'];
    if (opcionesValidas.includes(text) && roomPlay) {
        const emojis = {
            'piedra': '🪨',
            'papel': '📄',
            'tijera': '✂️'
        };
        
        // Asignar elección
        if (areJidsSameUser(m.sender, roomPlay.p) && !roomPlay.choiceP1) {
            roomPlay.choiceP1 = text;
            await conn.sendMessage(m.chat, {
                text: `✅ @${roomPlay.p.split('@')[0]} eligió: ${emojis[text]} ${text}`,
                mentions: [roomPlay.p]
            }, { quoted: m });
            
        } else if (areJidsSameUser(m.sender, roomPlay.p2) && !roomPlay.choiceP2) {
            roomPlay.choiceP2 = text;
            await conn.sendMessage(m.chat, {
                text: `✅ @${roomPlay.p2.split('@')[0]} eligió: ${emojis[text]} ${text}`,
                mentions: [roomPlay.p2]
            }, { quoted: m });
            
        } else {
            // Usuario ya eligió
            return false;
        }
        
        // Reacción de elección
        await m.react(emojis[text]);
        
        // Verificar si ambos han elegido
        if (roomPlay.choiceP1 && roomPlay.choiceP2) {
            clearTimeout(roomPlay.waktu);
            
            // Determinar ganador
            const resultado = determinarGanador(roomPlay.choiceP1, roomPlay.choiceP2);
            
            let mensajeResultado = `🎮 *RESULTADO FINAL* 🎮\n\n`;
            mensajeResultado += `${emojis[roomPlay.choiceP1]} @${roomPlay.p.split('@')[0]}: *${roomPlay.choiceP1}*\n`;
            mensajeResultado += `${emojis[roomPlay.choiceP2]} @${roomPlay.p2.split('@')[0]}: *${roomPlay.choiceP2}*\n\n`;
            
            // Sistema de puntos
            if (global.db?.data?.users) {
                const user1 = global.db.data.users[roomPlay.p];
                const user2 = global.db.data.users[roomPlay.p2];
                
                if (resultado === 'empate') {
                    const puntosEmpate = Math.floor(roomPlay.poin / 2);
                    mensajeResultado += `⚖️ *¡EMPATE!*\n`;
                    mensajeResultado += `Ambos ganan ${puntosEmpate} puntos\n\n`;
                    mensajeResultado += `💰 @${roomPlay.p.split('@')[0]}: +${puntosEmpate} puntos\n`;
                    mensajeResultado += `💰 @${roomPlay.p2.split('@')[0]}: +${puntosEmpate} puntos`;
                    
                    if (user1) user1.coin = (user1.coin || 0) + puntosEmpate;
                    if (user2) user2.coin = (user2.coin || 0) + puntosEmpate;
                    
                } else if (resultado === 'p1') {
                    mensajeResultado += `🏆 *¡GANADOR!* @${roomPlay.p.split('@')[0]}\n\n`;
                    mensajeResultado += `💰 Ganador: +${roomPlay.poin} puntos\n`;
                    mensajeResultado += `💔 Perdedor: ${roomPlay.poin_lose} puntos\n\n`;
                    mensajeResultado += `🎯 Puntuación final:\n`;
                    mensajeResultado += `• @${roomPlay.p.split('@')[0]}: ${(user1?.coin || 0) + roomPlay.poin} puntos\n`;
                    mensajeResultado += `• @${roomPlay.p2.split('@')[0]}: ${(user2?.coin || 0) + roomPlay.poin_lose} puntos`;
                    
                    if (user1) user1.coin = (user1.coin || 0) + roomPlay.poin;
                    if (user2) user2.coin = (user2.coin || 0) + roomPlay.poin_lose;
                    
                } else {
                    mensajeResultado += `🏆 *¡GANADOR!* @${roomPlay.p2.split('@')[0]}\n\n`;
                    mensajeResultado += `💰 Ganador: +${roomPlay.poin} puntos\n`;
                    mensajeResultado += `💔 Perdedor: ${roomPlay.poin_lose} puntos\n\n`;
                    mensajeResultado += `🎯 Puntuación final:\n`;
                    mensajeResultado += `• @${roomPlay.p2.split('@')[0]}: ${(user2?.coin || 0) + roomPlay.poin} puntos\n`;
                    mensajeResultado += `• @${roomPlay.p.split('@')[0]}: ${(user1?.coin || 0) + roomPlay.poin_lose} puntos`;
                    
                    if (user2) user2.coin = (user2.coin || 0) + roomPlay.poin;
                    if (user1) user1.coin = (user1.coin || 0) + roomPlay.poin_lose;
                }
            }
            
            // Enviar resultado con efectos visuales
            await conn.sendMessage(m.chat, {
                text: mensajeResultado,
                mentions: [roomPlay.p, roomPlay.p2]
            }, { quoted: m });
            
            // Reacción final
            await m.react(resultado === 'empate' ? '⚖️' : '🏆');
            
            // Eliminar la sala
            delete conn.suit[roomPlay.id];
        }
        
        return true;
    }
    
    return false;
};

// Función auxiliar para determinar ganador
function determinarGanador(jugador1, jugador2) {
    if (jugador1 === jugador2) return 'empate';
    
    const reglas = {
        'piedra': 'tijera',
        'papel': 'piedra', 
        'tijera': 'papel'
    };
    
    return reglas[jugador1] === jugador2 ? 'p1' : 'p2';
}

// Exportar ambas funciones
handler.procesarSuitRespuesta = procesarSuitRespuesta;
handler.determinarGanador = determinarGanador;

// Configuración del comando
handler.help = ['suit @usuario', 'pvp @usuario'];
handler.tags = ['game', 'rpg'];
handler.command = /^(suitpvp|pvp|suit)$/i;
handler.group = true;
handler.game = true;
handler.registrar = true;

export default handler;