import fs from 'fs'
import path from 'path'
import https from 'https'
import http from 'http'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


const AUDIO_URLS = {
    'depool': 'https://files.catbox.moe/t6y50v.mp3',
    'buenos': 'https://files.catbox.moe/wzl18t.mp3',
    'buenas': 'https://files.catbox.moe/h9j2k8.mp3',
    'wow': 'https://files.catbox.moe/p4x6r2.mp3',
    'genial': 'https://files.catbox.moe/m8v3q1.mp3',
    'adios': 'https://files.catbox.moe/l6n4h3.mp3',
    'chao': 'https://files.catbox.moe/t2y8x9.mp3',
    'bye': 'https://files.catbox.moe/r5u1z7.mp3',
    'jaja': 'https://files.catbox.moe/f8d3c6.mp3',
    'lol': 'https://files.catbox.moe/g9e4b2.mp3',
    'xd': 'https://files.catbox.moe/j1k5v8.mp3',
    'triste': 'https://files.catbox.moe/n7m2s4.mp3',
    'feliz': 'https://files.catbox.moe/q8p3x6.mp3',
    'si': 'https://files.catbox.moe/c5f9h8.mp3',
    'no': 'https://files.catbox.moe/v2b6n3.mp3',
    'miku': 'https://files.catbox.moe/s8x1z5.mp3',
    'bot': 'https://files.catbox.moe/d6g9j4.mp3'
};


function downloadFile(url, filePath) {
    return new Promise((resolve, reject) => {
        const client = url.startsWith('https') ? https : http;
        
        console.log(`⬇️ Descargando: ${url}`);
        
        client.get(url, (response) => {
            if (response.statusCode === 200) {
                const file = fs.createWriteStream(filePath);
                response.pipe(file);
                
                file.on('finish', () => {
                    file.close();
                    console.log(`✅ Descargado: ${path.basename(filePath)}`);
                    resolve(filePath);
                });
                
                file.on('error', (err) => {
                    fs.unlink(filePath, () => {});
                    reject(err);
                });
            } else {
                reject(new Error(`Error ${response.statusCode}: ${response.statusMessage}`));
            }
        }).on('error', (err) => {
            reject(err);
        });
    });
}

let handler = async (m, { conn, text }) => {
    const audiosDir = path.join(process.cwd(), 'src', 'audios');
    
    
    if (!fs.existsSync(audiosDir)) {
        fs.mkdirSync(audiosDir, { recursive: true });
        console.log(`📁 Directorio creado: ${audiosDir}`);
    }
    
    if (text === 'all' || text === 'todos') {
        await conn.reply(m.chat, `🔄 *DESCARGANDO TODOS LOS AUDIOS*\n\n📦 Descargando ${Object.keys(AUDIO_URLS).length} archivos de audio...\n⏳ Esto puede tomar unos minutos.`, m);
        
        let descargados = 0;
        let errores = 0;
        
        for (const [palabra, url] of Object.entries(AUDIO_URLS)) {
            const fileName = `${palabra}.mp3`;
            const filePath = path.join(audiosDir, fileName);
            
            try {
                await downloadFile(url, filePath);
                descargados++;
                
                
                const stats = fs.statSync(filePath);
                if (stats.size < 1000) { 
                    console.log(`⚠️ Archivo muy pequeño, posiblemente corrupto: ${fileName}`);
                }
                
            } catch (error) {
                console.error(`❌ Error descargando ${palabra}:`, error.message);
                errores++;
            }
            
            
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        await conn.reply(m.chat, `📊 *DESCARGA COMPLETADA*\n\n✅ Descargados: ${descargados}\n❌ Errores: ${errores}\n\n📁 Ubicación: \`src/audios/\`\n\n💡 Usa \`listaudios\` para ver los archivos.`, m);
        
    } else if (text) {
        
        const palabra = text.toLowerCase().trim();
        const url = AUDIO_URLS[palabra];
        
        if (!url) {
            return conn.reply(m.chat, `❌ No existe URL para "${palabra}"\n\n📝 Palabras disponibles:\n${Object.keys(AUDIO_URLS).join(', ')}`, m);
        }
        
        const fileName = `${palabra}.mp3`;
        const filePath = path.join(audiosDir, fileName);
        
        try {
            await conn.reply(m.chat, `⬇️ Descargando audio para "${palabra}"...\n📎 URL: ${url}`, m);
            
            await downloadFile(url, filePath);
            
            const stats = fs.statSync(filePath);
            await conn.reply(m.chat, `✅ Audio descargado correctamente!\n\n📁 Archivo: \`${fileName}\`\n📊 Tamaño: ${(stats.size / 1024).toFixed(2)} KB\n📍 Ubicación: \`src/audios/${fileName}\``, m);
            
        } catch (error) {
            await conn.reply(m.chat, `❌ Error descargando "${palabra}":\n\n${error.message}`, m);
        }
        
    } else {
        
        const archivosExistentes = fs.existsSync(audiosDir) ? fs.readdirSync(audiosDir).filter(f => f.endsWith('.mp3')) : [];
        
        let helpText = `🎵 *GESTOR DE AUDIOS LOCALES*\n\n`;
        helpText += `📁 Directorio: \`src/audios/\`\n`;
        helpText += `📦 Archivos locales: ${archivosExistentes.length}\n\n`;
        helpText += `📋 *Comandos:*\n`;
        helpText += `• \`downloadaudios all\` - Descargar todos\n`;
        helpText += `• \`downloadaudios depool\` - Descargar uno específico\n`;
        helpText += `• \`listaudios\` - Ver archivos descargados\n\n`;
        helpText += `🔗 *URLs disponibles:*\n`;
        helpText += Object.keys(AUDIO_URLS).map(p => `🔹 ${p}`).join(', ');
        
        await conn.reply(m.chat, helpText, m);
    }
};

handler.help = ['downloadaudios'];
handler.tags = ['tools'];
handler.command = ['downloadaudios', 'descargaaudios'];

export default handler;
export { AUDIO_URLS };