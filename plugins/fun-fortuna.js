let handler = async (m, { conn }) => {
  
  const fortunes = [
    // Frases originales
    "Pronto encontrarás lo que has estado buscando.",
    "Un evento inesperado cambiará tu perspectiva.",
    "La música será tu respuesta en momentos difíciles.",
    "Una amistad valiosa se fortalecerá esta semana.",
    "Es momento de tomar ese riesgo que has estado evitando.",
    "Tu creatividad te llevará a nuevas oportunidades.",
    "Alguien piensa en ti más de lo que imaginas.",
    "Las pequeñas acciones de hoy traerán grandes recompensas mañana.",
    "Un viaje corto te traerá sorpresas agradables.",
    "Tu energía positiva atraerá buenas noticias próximamente.",
    "Una conversación importante te dará claridad.",
    "Es buen momento para aprender algo nuevo.",
    "La paciencia será tu mejor aliada esta semana.",
    "Una decisión del pasado mostrará sus frutos ahora.",
    "Tu amabilidad será reconocida por alguien importante.",
    "Una oportunidad única se presentará pronto.",
    "El cambio que temes será mejor de lo esperado.",
    "Tu intuición está en lo correcto, confía en ella.",
    "Un problema difícil encontrará solución de forma inesperada.",
    "Compartir tus talentos traerá alegría a otros y a ti mismo.",
    "Si tus padres te dicen estudia y sé algo en la vida, hazlo porque ellos quieren que seas lo que ellos no pudieron.",

    // Frases estilo Isagi/Blue Lock
    "Tu ego es tu arma más poderosa, úsalo sin miedo.",
    "En el campo de batalla de la vida, solo los más hambrientos sobreviven.",
    "Analiza cada movimiento, encuentra el patrón y destruye a tu rival.",
    "La presión no te aplasta, te convierte en diamante.",
    "No imites a nadie, crea tu propio camino hacia la victoria.",
    "Cada fracaso es solo un dato más para tu próxima jugada maestra.",
    "El instinto es tu brújula en el caos, confía en él.",
    "Un delantero egoísta marca goles, un genio egoísta cambia el juego.",
    "Tu visión directa puede ver más allá de lo que otros perciben.",
    "En el momento decisivo, sé el depredador, no la presa.",
    "La competencia no te destruye, te revela tu verdadero potencial.",
    "No busques socios, busca piezas que complementen tu rompecabezas.",
    "El miedo al fracaso es el mayor impedimento para la grandeza.",
    "Tu hambre de victoria debe ser mayor que tu comodidad.",
    "En la zona de flujo, el tiempo se detiene y solo existe el gol.",
    "Un verdadero striker transforma la presión en combustible.",
    "No esperes la oportunidad, créala con tu propio juego.",
    "Tu evolución comienza cuando dejas de copiar y empiezas a crear.",
    "El fútbol es guerra, y en la guerra solo gana el más fuerte.",
    "Cada partido es un laboratorio para perfeccionar tu arma única.",
    "La lógica y el instinto deben fusionarse para alcanzar la genialidad.",
    "No hay lugar para la mediocridad en el camino al número 1.",
    "Tu determinación debe ser tan fuerte como tu técnica.",
    "En el momento crucial, sé implacable como Isagi en el área.",
    "La verdadera competencia no es contra otros, es contra tu yo de ayer."
  ];
  
  const emojis = ["🎆", "💙", "✨", "🎁", "🌟", "💫", "🚂", "🌱", "🎸", "💖", "⚽", "🔥", "🎯", "💎", "🏆"];
  
  
  const luckyNumbers = [];
  for (let i = 0; i < 3; i++) {
    luckyNumbers.push(Math.floor(Math.random() * 99) + 1);
  }
  
  
  const emotions = ["felicidad", "creatividad", "tranquilidad", "entusiasmo", "amor", "inspiración", "energía", "armonía", "fortaleza", "paz", "determinación", "ego", "concentración", "hambre de victoria", "visión directa"];
  const emotion = emotions[Math.floor(Math.random() * emotions.length)];
  
 
  const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
  
  
  const fortune = fortunes[Math.floor(Math.random() * fortunes.length)];
  
  
  const username = m.pushName || 'Sensei';
  
 
  conn.reply(m.chat, `
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
│         🥠 *GALLETA DE LA FORTUNA BLUE LOCK* ⚽        │
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

*Hola ${username}! Isagi ha analizado tu futuro...*

🎯 *Tu mensaje del destino:*
${randomEmoji} *"${fortune}"*

🔢 *Números de la suerte:* ${luckyNumbers.join(' - ')}

💥 *Tu arma secreta del día:* ${emotion}

⚡ *Recordatorio de Blue Lock:*
"En este mundo, solo los más hambrientos alcanzan la cima. 
Tu ego es lo único que te llevará a ser el número 1."

🔥 *¡Demuestra tu hambre de victoria hoy, Sensei!*
  `, m);
  
  
  conn.sendPresenceUpdate('recording', m.chat);
  setTimeout(() => {
    conn.sendPresenceUpdate('available', m.chat);
    conn.sendFile(m.chat, './media/fortuna.mp3', 'audio.mp3', null, m, true);
  }, 2000);
}

handler.help = ['fortuna', 'galleta', 'suerte']
handler.tags = ['fun', 'entertainment']
handler.command = /^(fortuna|galleta|suerte)$/i

export default handler