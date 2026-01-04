import db from '../lib/database.js';
import MessageType from '@whiskeysockets/baileys';

let impts = 0;

let handler = async (m, { conn, text }) => {
    let who;
    if (m.isGroup) {
        if (m.mentionedJid.length > 0) {
            who = m.mentionedJid[0];
        } else {
            const quoted = m.quoted ? m.quoted.sender : null;
            who = quoted ? quoted : m.chat;
        }
    } else {
        who = m.chat;
    }
    
    if (!who) return m.reply(`⚽🔵 Por favor, menciona al jugador o cita un mensaje en el campo de Blue Lock 🎯`);
    
    let txt = text.replace('@' + who.split`@`[0], '').trim();
    if (!txt) return m.reply(`⚽🔵 Por favor, ingresa la cantidad de puntos de ego que deseas añadir al jugador 🎯`);
    if (isNaN(txt)) return m.reply(`⚽🔵 Solo números son válidos en el sistema de Blue Lock 🔵`);
    
    let dmt = parseInt(txt);
    let coin = dmt;
    let pjk = Math.ceil(dmt * impts);
    coin += pjk;
    
    if (coin < 1) return m.reply(`⚽🔵 El mínimo es *1* punto de ego en Blue Lock 🎯`);
    
    let users = global.db.data.users;
    users[who].coin += dmt;
    
    m.reply(`⚽🎯 *Puntos de Ego Añadidos al Jugador:*
» ${dmt} ⚡\n@${who.split('@')[0]}, recibió ${dmt} puntos de ego para dominar el campo 🔵🔥`, null, { mentions: [who] });
};

handler.help = ['addcoins *<@user>*'];
handler.tags = ['owner'];
handler.command = ['añadircoin', 'addcoin', 'addcoins']; 
handler.rowner = true;

export default handler;