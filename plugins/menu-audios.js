let handler = async (m, { conn, usedPrefix }) => {
  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
  let username = conn.getName(who)
  
  let str = `
╭━━━〔 ⚽️ ISAGI YOICHI ⚽️ 〕━━━╮
│ 
│  ミ🔥 ¡Hola! ${username} 🔥彡
│ 
│ ═══════════════════════
│  🎤 MENÚ DE AUDIOS 🎤
│ ═══════════════════════
│ 
│ ✨ Escribe la palabra sin prefijo
│ 
│ ═══════════════════════
│ 
│ ➤ 🎶 _Noche de paz_
│ ➤ 🎶 _Buenos dias_
│ ➤ 🎶 _Audio hentai_
│ ➤ 🎶 _Fiesta del admin_
│ ➤ 🎶 _Fiesta del admin 2_
│ ➤ 🎶 _Viernes_
│ ➤ 🎶 _Me olvidé_
│ ➤ 🎶 _Baneado_
│ ➤ 🎶 _Feliz navidad_
│ ➤ 🎶 _A nadie le importa_
│ ➤ 🎶 _Sexo_
│ ➤ 🎶 _Vete a la vrg_
│ ➤ 🎶 _Ara ara_
│ ➤ 🎶 _Hola_
│ ➤ 🎶 _Un pato_
│ ➤ 🎶 _Nyanpasu_
│ ➤ 🎶 _Te amo_
│ ➤ 🎶 _Yamete_
│ ➤ 🎶 _Te diagnostico con gay_
│ ➤ 🎶 _Quien es tu sempai botsito 7w7_
│ ➤ 🎶 _Bañate_
│ ➤ 🎶 _Vivan los novios_
│ ➤ 🎶 _Marica quien_
│ ➤ 🎶 _Es puto_
│ ➤ 🎶 _La biblia_
│ ➤ 🎶 _Onichan_
│ ➤ 🎶 _Bot puto_
│ ➤ 🎶 _Feliz cumpleaños_
│ ➤ 🎶 _Pasa pack Bot_
│ ➤ 🎶 _Atencion grupo_
│ ➤ 🎶 _Homero chino_
│ ➤ 🎶 _Oh me vengo_
│ ➤ 🎶 _Murio el grupo_
│ ➤ 🎶 _Siuuu_
│ ➤ 🎶 _Rawr_
│ ➤ 🎶 _UwU_
│ ➤ 🎶 _:c_
│ ➤ 🎶 _a_
│ ➤ 🎶 _Hey_
│ ➤ 🎶 _Enojado_
│ ➤ 🎶 _Enojada_
│ ➤ 🎶 _Chao_
│ ➤ 🎶 _Hentai_
│ ➤ 🎶 _Triste_
│ ➤ 🎶 _Estoy triste_
│ ➤ 🎶 _Me pican los cocos_
│ ➤ 🎶 _Contexto_
│ ➤ 🎶 _Me voy_
│ ➤ 🎶 _Tengo los calzones del admin_
│ ➤ 🎶 _Entrada épica_
│ ➤ 🎶 _Esto va ser épico papus_
│ ➤ 🎶 _Ingresa épicamente_
│ ➤ 🎶 _Bv_
│ ➤ 🎶 _Yoshi_
│ ➤ 🎶 _No digas eso papu_
│ ➤ 🎶 _Ma ma masivo_
│ ➤ 🎶 _Masivo_
│ ➤ 🎶 _Basado_
│ ➤ 🎶 _Basada_
│ ➤ 🎶 _Fino señores_
│ ➤ 🎶 _Verdad que te engañe_
│ ➤ 🎶 _Sus_
│ ➤ 🎶 _Ohayo_
│ ➤ 🎶 _La voz de hombre_
│ ➤ 🎶 _Pero esto_
│ ➤ 🎶 _Bien pensado Woody_
│ ➤ 🎶 _Jesucristo_
│ ➤ 🎶 _Wtf_
│ ➤ 🎶 _Una pregunta_
│ ➤ 🎶 _Que sucede_
│ ➤ 🎶 _Hablame_
│ ➤ 🎶 _Pikachu_
│ ➤ 🎶 _Niconico_
│ ➤ 🎶 _Yokese_
│ ➤ 🎶 _Omaiga_
│ ➤ 🎶 _Nadie te preguntó_
│ ➤ 🎶 _Bueno si_
│ ➤ 🎶 _Usted está detenido_
│ ➤ 🎶 _No me hables_
│ ➤ 🎶 _No chu_
│ ➤ 🎶 _Nochupala_
│ ➤ 🎶 _El pepe_
│ ➤ 🎶 _Pokémon_
│ ➤ 🎶 _No me hagas usar esto_
│ ➤ 🎶 _Esto va para ti_
│ ➤ 🎶 _Abduzcan_
│ ➤ 🎶 _Joder_
│ ➤ 🎶 _Hablar primos_
│ ➤ 🎶 _Mmm_
│ ➤ 🎶 _Orale_
│ ➤ 🎶 _Me anda buscando anonymous_
│ ➤ 🎶 _Blackpink in your area_
│ ➤ 🎶 _Cambiate a Movistar_
│ ➤ 🎶 _Momento equisde_
│ ➤ 🎶 _Todo bien_
│ ➤ 🎶 _Te gusta el Pepino_
│ ➤ 🎶 _El tóxico_
│ ➤ 🎶 _Moshi moshi_
│ ➤ 🎶 _Calla Fan de BTS_
│ ➤ 🎶 _Que tal grupo_
│ ➤ 🎶 _Muchachos_
│ ➤ 🎶 _Está Zzzz_
│ ➤ 🎶 _Goku Pervertido_
│ ➤ 🎶 _Potaxio_
│ ➤ 🎶 _Nico nico_
│ ➤ 🎶 _El rap de Fernanfloo_
│ ➤ 🎶 _Tal vez_
│ ➤ 🎶 _Corte corte_
│ ➤ 🎶 _Buenas noches_
│ ➤ 🎶 _Porque ta tite_
│ ➤ 🎶 _Eres Fuerte_
│ ➤ 🎶 _Bueno Master_
│ ➤ 🎶 _No Rompas más_
│ ➤ 🎶 _Traiganle una falda_
│ ➤ 🎶 _Se están riendo de mí_
│ ➤ 🎶 _Su nivel de pendejo_
│ ➤ 🎶 _Bienvenido_
│ ➤ 🎶 _Elmo sabe donde vives_
│ ➤ 🎶 _tunometecabrasaramambiche_
│ ➤ 🎶 _Y este quien es_
│ ➤ 🎶 _Motivación_
│ ➤ 🎶 _En caso de una investigación_
│ ➤ 🎶 _Buen día grupo_
│ ➤ 🎶 _Las reglas del grupo_
│ ➤ 🎶 _Miku_
│ 
╰━━━━━━━━━━━━━━━━━━━━━╯

╭═══• ೋ💙ೋ •═══╮
   ⚽️ ISAGI YOICHI ⚽️
   0:40 ━❍──── -8:39
   ↻  ⊲  Ⅱ  ⊳  ↺
   VOL: ▁▂▃▄▅▆▇ 100%
╰═══• ೋ🔥ೋ •═══╯`.trim()

  let mentionedJid = [who]
  conn.sendMessage(m.chat, { 
    text: str,
    contextInfo: { mentionedJid }
  }, { quoted: m })
}

handler.help = ['menuaudios']
handler.tags = ['menu']
handler.command = /^(menu2|audios|menú2|memu2|menuaudio|menuaudios|memuaudios|memuaudio)$/i

export default handler
