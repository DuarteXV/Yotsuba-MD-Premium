import { promises as fs } from 'fs';

const proposals = {};

let handler = async (m, { conn, command, usedPrefix }) => {
  try {
    switch (command) {
      case 'marry': {
        let sender = m.sender;
        let mentioned = m.mentionedJid;
        let target = mentioned && mentioned.length > 0 ? mentioned[0] : m.quoted ? m.quoted.sender : null;
        
        if (!target) {
          await conn.reply(m.chat, '❀ Debes mencionar a un usuario o responder a su mensaje para proponer matrimonio.\n> Ejemplo » #marry @usuario', m);
          return;
        }
        
        if (sender === target) {
          await m.reply('ꕥ No puedes proponerte matrimonio a ti mismo.');
          return;
        }
        
        let senderName = conn.getName(sender);
        let targetName = conn.getName(target);
        
        if (global.db.data.users[sender].marry) {
          const partnerId = global.db.data.users[sender].marry;
          const partnerName = conn.getName(partnerId);
          await conn.reply(m.chat, `ꕥ Ya estás casado/a con ${partnerName}.`, m);
          return;
        }
        
        if (global.db.data.users[target].marry) {
          const partnerId = global.db.data.users[target].marry;
          const partnerName = conn.getName(partnerId);
          await conn.reply(m.chat, `ꕥ ${targetName} ya está casado/a con ${partnerName}.`, m);
          return;
        }
        
        proposals[target] = {
          proposer: sender,
          timestamp: Date.now()
        };
        
        await conn.reply(m.chat, `♡ @${target.split('@')[0]}, ${senderName} te ha propuesto matrimonio, ¿aceptas?

⚘ Responde con:
> ● *aceptar* para confirmar el matrimonio.
> ● *rechazar* para declinar la propuesta.
> ● La propuesta expirará en 2 minutos.`, m, { mentions: [target] });
        
        setTimeout(() => {
          if (proposals[target]) delete proposals[target];
        }, 120000);
        
        break;
      }
      
      case 'divorce': {
        let sender = m.sender;
        
        if (!global.db.data.users[sender].marry) {
          await m.reply('✎ Tú no estás casado con nadie.');
          return;
        }
        
        let partnerId = global.db.data.users[sender].marry;
        let senderName = conn.getName(sender);
        let partnerName = conn.getName(partnerId);
        
        global.db.data.users[sender].marry = '';
        global.db.data.users[partnerId].marry = '';
        
        await conn.reply(m.chat, `ꕥ ${senderName} y ${partnerName} se han divorciado.`, m);
        break;
      }
    }
  } catch (error) {
    await m.reply(`⚠ Se ha producido un problema.\n> Usa ${usedPrefix}report para informarlo.\n\n${error.message}`);
  }
};

handler.before = async (m, { conn }) => {
  const proposal = proposals[m.sender];
  if (!proposal) return;
  
  const texto = m.text.trim().toLowerCase();
  if (texto !== 'aceptar' && texto !== 'rechazar') return;
  
  if (texto === 'aceptar') {
    const proposer = proposal.proposer;
    delete proposals[m.sender];
    
    if (global.db.data.users[m.sender].marry) {
      const partnerId = global.db.data.users[m.sender].marry;
      const partnerName = conn.getName(partnerId);
      return m.reply(`ꕥ Ya estás casado/a con ${partnerName}.`);
    }
    
    if (global.db.data.users[proposer].marry) {
      const partnerId = global.db.data.users[proposer].marry;
      const partnerName = conn.getName(partnerId);
      return m.reply(`ꕥ ${conn.getName(proposer)} ya está casado/a con ${partnerName}.`);
    }
    
    global.db.data.users[m.sender].marry = proposer;
    global.db.data.users[proposer].marry = m.sender;
    
    let senderName = conn.getName(m.sender);
    let proposerName = conn.getName(proposer);
    
    await conn.reply(m.chat, `✩.･:｡≻───── ⋆♡⋆ ─────.•:｡✩
¡Se han Casado! ฅ^•ﻌ•^ฅ*:･ﾟ✧

*•.¸♡ Esposo/a ${proposerName}. ♡¸.•
•.¸♡ Esposo/a ${senderName}. ♡¸.•*
\`Disfruten de su luna de miel\`
✩.･:｡≻───── ⋆♡⋆ ─────.•:｡✩`, m);
    
  } else if (texto === 'rechazar') {
    const proposer = proposal.proposer;
    delete proposals[m.sender];
    
    let senderName = conn.getName(m.sender);
    let proposerName = conn.getName(proposer);
    
    await conn.reply(m.chat, `💔 ${senderName} ha rechazado la propuesta de matrimonio de ${proposerName}.`, m);
  }
};

handler.help = ['marry', 'divorce'];
handler.tags = ['gacha'];
handler.command = ['marry', 'divorce'];
handler.group = true;

export default handler;