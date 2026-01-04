import axios from 'axios'

let handler = async (m, { text }) => {
    const emoji = '🔍'
    const emoji2 = '❌'

    if (!text) 
        return await conn.sendMessage(m.chat, { text: `${emoji} Ingresa lo que quieres buscar en Wikipedia.` }, { quoted: m })

    try {
        const { data } = await axios.get('https://api-adonix.ultraplus.click/search/wikipedia', {
            params: {
                apikey: 'DuarteXVKey34',
                q: text,
                limit: 23
            }
        })

        if (!data.result || data.result.length === 0) 
            return await conn.sendMessage(m.chat, { text: `${emoji2} No se encontraron resultados.` }, { quoted: m })

        let reply = `🔰 *Wikipedia* - Resultados para: "${text}"\n\n`
        data.result.forEach((r, i) => {
            reply += `*${i + 1}.* Título: ${r.title}\n`
            reply += `🍄 *Descripción:* ${r.description || 'Sin descripción disponible.'}\n`
            reply += `🌾 *URL:* ${r.url}\n\n`
        })

     
        const firstWithImage = data.result.find(r => r.thumbnail)

        if (firstWithImage) {
            try {
                const imageResponse = await axios.get(firstWithImage.thumbnail, {
                    responseType: 'arraybuffer',
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Linux; Android 13; SM-A035M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36'
                    }
                })

                await conn.sendMessage(m.chat, { 
                    image: { buffer: Buffer.from(imageResponse.data) }, 
                    caption: `🔰 *Wikipedia* - ${firstWithImage.title}\n${firstWithImage.description || ''}\n${firstWithImage.url}`
                }, { quoted: m })

            } catch (imgErr) {
                console.error(`Error cargando thumbnail: ${firstWithImage.thumbnail}`, imgErr)
     
                await conn.sendMessage(m.chat, { text: reply }, { quoted: m })
            }
        } else {
     
            await conn.sendMessage(m.chat, { text: reply }, { quoted: m })
        }

    } catch (e) {
        console.error(e)
        await conn.sendMessage(m.chat, { text: `${emoji2} Error al buscar en Wikipedia.` }, { quoted: m })
    }
}

handler.help = ['wikipedia <texto>']
handler.tags = ['tools']
handler.command = ['wiki', 'wikipedia']

export default handler