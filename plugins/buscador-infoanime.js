import fetch from 'node-fetch'

var handler = async (m, { conn, usedPrefix, command, text }) => {

if (!text) return conn.reply(m.chat, `${emoji} Ingrese el nombre de algún anime\n\n> Ejemplo, ${usedPrefix + command} Blue Lock`, m, global.rcanal)
let res = await fetch('https://api.jikan.moe/v4/manga?q=' + text)
if (!res.ok) return conn.reply(m.chat, `${msm} Ocurrió un fallo en la jugada.`, m, global.rcanal)

let json = await res.json()
let { chapters, title_japanese, url, type, score, members, background, status, volumes, synopsis, favorites } = json.data[0]
let author = json.data[0].authors[0].name
let animeingfo = `⚽ Título: ${title_japanese}
🎞️ Capítulos: ${chapters}
💫 Tipo: ${type}
🗂 Estado: ${status}
🗃 Volúmenes: ${volumes}
🌟 Favoritos: ${favorites}
🧮 Puntaje: ${score}
👥 Miembros: ${members}
🔗 Enlace: ${url}
👨‍🔬 Autor: ${author}
📝 Contexto: ${background}
💬 Sinopsis: ${synopsis}
 ` 
conn.sendFile(m.chat, json.data[0].images.jpg.image_url, 'anime.jpg', '⚽ *I N F O - A N I M E* ⚽\n\n' + animeingfo, fkontak, m)

} 
handler.help = ['infoanime'] 
handler.tags = ['anime'] 
handler.group = true;
handler.register = true
handler.command = ['infoanime','animeinfo'] 

export default handler