import axios from 'axios';
import fetch from 'node-fetch';

const handler = async (m, { conn, text, usedPrefix, command, args }) => {
    if (!args || !args[0]) {
        return conn.reply(m.chat, `⚽️ Por favor, ingresa un enlace de Twitter/X.\n\n📝 *Ejemplo:* ${usedPrefix}${command} https://twitter.com/usuario/status/1234567890`, m, global.rcanal);
    }

    
    const twitterUrl = validateTwitterUrl(args[0]);
    if (!twitterUrl) {
        return conn.reply(m.chat, `❌ URL de Twitter/X inválida. Por favor verifica el enlace.\n\n✅ *URLs válidas:*\n• https://twitter.com/usuario/status/...\n• https://x.com/usuario/status/...\n• https://mobile.twitter.com/...`, m, global.rcanal);
    }

    try {
        await conn.reply(m.chat, `🔄 Descargando contenido de Twitter/X... Por favor espera.`, m, global.rcanal);

        
        const result = await downloadFromMultipleAPIs(twitterUrl);
        
        if (!result) {
            return conn.reply(m.chat, `❌ No se pudo descargar el contenido. El tweet podría ser privado, eliminado o no contener media.`, m, global.rcanal);
        }

        const { type, media, caption, author } = result;
        
        if (type === 'video' && media && media.length > 0) {
            const videoCaption = `✅ *Video de Twitter/X descargado*\n\n👤 *Autor:* ${author || 'Desconocido'}\n📝 *Contenido:* ${caption || 'Sin descripción'}\n\n⚽️ *Descargado por Isagi Yoichi Bot*`;

            for (const video of media) {
                if (video.url) {
                    await conn.sendMessage(m.chat, {
                        document: { url: video.url },
                        mimetype: 'video/mp4',
                        fileName: 'twitter.mp4',
                        caption: videoCaption
                    }, { quoted: m });
                }
            }
        } else if (type === 'image' && media && media.length > 0) {
            const imageCaption = `✅ *Imagen(es) de Twitter/X descargada(s)*\n\n👤 *Autor:* ${author || 'Desconocido'}\n📝 *Contenido:* ${caption || 'Sin descripción'}\n\n⚽️ *Descargado por Isagi Yoichi Bot*`;

            for (const image of media) {
                if (image.url) {
                    await conn.sendMessage(m.chat, {
                        document: { url: image.url },
                        mimetype: 'image/jpeg',
                        fileName: 'twitter.jpg',
                        caption: imageCaption
                    }, { quoted: m });
                }
            }
        } else {
            return conn.reply(m.chat, `❌ No se encontró contenido multimedia en este tweet.`, m, global.rcanal);
        }

    } catch (error) {
        console.error('Error en Twitter download:', error);
        return conn.reply(m.chat, `❌ Error al procesar la descarga: ${error.message}\n\n💡 *Consejos:*\n• Verifica que el tweet sea público\n• Asegúrate de que contenga imágenes o videos\n• El tweet podría estar restringido por región`, m, global.rcanal);
    }
};

handler.help = ['twitter <url>'];
handler.tags = ['dl'];
handler.command = ['x', 'xdl', 'dlx', 'twdl', 'tw', 'twt', 'twitter'];
handler.group = true;
handler.register = true;
handler.coin = 2;

export default handler;


function validateTwitterUrl(url) {
    try {
        
        url = url.trim().replace(/[^\x00-\x7F]/g, "");
        
        
        const patterns = [
            /(?:https?:\/\/)?(?:www\.)?twitter\.com\/([^\/]+)\/status\/(\d+)/,
            /(?:https?:\/\/)?(?:www\.)?x\.com\/([^\/]+)\/status\/(\d+)/,
            /(?:https?:\/\/)?mobile\.twitter\.com\/([^\/]+)\/status\/(\d+)/,
            /(?:https?:\/\/)?(?:www\.)?twitter\.com\/i\/web\/status\/(\d+)/,
            /(?:https?:\/\/)?(?:www\.)?x\.com\/i\/web\/status\/(\d+)/,
            /(?:https?:\/\/)?t\.co\/([A-Za-z0-9]+)/
        ];
        
        
        for (const pattern of patterns) {
            if (pattern.test(url)) {
                
                if (!url.startsWith('http://') && !url.startsWith('https://')) {
                    url = 'https://' + url;
                }
                return url;
            }
        }
        
        return null;
    } catch (error) {
        console.error('Error validating Twitter URL:', error);
        return null;
    }
}


async function downloadFromMultipleAPIs(url) {
    const apis = [
        {
            name: 'Delirius',
            func: () => twitterDelirius(url)
        },
        {
            name: 'SaveTweet',
            func: () => twitterSaveTweet(url)
        },
        {
            name: 'SnapTik',
            func: () => twitterSnapTik(url)
        },
        {
            name: 'TwDown',
            func: () => twitterTwDown(url)
        },
        {
            name: 'TwitterDL',
            func: () => twitterDL(url)
        }
    ];
    
    for (const api of apis) {
        try {
            console.log(`🔍 Intentando Twitter con ${api.name}...`);
            const result = await api.func();
            
            if (result && (result.media && result.media.length > 0)) {
                console.log(`✅ ${api.name} exitoso`);
                return result;
            }
        } catch (error) {
            console.log(`❌ ${api.name} falló: ${error.message}`);
            continue;
        }
    }
    
    return null;
}


