let handler = async (m, { conn }) => {
  let reto = pickRandom(global.reto)
  let mensaje = `
╔═══════════════════════
║    ✨ 𝙍𝙀𝙏𝙊 𝙈𝙔𝙎𝙏𝙄𝘾 ✨
╠═══════════════════════
║
║  🔥 𝙍𝙀𝙏𝙊:
║  "${reto}"
║
╠═══════════════════════
║    ⏳ 𝙏𝙄𝙀𝙈𝙋𝙊: 24 𝙝𝙤𝙧𝙖𝙨
║    ⚠️  𝙉𝙊 𝙋𝙐𝙀𝘿𝙀𝙎 𝙍𝙀𝙃𝙐𝙎𝘼𝙍
╚═══════════════════════
`.trim()
  
  conn.reply(m.chat, mensaje, m)
}

handler.help = ['reto']
handler.tags = ['fun', 'games']
handler.command = /^reto$/i
handler.group = true
export default handler

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}

global.reto = [
  // RETOS DIGITALES 🌐
  "Pon la foto de perfil de alguien del grupo durante 24 horas",
  "Envía un mensaje a tu ex diciendo 'Aún pienso en ti' y pasa captura",
  "Publica en tu estado: 'Vendo contenido picante, preguntar al DM'",
  "Envía un audio cantando tu canción favorita desentonando a propósito",
  "Cambia tu nombre de WhatsApp por '😈 El Travieso' por 1 día",
  "Envía un mensaje al último contacto que te escribió diciendo '¿Ya me extrañabas?'",
  "Publica una foto tuya de hace 5 años en tus estados",
  
  // RETOS EN PÚBLICO 🎤
  "Grita por la ventana '¡Quiero ser famoso en TikTok!'",
  "Pídele un abrazo a un desconocido en la calle",
  "Baila 30 segundos en medio de un centro comercial",
  "Canta el himno nacional frente a 3 personas",
  "Pídele un selfie a 5 desconocidos diferentes",
  "Imita a un animal en el transporte público",
  "Pregunta en voz alta en una tienda '¿Venden amor aquí?'",
  
  // RETOS CON AMIGOS 👥
  "Debes llamar a tu mejor amigo/a y decirle 'Te amo platónicamente'",
  "Haz que un amigo te maquille con los ojos cerrados y sube la foto",
  "Deja que un amigo publique lo que quiera en tus redes por 1 hora",
  "Haz 10 flexiones mientras tus amigos te gritan motivación",
  "Cuenta tu secreto más vergonzoso al grupo",
  "Deja que los demás dibujen en tu cara con marcador",
  
  // RETOS AUDACES 😈
  "Habla con acento extranjero por 1 hora completa",
  "Come una cucharada de algo dulce, salado y picante mezclado",
  "Usa la ropa al revés por todo el día",
  "Envía un mensaje de voz susurrando cosas aleatorias a 3 contactos",
  "Toma un shot de jugo de limón puro sin hacer gestos",
  "Camina de espaldas por 10 minutos en un lugar público",
  "Pídele a alguien que no conoces que te enseñe a bailar",
  
  // RETOS CREATIVOS 🎨
  "Escribe un poema de 4 versos sobre el primer objeto que veas",
  "Haz un dibujo con los ojos cerrados y compártelo",
  "Inventa una canción sobre el grupo y cántala",
  "Crea un baile tonto y enséñalo a alguien",
  "Escribe una historia corta donde todos en el grupo sean superhéroes",
  "Haz un meme sobre ti mismo y compártelo",
  
  // RETOS EMBARAZOSOS 😳
  "Llama a tu mamá y dile que conociste al amor de tu vida",
  "Publica en Facebook 'Busco novio/a, requisitos: respirar'",
  "Habla usando solo emojis por 15 minutos",
  "Ponte calcetines diferentes y toma una foto mostrándolos",
  "Pídele matrimonio a tu bot de WhatsApp favorito",
  "Pretende ser un influencer por 1 hora en tus conversaciones",
  
  // RETOS DE COMIDA 🍽️
  "Come algo sin usar las manos",
  "Combina 3 bebidas diferentes y tómalas de un trago",
  "Come un limón como si fuera una naranja",
  "Prueba algo que nunca hayas comido y graba tu reacción",
  "Haz un sandwich con ingredientes aleatorios que encuentres",
  "Come helado en un día frío frente a una ventana",
  
  // RETOS DE REDES 📱
  "Sube un TikTok con el filtro más ridículo que encuentres",
  "Publica en Instagram una foto tuya haciendo puchero",
  "Cambia todas tus fotos de perfil por memes por 24 horas",
  "Responde todas las historias de tus contactos por 1 hora",
  "Crea un reel imitando a tu celebridad favorita",
  "Haz un live explicando cómo se hacen los noodles instantáneos",
  
  // RETOS EXTRAS 🌟
  "Habla en tercera persona por todo un día",
  "Escribe una carta de amor a tu yo del futuro",
  "Haz 3 cumplidos genuinos a personas diferentes hoy",
  "Aprende y recita un trabalenguas difícil",
  "Construye un fuerte con sábanas y toma fotos dentro",
  "Haz una lista de 10 cosas que amas de ti mismo",
  "Dile a alguien 'Eres importante para mí' sin contexto",
  
  // RETOS VIRALES 🚀
  "Haz el baile del renacuajo en un lugar público",
  "Graba un video diciendo 'Buenos días, familia' como los youtubers",
  "Intenta hacer un truco de magia y graba cuando falle",
  "Ponte una mascarilla facial verde y sal a comprar pan",
  "Haz un unboxing exagerado de algo ordinario",
  "Crea un tutorial de algo que no sabes hacer",
  
  // RETOS NOCTURNOS 🌙
  "Cuenta una historia de terror a las 3 AM y grábala",
  "Toma una foto a la luna y escribe algo poético",
  "Ve a un lugar oscuro y canta una canción suave",
  "Escribe todos tus miedos en un papel y quémalo después",
  "Haz un ritual tonto para atraer buena suerte",
  "Mira las estrellas por 10 minutos sin distracciones"
]