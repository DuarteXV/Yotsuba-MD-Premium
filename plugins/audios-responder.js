import fs from 'fs'
import path from 'path'

const audiosPath = path.join(process.cwd(), 'src', 'audios')

const audioMap = {
  'noche de paz': 'Noche.mp3',
  'buenos dias': 'Buenos-dias-2.mp3',
  'audio hentai': 'hentai.mp3',
  'fiesta del admin': 'Fiesta1.mp3',
  'fiesta del admin 2': 'fiesta.mp3',
  'viernes': 'viernes.mp3',
  'me olvidé': 'flash.mp3',
  'me olvide': 'flash.mp3',
  'baneado': 'baneado.mp3',
  'feliz navidad': 'navidad.m4a',
  'a nadie le importa': 'insultar.mp3',
  'sexo': 'gemi2.mp3',
  'vete a la vrg': 'vete a la verga.mp3',
  'ara ara': 'Ara.mp3',
  'hola': 'Hola.mp3',
  'un pato': 'pato.mp3',
  'nyanpasu': 'Nico Nico.mp3',
  'te amo': 'Te-amo.mp3',
  'yamete': 'Yamete-kudasai.mp3',
  'te diagnostico con gay': 'DiagnosticadoConGay.mp3',
  'quien es tu sempai botsito 7w7': 'sempai.mp3',
  'bañate': 'Banate.mp3',
  'vivan los novios': 'vivan.mp3',
  'marica quien': 'maau1.mp3',
  'es puto': 'Es putoo.mp3',
  'la biblia': 'ora.mp3',
  'onichan': 'Onichan.mp3',
  'bot puto': 'bot.mp3',
  'feliz cumpleaños': 'Feliz cumple.mp3',
  'pasa pack bot': 'toma.mp3',
  'atencion grupo': 'asen.mp3',
  'homero chino': 'Homero chino.mp3',
  'oh me vengo': 'vengo.mp3',
  'murio el grupo': 'Murio.m4a',
  'siuuu': 'siu.mp3',
  'rawr': 'rawr.mp3',
  'uwu': 'UwU.mp3',
  ':c': 'Tu.mp3',
  'a': 'a.mp3',
  'hey': 'jai.mp3',
  'enojado': 'insultar.mp3',
  'enojada': 'insultar.mp3',
  'chao': 'A bueno adios master.mp3',
  'hentai': 'hentai.mp3',
  'triste': 'violin.mp3',
  'estoy triste': 'violin.mp3',
  'me pican los cocos': 'me-pican-los-cocos.mp3',
  'contexto': 'contexto.mp3',
  'me voy': 'A bueno adios master.mp3',
  'tengo los calzones del admin': 'https://files.catbox.moe/9yk6we.mp3',
  'entrada épica': 'entrada-epica-al-chat.mp3',
  'esto va ser épico papus': 'esto va a hacer epico papus.mp3',
  'ingresa épicamente': 'entrada-epica-al-chat.mp3',
  'bv': 'otaku.mp3',
  'yoshi': 'yoshi-cancion.mp3',
  'no digas eso papu': 'no-digas-eso-papu.mp3',
  'ma ma masivo': 'masivo-cancion.mp3',
  'masivo': 'masivo-cancion.mp3',
  'basado': 'basado.mp3',
  'basada': 'basado.mp3',
  'fino señores': 'fino-senores.mp3',
  'verdad que te engañe': 'verdad-que-te-engane.mp3',
  'sus': 'sus.mp3',
  'ohayo': 'ohayo.mp3',
  'la voz de hombre': 'la-voz-de-hombre.mp3',
  'pero esto': 'pero-esto-ya-es-otro-nivel.mp3',
  'bien pensado woody': 'bien-pensado-woody.mp3',
  'jesucristo': 'jesucristo.mp3',
  'wtf': 'wtf.mp3',
  'una pregunta': 'una-pregunta.mp3',
  'que sucede': 'suspenso.mp3',
  'hablame': 'hablar primos.mp3',
  'pikachu': 'pikachu.mp3',
  'niconico': 'niconico.mp3',
  'yokese': 'yokese.mp3',
  'omaiga': 'omaiga.mp3',
  'nadie te preguntó': 'nadie te pregunto.mp3',
  'bueno si': 'bueno si.mp3',
  'usted está detenido': 'usted esta detenido.mp3',
  'no me hables': 'no me hables.mp3',
  'no chu': 'no chu.mp3',
  'nochupala': 'nochupala.mp3',
  'el pepe': 'el pepe.mp3',
  'pokémon': 'pokemon.mp3',
  'no me hagas usar esto': 'no me hagas usar esto.mp3',
  'esto va para ti': 'esto va para ti.mp3',
  'abduzcan': 'abduzcan.mp3',
  'joder': 'joder.mp3',
  'hablar primos': 'hablar primos.mp3',
  'mmm': 'mmm.mp3',
  'orale': 'orale.mp3',
  'me anda buscando anonymous': 'Me anda buscando anonymous.mp3',
  'blackpink in your area': 'Blackpink in your area.mp3',
  'cambiate a movistar': 'Cambiate a Movistar.mp3',
  'momento equisde': 'Momento equisde.mp3',
  'momento xd': 'Momento equisde.mp3',
  'todo bien': 'Todo bien.mp3',
  '🧐': 'Todo bien.mp3',
  'te gusta el pepino': 'Te gusta el Pepino.mp3',
  '🥒': 'Te gusta el Pepino.mp3',
  'el tóxico': 'El Toxico.mp3',
  'moshi moshi': 'moshi moshi.mp3',
  'calla fan de bts': 'Calla Fan de BTS.mp3',
  'que tal grupo': 'Que tal Grupo.mp3',
  'muchachos': 'Muchachos.mp3',
  'está zzzz': 'Esta Zzzz.mp3',
  'goku pervertido': 'gemi2.mp3',
  'potaxio': 'Potaxio.mp3',
  '🥑': 'Potaxio.mp3',
  'nico nico': 'Nico Nico.mp3',
  'el rap de fernanfloo': 'el rap de fernanfloo.mp3',
  'tal vez': 'Tal vez.mp3',
  'corte corte': 'Corte Corte.mp3',
  'buenas noches': 'Buenas noches.mp3',
  'porque ta tite': 'Porque ta tite.mp3',
  'eres fuerte': 'Eres Fuerte.mp3',
  'bueno master': 'A bueno adios master.mp3',
  '🫂': 'A bueno adios master.mp3',
  'no rompas más': 'No Rompas Mas.mp3',
  '💔': 'No Rompas Mas.mp3',
  'traiganle una falda': 'Traigan le una falda.mp3',
  'se están riendo de mí': 'Se estan riendo de mi.mp3',
  'su nivel de pendejo': 'Su nivel de pendejo.mp3',
  'bienvenido': 'Bienvenido.mp3',
  'bienvenida': 'Bienvenido.mp3',
  '🥳': 'Bienvenido.mp3',
  '🤗': 'Bienvenido.mp3',
  '👋': 'Bienvenido.mp3',
  'elmo sabe donde vives': 'Elmo sabe donde vives.mp3',
  'tunometecabrasaramambiche': 'tunometecabrasaramambiche.mp3',
  'y este quien es': 'Y este quien es.mp3',
  'motivación': 'Motivacion.mp3',
  'en caso de una investigación': 'En caso de una investigación.mp3',
  'buen día grupo': 'Buen día grupo.mp3',
  '🙌': 'Buen día grupo.mp3',
  'las reglas del grupo': 'Las reglas del grupo.mp3',
  'miku': 'miku.mp3'
}

export async function before(m) {
  if (!m.text || m.isBaileys || m.fromMe) return

  const chat = global.db.data.chats[m.chat]
  if (!chat?.audios) return

  const text = m.text.toLowerCase().trim()


  if (audioMap[text]) {
    const audioFile = path.join(audiosPath, audioMap[text])

    if (fs.existsSync(audioFile)) {
      try {
        const buffer = fs.readFileSync(audioFile)
        const mimetype = audioFile.endsWith('.m4a') ? 'audio/mp4' : 'audio/mpeg'

        try {
          await this.sendFile(m.chat, buffer, 'audio.mp3', '', m, true, {
            type: 'audioMessage',
            ptt: true,
            mimetype
          })
        } catch (err) {

          await this.sendMessage(m.chat, {
            audio: buffer,
            mimetype,
            ptt: true
          }, { quoted: m })
        }
      } catch (e) {
        console.error('Error enviando audio:', e)
      }
    }
  }
}