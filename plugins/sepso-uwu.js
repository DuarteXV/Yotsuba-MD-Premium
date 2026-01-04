let handler = m => m
handler.all = async function (m) {
  for (const message in audioMsg) {
    if (new RegExp(`^${message}$`, 'i').test(m.text)) {
      this.sendFile(m.chat, audioMsg[message], 'audio.mp3', null, m, true)
      break
    }
  }
  return !0
 }

export default handler


let audioMsg = {
  'fino señores': './src/mp3/fino.mp3',
  'buenos días': 'https://k.top4top.io/m_2826iqdri1.mp3',
  'buenas tardes': 'https://b.top4top.io/m_2826v2zg51.mp3',
  'buenas noches': 'https://i.top4top.io/m_2826o8rfj1.mp3',
  'sad': 'https://h.top4top.io/m_2826mcim21.mp3',
  '@5491168352204|@59172945992': 'https://l.top4top.io/m_2492i4mdu1.mp3',
'me vale':
'https://files.catbox.moe/3xodgw',
'perdón':
'https://sndup.net/64cvt/a',
'orgulloso':
'https://files.catbox.moe/4qv74p.mp3',
'Kevin de bruyne':
'https://files.catbox.moe/0uhxxc.mp3',
'princesa':
'https://files.catbox.moe/ej6yxs.mp3',
'brutal':
'https://files.catbox.moe/ou3a3c.mp3',
'negra':
'https://files.catbox.moe/ruaw1w.mp3',
'tarde':
'https://files.catbox.moe/1gceio.mp3',
'chi':
'https://files.catbox.moe/apwcdg.mp3',
'mierda':
'https://files.catbox.moe/fdmpnn.mp3',
'hola grupo':
'https://files.catbox.moe/11l1x8.mp3',
'XD':
'https://files.catbox.moe/coj3eq.mp3',
'amarillo':
'https://files.catbox.moe/moe8mk.mp3',
'se me olvidó':
'https://files.catbox.moe/soqudv.mp3',
'JAJAJA':
'https://files.catbox.moe/2qtkaq.mp3',
'puta':
'https://files.catbox.moe/6rkkxg.mp3',
'tengo los calzones del admin':
'https://files.catbox.moe/9yk6we.mp3'
}