import fetch from 'node-fetch';

let handler = async (m, { text }) => {
  if (!text) {
    m.reply(`⚽ Por favor, proporciona el término de búsqueda que deseas que busque en la estrategia de juego 🔥`, m, global.rcanal);
    return;
  }

  const apiUrl = `https://delirius-apiofc.vercel.app/search/googlesearch?query=${encodeURIComponent(text)}`;

  try {
    const response = await fetch(apiUrl);
    const result = await response.json();

    if (!result.status) {
      m.reply('🏃‍♂️ Error al realizar la búsqueda en el campo de entrenamiento 🔥', m, global.rcanal);
      return;
    }

    let replyMessage = `⚽ Resultados de búsqueda estratégica:\n\n`;
    result.data.slice(0, 1).forEach((item, index) => {
      replyMessage += `🌟 *${index + 1}. ${item.title}*\n`;
      replyMessage += `🔵 *${item.description}*\n`;
      replyMessage += `🌐 Enlace de la Jugada: ${item.url}`;
    });

m.react('⚽')

    m.reply(replyMessage);
  } catch (error) {
    console.error(`⚽ Error al realizar la solicitud a la API:`, error , m, global.rcanal);
    m.reply(`⚽ ¡Error en la jugada! Ocurrió un error al obtener los resultados de la estrategia 🔥`, m, global.rcanal);
  }
};

handler.command = ['google'];

export default handler;