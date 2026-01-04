import fs from 'fs';

let handler = async (m, { text, usedPrefix, command }) => {
    if (!text) {
        return m.reply(`⚽🔵 Por favor, ingresa el nombre de la táctica que quieres guardar 🎯`);
    }

    if (!m.quoted || !m.quoted.text) {
        return m.reply(`🎯⚡ Responde al mensaje con el contenido de la táctica para guardarla 🔵`);
    }

    const ruta = `plugins/${text}.js`;
    
    try {
        await fs.writeFileSync(ruta, m.quoted.text);
        m.reply(`⚽🎯 ¡Táctica guardada! Archivo: ${ruta} 🔥`);
    } catch (error) {
        m.reply(`🔵❌ ¡Error al guardar la táctica! ${error.message} ⚽`);
    }
};

handler.help = ['saveplugin'];
handler.tags = ['owner'];
handler.command = ["saveplugin"];
handler.owner = true;

export default handler;