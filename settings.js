import { watchFile, unwatchFile } from 'fs' 
import chalk from 'chalk'
import { fileURLToPath } from 'url'
import fs from 'fs'
import cheerio from 'cheerio'
import fetch from 'node-fetch'
import axios from 'axios'
import moment from 'moment-timezone' 

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*


global.botNumber = '' 

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.owner = [
// <-- Número @s.whatsapp.net -->
['18094374392', 'Felix ofc', true],
['573135180876', 'DuarteXV', true], 
['50493732693', 'Hsjajzh', true],
['51933000214', 'Ander', true],
  
// <-- Número @lid -->
  ['212137662218436', 'DuarteXV', true]
];

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.mods = []
global.suittag = ['573135180876'] 
global.prems = []

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.libreria = 'Baileys'
global.baileys = 'V 6.7.17' 
global.vs = '2.2.5'
global.nameqr = '⚽️ Isagi-Yoichi-MD ⚽️'
global.namebot = 'I S A G I Y O I C H I B O T'
global.sessions = 'Sessions'
global.jadi = 'JadiBots' 


//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.packname = '⚽️ 𝐼𝑆𝐴𝐺𝐼 𝑌𝑂𝐼𝐶𝐻𝐼 𝐵𝑂𝑇 ⚽️'
global.botname = '† ɪsᴀɢɪ ʏᴏɪᴄʜɪ †'
global.wm = '⚽️◟𝓘𝓼𝓪𝓰𝓲 𝓨𝓸𝓲𝓬𝓱𝓲◞⚽️'
global.author = '© DuarteXV'
global.dev = '© 🄿🄾🅆🄴🅁🄴🄳 DuarteXV'
global.textbot = '🏆Isagi Yoichi, Un delantero que transforma cada partido en una partida de ajedrez con su mente letal. ♟️⚽🏆'
global.etiqueta = '⚽️DuarteXV⚽️'

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.moneda = 'Blue-Lock-Points'
global.welcom1 = '! Bienvenido al campo! ⚽️ \n✨ Soy Isagi Yoichi ✨ \n⚽️ Edita este mensaje con setwelcome ⚽️'
global.welcom2 = '💫 ¡Hasta la próxima! Gracias por jugar con nosotros 🌟 \n⚽️ ¡Esperamos verte pronto en el campo! ⚽️ \n🔥 Edita este mensaje con setbye 🔥'
global.banner = 'http://files.hostrta.win/files/xzadonix_76.jpg'
global.avatar = 'https://files.catbox.moe/h4vif1.jpeg'

global.api = {
  url: 'https://api.stellarwa.xyz',
  key: 'Angelithixyz'
}

global.playlistApiKey = 'f9e54e5c6amsh8b4dfc0bfb94abap19bab2jsne8b65338207e'


global.apikey = 'adonix-key'
global.APIKeys = {
  'https://api.xteam.xyz': 'YOUR_XTEAM_KEY',
  'https://api.lolhuman.xyz': 'API_KEY',
  'https://api.betabotz.eu.org': 'API_KEY',
  'https://mayapi.ooguy.com': 'may-f53d1d49'
}

global.APIs = {
  ryzen: 'https://api.ryzendesu.vip',
  xteam: 'https://api.xteam.xyz',
  lol: 'https://api.lolhuman.xyz',
  delirius: 'https://delirius-apiofc.vercel.app',
  siputzx: 'https://api.siputzx.my.id',
  mayapi: 'https://mayapi.ooguy.com'
}

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.gp1 = 'https://chat.whatsapp.com/B9YHlQE1XVGDhyKhnSIrX2?mode=ems_copy_t'
global.comunidad1 = 'https://chat.whatsapp.com/GPfABUmCuVN2Qu1d1PPcBY'
global.channel = 'https://whatsapp.com/channel/0029Vb73g1r1NCrTbefbFQ2T'
global.channel2 = 'https://whatsapp.com/channel/0029VbBIilK7tkj7TROe690d'
global.md = 'https://github.com/Brauliovh3/HATSUNE-MIKU'
global.correo = 'duartexv.ofc@gmail.com' 

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*


global.rcanal = { 
  contextInfo: { 
    isForwarded: true, 
    forwardedNewsletterMessageInfo: { 
      newsletterJid: "120363350523130615@newsletter", 
      serverMessageId: 100, 
      newsletterName: "⚽️🔥Isagi-Yoichi-Bot ⚽️🔥"
    }
  }
}


global.redes = 'https://whatsapp.com/channel/0029Vb73g1r1NCrTbefbFQ2T'
global.dev = '© 🄿🄾🅆🄴🅁🄴🄳 DuarteXV'
global.emoji = '⚽️'
global.emoji2 = '🏆'
global.emoji3 = '🔥'

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.catalogo = 'mienlace'
global.estilo = { key: {  fromMe: false, participant: `0@s.whatsapp.net`, ...(false ? { remoteJid: "5219992095479-1625305606@g.us" } : {}) }, message: { orderMessage: { itemCount : -999999, status: 1, surface : 1, message: packname, orderTitle: 'Bang', thumbnail: catalogo, sellerJid: '0@s.whatsapp.net'}}}
global.ch = {
ch1: '120363420979328566@newsletter',
}
global.multiplier = 60

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.cheerio = cheerio
global.fs = fs
global.fetch = fetch
global.axios = axios
global.moment = moment

global.opts = {
  ...global.opts,
  autoread: true,  
  queque: false 
}

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Update 'settings.js'"))
  import(`${file}?update=${Date.now()}`)
})