async function twitterDelirius(url) {
    try {
        const apiUrl = `https://delirius-apiofc.vercel.app/download/twitterdl?url=${encodeURIComponent(url)}`;
        
        const response = await axios.get(apiUrl, {
            timeout: 15000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        
        const data = response.data;
        
        if (data && data.media && data.media.length > 0) {
            return {
                type: data.type,
                media: data.media,
                caption: data.caption || 'Sin descripción',
                author: data.author || 'Desconocido'
            };
        }
        
        throw new Error('No media data found');
    } catch (error) {
        throw new Error(`Delirius API error: ${error.message}`);
    }
}


async function twitterSaveTweet(url) {
    try {
        const apiUrl = `https://api.savetweet.xyz/v2/tweet?url=${encodeURIComponent(url)}`;
        
        const response = await fetch(apiUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 15000
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success && data.data) {
            const media = [];
            
            
            if (data.data.videos && data.data.videos.length > 0) {
                data.data.videos.forEach(video => {
                    media.push({ url: video.url, type: 'video' });
                });
                
                return {
                    type: 'video',
                    media: media,
                    caption: data.data.text || 'Sin descripción',
                    author: data.data.user?.name || 'Desconocido'
                };
            }
            
            
            if (data.data.photos && data.data.photos.length > 0) {
                data.data.photos.forEach(photo => {
                    media.push({ url: photo.url, type: 'image' });
                });
                
                return {
                    type: 'image',
                    media: media,
                    caption: data.data.text || 'Sin descripción',
                    author: data.data.user?.name || 'Desconocido'
                };
            }
        }
        
        throw new Error('No media data found');
    } catch (error) {
        throw new Error(`SaveTweet API error: ${error.message}`);
    }
}


async function twitterSnapTik(url) {
    try {
        const apiUrl = `https://snaptik.app/api/twitter/download?url=${encodeURIComponent(url)}`;
        
        const response = await fetch(apiUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 15000
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.status === 'success' && data.result) {
            const media = [];
            
            if (data.result.media) {
                data.result.media.forEach(item => {
                    media.push({ 
                        url: item.url, 
                        type: item.type === 'video' ? 'video' : 'image' 
                    });
                });
            }
            
            if (media.length > 0) {
                return {
                    type: media[0].type,
                    media: media,
                    caption: data.result.text || 'Sin descripción',
                    author: data.result.author || 'Desconocido'
                };
            }
        }
        
        throw new Error('No media data found');
    } catch (error) {
        throw new Error(`SnapTik API error: ${error.message}`);
    }
}


async function twitterTwDown(url) {
    try {
        const apiUrl = `https://twdown.net/api/download`;
        
        const formData = new URLSearchParams();
        formData.append('url', url);
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formData.toString(),
            timeout: 15000
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success && data.data) {
            const media = [];
            
            if (data.data.video) {
                media.push({ url: data.data.video, type: 'video' });
                
                return {
                    type: 'video',
                    media: media,
                    caption: data.data.text || 'Sin descripción',
                    author: data.data.author || 'Desconocido'
                };
            }
            
            if (data.data.images && data.data.images.length > 0) {
                data.data.images.forEach(img => {
                    media.push({ url: img, type: 'image' });
                });
                
                return {
                    type: 'image',
                    media: media,
                    caption: data.data.text || 'Sin descripción',
                    author: data.data.author || 'Desconocido'
                };
            }
        }
        
        throw new Error('No media data found');
    } catch (error) {
        throw new Error(`TwDown API error: ${error.message}`);
    }
}


async function twitterDL(url) {
    try {
        const apiUrl = `https://api.twitterdl.net/v1/tweet?url=${encodeURIComponent(url)}`;
        
        const response = await fetch(apiUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'application/json'
            },
            timeout: 15000
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.status === 'success' && data.tweet) {
            const media = [];
            
            
            if (data.tweet.videos && data.tweet.videos.length > 0) {
                data.tweet.videos.forEach(video => {
                    if (video.variants && video.variants.length > 0) {
                        
                        const bestQuality = video.variants.reduce((prev, current) => {
                            return (current.bitrate > prev.bitrate) ? current : prev;
                        });
                        media.push({ url: bestQuality.url, type: 'video' });
                    }
                });
                
                if (media.length > 0) {
                    return {
                        type: 'video',
                        media: media,
                        caption: data.tweet.text || 'Sin descripción',
                        author: data.tweet.user?.name || 'Desconocido'
                    };
                }
            }
            
            
            if (data.tweet.photos && data.tweet.photos.length > 0) {
                data.tweet.photos.forEach(photo => {
                    media.push({ url: photo.url, type: 'image' });
                });
                
                return {
                    type: 'image',
                    media: media,
                    caption: data.tweet.text || 'Sin descripción',
                    author: data.tweet.user?.name || 'Desconocido'
                };
            }
        }
        
        throw new Error('No media data found');
    } catch (error) {
        throw new Error(`TwitterDL API error: ${error.message}`);
    }
}

