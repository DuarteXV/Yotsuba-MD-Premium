import fetch from 'node-fetch'
import cheerio from 'cheerio'

const UA_LIST = [
  'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
]

const pickUA = (i = 0) => UA_LIST[i % UA_LIST.length]

const extFromContentType = (ct) => {
  if (!ct) return 'jpg'
  const l = ct.toLowerCase()
  if (l.includes('jpeg')) return 'jpg'
  if (l.includes('jpg')) return 'jpg'
  if (l.includes('png')) return 'png'
  if (l.includes('webp')) return 'webp'
  if (l.includes('gif')) return 'gif'
  return 'jpg'
}

const isLikelyImageURL = (u) => {
  try {
    const { hostname } = new URL(u)
    
    return [
      'tiktokcdn.com',
      'muscdn.com',
      'ttwstatic.com',
      'tikwm.com',
      'imagekit.io'
    ].some(domain => hostname.includes(domain))
  } catch {
    return false
  }
}

async function getImagesFromTikwm(tiktokUrl) {
  try {
    const api = `https://www.tikwm.com/api/?url=${encodeURIComponent(tiktokUrl)}&hd=1`
    const res = await fetch(api, {
      headers: {
        'User-Agent': pickUA(0),
        'Accept': 'application/json, text/plain, */*',
        'Referer': 'https://www.tikwm.com/',
        'Origin': 'https://www.tikwm.com',
      },
      redirect: 'follow',
      timeout: 15000
    })
    if (!res.ok) return { images: [], meta: null }
    const json = await res.json().catch(() => ({}))
    if (!json || json.code !== 0 || !json.data) return { images: [], meta: null }
    const data = json.data

    let images = []
    if (Array.isArray(data.images) && data.images.length) {
      images = data.images.map(u => {
        
        if (u.startsWith('//')) return 'https:' + u
        if (u.startsWith('/')) return 'https://www.tikwm.com' + u
        return u
      })
    }

    const meta = {
      author: { nickname: data.author?.nickname || data.author?.unique_id || 'Usuario TikTok' },
      desc: data.title || 'Imágenes de TikTok'
    }

    return { images, meta }
  } catch (e) {
    return { images: [], meta: null }
  }
}

