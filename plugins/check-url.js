import { AUDIO_URLS } from './download-audios.js';

let handler = async (m, { conn, text }) => {
    if (!text) {
        
        let listaUrls = '🔗 *URLs DE AUDIOS CONFIGURADAS:*\n\n';
        for (const [palabra, url] of Object.entries(AUDIO_URLS)) {
            listaUrls += `🔹 **${palabra}:** ${url}\n`;
        }
        listaUrls += '\n💡 Usa: `.checkurl depool` para verificar una URL específica';
        return conn.reply(m.chat, listaUrls, m);
    }
    
    const palabra = text.toLowerCase().trim();
    const url = AUDIO_URLS[palabra];
    
    if (!url) {
        return conn.reply(m.chat, `❌ No existe configuración para "${palabra}"`, m);
    }
    
    try {
        await conn.reply(m.chat, `🔍 Verificando URL para "${palabra}"...\n\n📎 **URL:** ${url}\n\n⏳ Enviando audio de prueba...`, m);
        
       
        await conn.sendMessage(m.chat, {
            audio: { url: url },
            mimetype: 'audio/mpeg',
            fileName: `test_${palabra}.mp3`
        }, { quoted: m });
        
        await conn.reply(m.chat, `✅ Audio como archivo normal enviado`, m);
        
        
        await conn.sendMessage(m.chat, {
            audio: { url: url },
            mimetype: 'audio/mpeg',
            ptt: true,
            fileName: `ptt_${palabra}.mp3`,
            seconds: 5
        }, { quoted: m });
        
        await conn.reply(m.chat, `✅ Audio como nota de voz enviado`, m);
        
    } catch (error) {
        console.error('Error verificando URL:', error);
        await conn.reply(m.chat, `❌ **Error verificando URL:**\n\n${error.message}\n\n🔧 **Posibles problemas:**\n• URL no válida\n• Archivo corrupto\n• Formato no compatible\n• Servidor no responde`, m);
    }
};

handler.help = ['checkurl'];
handler.tags = ['test'];
handler.command = ['checkurl', 'verificarurl'];

export default handler;