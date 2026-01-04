/* ⚽🏃‍♂️ Github Search by Brauliovh3
- Blue Lock Football Experience  
- https://github.com/Brauliovh3/HATSUNE-MIKU
*/

import fetch from 'node-fetch';

let handler = async(m, { conn, text, usedPrefix, command }) => {

if (!text) return conn.reply(m.chat, `⚽ Por favor ingresa el nombre de un repositorio GitHub para buscar en la estrategia de juego 🏃‍♂️`, m, global.rcanal);

try {
let api = `https://dark-core-api.vercel.app/api/search/github?key=api&text=${text}`;

let response = await fetch(api);
let json = await response.json();
let result = json.results[0];

let txt = `⚽ *Repositorio de Estrategia:* ${result.name}\n👑 *Creador:* ${result.creator}\n🌟 *Estrellas del Equipo:* ${result.stars}\n🔖 *Bifurcaciones Tácticas:* ${result.forks}\n📜 *Descripción del Juego:* ${result.description}\n📆 *Creado en el Campo:* ${result.createdAt}\n🔗 *Link de la Jugada:* ${result.cloneUrl}`;

let img = 'https://raw.githubusercontent.com/Brauliovh3/HATSUNE-MIKU/main/Contenido/1745610598914.jpeg';

conn.sendMessage(m.chat, { image: { url: img }, caption: txt }, { quoted: fkontak });

} catch (error) {
console.error(error)
m.reply(`⚽ ¡Error en la jugada! Error en la búsqueda: ${error.message} 🔥`);
m.react('⚽');
 }
};

handler.command = ['githubsearch', 'gbsearch'];

export default handler;