async function getImagesFromTikMate(tiktokUrl) {
  let images = []
  try {
    const tikMateResponse = await fetch(`https://tikmate.app/download?url=${encodeURIComponent(tiktokUrl)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': pickUA(2)
      },
      body: `url=${encodeURIComponent(tiktokUrl)}`,
      timeout: 15000
    })
    if (tikMateResponse.ok) {
      const tikMateHtml = await tikMateResponse.text()
      const $ = cheerio.load(tikMateHtml)
      $('img').each((i, el) => {
        const src = $(el).attr('src')
        if (src && isLikelyImageURL(src)) images.push(src)
      })
      $('a').each((i, el) => {
        const href = $(el).attr('href')
        if (href && isLikelyImageURL(href)) images.push(href)
      })
    }
  } catch (e) {
    console.log('⚽ Método TikMate falló:', e.message)
  }
  return images
}

async function getImagesFromSIGI(tiktokUrl) {
  let images = []
  for (let i = 0; i < UA_LIST.length; i++) {
    try {
      const res = await fetch(tiktokUrl, {
        headers: {
          'User-Agent': pickUA(i),
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'DNT': '1',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
        },
        redirect: 'follow',
        timeout: 15000
      })
      const html = await res.text()
      const $ = cheerio.load(html)
      
      const sigi = $('#SIGI_STATE').html()
      if (sigi) {
        try {
          const state = JSON.parse(sigi)
         
          if (state?.ItemModule && typeof state.ItemModule === 'object') {
            for (const k of Object.keys(state.ItemModule)) {
              const item = state.ItemModule[k]
              
              if (item?.imagePost?.images && Array.isArray(item.imagePost.images)) {
                for (const img of item.imagePost.images) {
                  if (Array.isArray(img.imageURL)) {
                    for (const u of img.imageURL) if (isLikelyImageURL(u)) images.push(u)
                  }
                  if (Array.isArray(img.url_list)) {
                    for (const u of img.url_list) if (isLikelyImageURL(u)) images.push(u)
                  }
                  if (typeof img.imageURL === 'string' && isLikelyImageURL(img.imageURL)) images.push(img.imageURL)
                }
              }
              
              if (Array.isArray(item?.images)) {
                for (const u of item.images) if (isLikelyImageURL(u)) images.push(u)
              }
              if (item?.image?.url_list && Array.isArray(item.image.url_list)) {
                for (const u of item.image.url_list) if (isLikelyImageURL(u)) images.push(u)
              }
            }
          }
        } catch {}
      }
      
      if (images.length === 0) {
        $('script').each((_, el) => {
          const txt = $(el).html() || ''
          const matches = txt.match(/https?:\/\/[^"'\\\s]+/gi) || []
          for (const u of matches) {
            if (isLikelyImageURL(u)) images.push(u)
          }
        })
      }
      if (images.length > 0) break
    } catch (e) {
      console.log(`⚽ User-agent ${i} falló:`, e.message)
    }
  }
  return images
}

async function getImagesFromSSSTik(tiktokUrl) {
  let images = []
  try {
    const sssResponse = await fetch('https://ssstik.io/abc?url=dl', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'User-Agent': pickUA(2)
      },
      body: `id=${encodeURIComponent(tiktokUrl)}&locale=en&tt=1`,
      timeout: 15000
    })
    if (sssResponse.ok) {
      const sssHtml = await sssResponse.text()
      const $ = cheerio.load(sssHtml)
      $('img').each((i, el) => {
        const src = $(el).attr('src')
        if (src && isLikelyImageURL(src)) images.push(src)
      })
    
      if (images.length === 0) {
        $('script').each((_, el) => {
          const txt = $(el).html() || ''
          const matches = txt.match(/https?:\/\/[^"'\\\s]+/gi) || []
          for (const u of matches) {
            if (isLikelyImageURL(u)) images.push(u)
          }
        })
      }
    }
  } catch (e) {
    console.log('⚽ Método SSSTik falló:', e.message)
  }
  return images
}

async function downloadImage(url, index = 0) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': pickUA(0),
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://www.tiktok.com/',
        'Origin': 'https://www.tiktok.com',
      },
      redirect: 'follow',
      timeout: 15000
    })
    if (!res.ok) return null
    const ct = res.headers.get('content-type') || ''
    if (!ct.toLowerCase().startsWith('image/')) return null
    const buf = await res.buffer()
    if (!buf || buf.length === 0) return null
    const ext = extFromContentType(ct)
    return {
      buffer: buf,
      filename: `isagi_tiktok_${index + 1}.${ext}`
    }
  } catch (e) {
    console.log(`⚽ Error descargando imagen ${index + 1}: ${e.message}`)
    return null
  }
}

let handler = async (m, { conn, usedPrefix, command, args }) => {
  if (!args[0]) return conn.reply(m.chat, `⚽ Hola! Soy Isagi Yoichi! Necesito un link de TikTok con imágenes para ayudarte 🔥`, m, global.rcanal)
  if (!/tiktok/i.test(args[0])) return conn.reply(m.chat, `⚽ ¡Oye! Verifica que el link sea de TikTok, por favor 📱`, m, global.rcanal)

  await m.react('⏳')

  try {
    let images = []
    let videoData = null
    const url = args[0]

   
    const tikwm = await getImagesFromTikwm(url)
    if (tikwm.images.length) {
      images.push(...tikwm.images)
      videoData = tikwm.meta || videoData
    }

   
    if (images.length === 0) {
      const fromTikMate = await getImagesFromTikMate(url)
      if (fromTikMate.length) images.push(...fromTikMate)
    }

    
    if (images.length === 0) {
      const fromSIGI = await getImagesFromSIGI(url)
      if (fromSIGI.length) images.push(...fromSIGI)
    }

    
    if (images.length === 0) {
      const fromSSS = await getImagesFromSSSTik(url)
      if (fromSSS.length) images.push(...fromSSS)
    }

   
    images = [...new Set(
      images
        .filter(u => typeof u === 'string' && u.startsWith('http'))
        .map(u => u.replace(/&amp;/g, '&'))
    )].slice(0, 10)

    if (images.length === 0) throw new Error('No se encontraron imágenes')

    if (!videoData) {
      videoData = {
        author: { nickname: 'Usuario TikTok' },
        desc: 'Imágenes de TikTok'
      }
    }

    const imageCaption =
      `⚽ Isagi Yoichi Image Pack ⚽\n\n` +
      `🖼️ ${images.length} imágenes de TikTok\n` +
      `👤 Por: ${videoData.author.nickname}\n\n` +
      `*"¡Aquí tienes todas tus imágenes!"*`

    
    const downloadedImages = []
    for (let i = 0; i < images.length; i++) {
      const file = await downloadImage(images[i], i)
      if (file) downloadedImages.push(file)
    }

    if (downloadedImages.length > 0) {
      await conn.sendFile(m.chat, downloadedImages[0].buffer, downloadedImages[0].filename, imageCaption, m, null, global.rcanal)
      for (let i = 1; i < downloadedImages.length; i++) {
        await conn.sendFile(m.chat, downloadedImages[i].buffer, downloadedImages[i].filename, '', m, null, global.rcanal)
      }
      await m.react('⚽')
      return
    }

    throw new Error('No se pudieron descargar imágenes válidas')
  } catch (error) {
    console.error('Error:', error)
    await m.react('❌')

    const errorMsg =
      `❌ Error ❌\n\n` +
      `⚠️ Isagi: "¡Error en la jugada! No pude encontrar imágenes..."\n\n` +
      `🔍 Verifica que el link contenga imágenes (post tipo carrusel/foto)\n` +
      `📱 Que sea un link válido de TikTok\n` +
      `🔄 Intenta con otro enlace\n\n` +
      `*"¡Lo siento mucho!"*`

    conn.reply(m.chat, errorMsg, m, global.rcanal)
  }
}

handler.help = ['tiktokimg *<url tt>*']
handler.tags = ['downloader']
handler.command = ['tiktokimg', 'tiktokimgs', 'ttimg', 'ttimgs']
handler.register = true

export default handler