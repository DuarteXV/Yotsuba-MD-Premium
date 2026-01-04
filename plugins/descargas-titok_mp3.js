import fetch from 'node-fetch';

let handler = async (m, { conn, text }) => {
  if (!text) throw m.reply('❀ Por favor, ingresa un enlace de TikTok válido.');

  conn.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });

  const fkontak = {
    key: {
      fromMe: false,
      participant: m.sender,
      ...(m.chat ? { remoteJid: m.chat } : {})
    },
    message: {
      contactMessage: {
        displayName: await conn.getName(m.sender),
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${await conn.getName(m.sender)}\nFN:${await conn.getName(m.sender)}\nTEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nEND:VCARD`
      }
    }
  };

  try {
    const res = await fetch(`https://rest.alyabotpe.xyz/dl/tiktokmp3?url=${encodeURIComponent(text)}&key=stellar-t1opU0P4`);
    const json = await res.json();

    if (!json.status || !json.data || !json.data.dl) {
      throw json.message || '✧ No se pudo obtener el audio.';
    }

    const { id, title, duration, region, dl, created_at, author, music_info, stats } = json.data;

    const caption = `
ᯓ★ 𝐓𝐢𝐤𝐓𝐨𝐤 𝐌𝐏𝟑 ☪︎

˗ˏˋ✄────────────────────

⤿ ✦ 𝐈𝐃: *${id || 'Desconocido'}*
⤿ ᥫ᭡ 𝐓𝐢́𝐭𝐮𝐥𝐨: *${title || 'Desconocido'}*
⤿ ⏳ 𝐃𝐮𝐫𝐚𝐜𝐢𝐨́𝐧: *${duration || '00:00'}*
⤿ ☁︎ 𝐑𝐞𝐠𝐢𝐨́𝐧: *${region || 'Desconocida'}*
⤿ ❀ 𝐏𝐮𝐛𝐥𝐢𝐜𝐚𝐝𝐨: *${created_at || 'Desconocido'}*

⤿ ❍ 𝐀𝐮𝐭𝐨𝐫: *${author?.nickname || 'Desconocido'}*
⤿ ✧ 𝐔𝐬𝐮𝐚𝐫𝐢𝐨: *${author?.unique_id || 'N/A'}*

⤿ ♪ 𝐌𝐮́𝐬𝐢𝐜𝐚: *${music_info?.title || 'Audio original'}*
⤿ ♫ 𝐀𝐫𝐭𝐢𝐬𝐭𝐚: *${music_info?.author || 'Desconocido'}*

⤿ ➻ 𝐑𝐞𝐩𝐫𝐨𝐝𝐮𝐜𝐜𝐢𝐨𝐧𝐞𝐬: *${stats?.plays?.toLocaleString() || '0'}*
⤿ ♡ 𝐋𝐢𝐤𝐞𝐬: *${stats?.likes?.toLocaleString() || '0'}*
⤿ ✎ 𝐂𝐨𝐦𝐞𝐧𝐭𝐚𝐫𝐢𝐨𝐬: *${stats?.comments?.toLocaleString() || '0'}*
⤿ ➳ 𝐂𝐨𝐦𝐩𝐚𝐫𝐭𝐢𝐝𝐨𝐬: *${stats?.shares?.toLocaleString() || '0'}*
⤿ ⬇ 𝐃𝐞𝐬𝐜𝐚𝐫𝐠𝐚𝐬: *${stats?.downloads?.toLocaleString() || '0'}*

⤿ ➻ 𝐄𝐧𝐥𝐚𝐜𝐞: ${text}
`.trim();


    await conn.sendMessage(m.chat, { text: caption }, { quoted: fkontak });


    await conn.sendMessage(m.chat, {
      audio: { url: dl },
      mimetype: 'audio/mp4',
      fileName: `${title || 'audio'}.mp3`,
      ptt: false
    }, { quoted: m });

    conn.sendMessage(m.chat, { react: { text: '❀', key: m.key } });

  } catch (e) {
    console.error(e);
    conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    m.reply(`❀ Error: ${e}`);
  }
};

handler.help = ['tiktokmp3 *<url>*'];
handler.tags = ['dl'];
handler.command = ['tiktokmp3', 'ttmp3'];
handler.group = true;
handler.register = true;
handler.coin = 2;

export default handler;