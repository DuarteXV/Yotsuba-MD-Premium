const { generateWAMessageFromContent, proto } = (await import('@whiskeysockets/baileys')).default

var handler = async (m, { conn, text}) => {

conn.sendMessage(m.chat, {text: `${emoji2} Buscando una frase, espere un momento...`}, {quoted: m, ...rcanal})

conn.sendMessage(m.chat, {text: `*┏━_͜͡-͜͡-͜͡-͜͡-͜͡-͜͡-͜͡⚘-͜͡-͜͡-͜͡-͜͡-͜͡-͜͡-͜͡⚘-͜͡-͜͡-͜͡-͜͡-͜͡-͜͡-͜͡⚘-͜͡-͜͡-͜͡-͜͡-͜͡-͜͡_͜͡━┓*\n\n❥ *"${pickRandom(global.frases)}"*\n\n*┗━_͜͡-͜͡-͜͡-͜͡-͜͡-͜͡-͜͡⚘-͜͡-͜͡-͜͡-͜͡-͜͡-͜͡-͜͡⚘-͜͡-͜͡-͜͡-͜͡-͜͡-͜͡-͜͡⚘-͜͡-͜͡-͜͡-͜͡-͜͡-͜͡_͜͡━┛*`}, {quoted: m, ...rcanal})

}
handler.help = ['frase']
handler.tags = ['fun']
handler.command = ['frase']
handler.fail = null
handler.exp = 0
handler.group = true;
handler.register = true

export default handler

let hasil = Math.floor(Math.random() * 5000)
function pickRandom(list) {
return list[Math.floor(list.length * Math.random())]
}

global.frases = [
    // Frases originales
    "Recuerda que no puedes fallar en ser tú mismo (Wayne Dyer)",
    "Siempre es temprano para rendirse (Jorge Álvarez Camacho)",
    "Sólo una cosa convierte en imposible un sueño: el miedo a fracasar (Paulo Coelho)",
    "Lo que haces hoy puede mejorar todos tus mañanas (Ralph Marston)",
    "Cáete siete veces y levántate ocho (Proverbio japonés)",
    "Nada sucede hasta que algo se mueve (Albert Einstein)",
    "La felicidad está escondida en la sala de espera de la felicidad (Eduard Punset)",
    "El verdadero buscador crece y aprende, y descubre que siempre es el principal responsable de lo que sucede (Jorge Bucay)",
    "La vida comienza al final de la zona de confort (Neale Donald Walsch)",
    "La confianza en sí mismo es el primer secreto del éxito (Ralph Waldo Emerson)",
    "No hay camino para la paz, la paz es el camino. (Mahatma Gandhi)",
    "La vida es lo que pasa mientras estás ocupado haciendo otros planes. (John Lennon)",
    "La vida es un 10% lo que me ocurre y un 90% cómo reacciono a ello. (Charles R. Swindoll)",
    "El único modo de hacer un gran trabajo es amar lo que haces. (Steve Jobs)",
    "No importa qué tan lento vayas, siempre y cuando no te detengas. (Confucio)",
    "No te preocupes si no tienes éxito, siempre puedes ser un buen ejemplo de cómo no hacerlo.",
    "La única razón por la que estoy en forma es porque redondeo.",
    "Soy multitarea: puedo procrastinar, ignorar y olvidarme al mismo tiempo.",
    "Si la vida te da limones, pide sal y tequila.",
    "La risa es la distancia más corta entre dos personas.",
    "No soy un completo inútil, al menos sirvo de mal ejemplo.",
    "A veces la mayor aventura es simplemente un acto de valentía.",
    "Soy vago, pero no me gusta que digan que soy perezoso.",
    "Si no puedes convencerlos, confúndelos.",
    "La vida es corta, haz que cuente.",
    "La vida es una comedia escrita por un dramaturgo que es un poco sordo.",
    "Hazlo o no lo hagas, pero no lo intentes.",
    "La felicidad no es un destino, es una forma de viajar. (Margaret Lee Runbeck)",
    "El tiempo vuela, pero yo soy el piloto.",
    "No soy vago, estoy en modo de ahorro de energía.",
    "La vida es como montar en bicicleta. Para mantener el equilibrio, debes seguir adelante. (Albert Einstein)",
    "Nunca discutas con un tonto, te arrastrará a su nivel y te ganará por experiencia.",
    "Ayer era la fecha límite para todos mis problemas.",
    "La única forma de hacer un gran trabajo es amar lo que haces. (Steve Jobs)",
    "La vida es un reto, enfréntalo.",
    "Si no tienes un plan, estás planeando fracasar.",
    "La vida es una aventura, atrévete a vivirla.",

    // Frases de Blue Lock
    "El talento es la habilidad de cada uno de demostrar su fuerza (Jinpachi Ego - Blue Lock)",
    "Conviértete en el que escoge y no el que espera para ser escogido (Yoichi Isagi - Blue Lock)",
    "No importa cuánto intentes entender el corazón de las otras personas, no es posible cambiar a otros (Yoichi Isagi - Blue Lock)",
    "Cuando juego, el balón no es mi amigo ni ninguna de esas tonterías. Soy el Rey (Shouei Barou - Blue Lock)",
    "Desechad la idea de ganar por pura suerte y haceos con la victoria como una secuencia lógica (Jinpachi Ego - Blue Lock)",
    "No voy a esperarte Isagi. Si me quieres, recupérame (Meguru Bachira - Blue Lock)",
    "Si nunca aceptas la frustración de perder, no serás capaz de crecer (Seishiro Nagi - Blue Lock)",
    "Soy lo suficientemente fuerte como para morir una vez y ser capaz de ponerme en pie de nuevo (Shouei Barou - Blue Lock)",
    "Un delantero debe ser egoísta para marcar goles (Jinpachi Ego - Blue Lock)",
    "La presión es lo que convierte el carbón en diamante (Jinpachi Ego - Blue Lock)",
    "En el fútbol, solo existe el número 1 (Rin Itoshi - Blue Lock)",
    "Confía en tus instintos, ellos te llevarán al gol (Yoichi Isagi - Blue Lock)",
    "El fútbol es guerra, y en la guerra solo gana el más fuerte (Shouei Barou - Blue Lock)",
    "La creatividad nace de la presión y la competencia (Jinpachi Ego - Blue Lock)",

    // Frases de otros animes
    "No vivas con falsedades ni miedos, porque terminarás odiándote a ti mismo (Naruto Uzumaki - Naruto)",
    "A mí me da igual que los dioses existan o no, yo soy el amo de mi vida (Roronoa Zoro - One Piece)",
    "Levántate y camina hacia adelante, tienes las piernas para hacerlo (Edward Elric - FullMetal Alchemist)",
    "Cree en el tú... que cree en ti mismo! (Kamina - Tengen Toppa Gurren Lagann)",
    "No mueras por tus amigos, vive por ellos (Erza Scarlet - Fairy Tail)",
    "No importa cuán poderoso se vuelva, nunca intente hacer todo usted mismo (Itachi Uchiha - Naruto)",
    "Dejaré los problemas de mañana al yo del mañana (Saitama - One-Punch Man)",
    "¡No te rindas, no debes sentirte avergonzado por caer! (Shintaro Midorima - Kuroko's Basketball)",
    "¡Un héroe es alguien que supera cada obstáculo que la vida pone en su camino! (All Might - My Hero Academia)",
    "El trabajo duro es inútil para aquellos que no creen en sí mismos (Naruto Uzumaki - Naruto)",
    "Los humanos son fuertes porque tienen el poder de cambiar (Saitama - One-Punch Man)",
    "Si no arriesgas nada, no puedes cambiar nada (Armin Arlert - Attack on Titan)",
    "La voluntad de seguir adelante es lo que separa a los ganadores de los perdedores (Roronoa Zoro - One Piece)",
    "No importa cuántas veces caigas, lo importante es cuántas veces te levantes (Izuku Midoriya - My Hero Academia)",
    "Las batallas se ganan con la mente, no solo con la fuerza (Shikamaru Nara - Naruto)",
    "Un verdadero héroe siempre encuentra una forma de ayudar a los demás (All Might - My Hero Academia)",
    "El poder de la amistad puede superar cualquier obstáculo (Monkey D. Luffy - One Piece)",
    "Solo aquellos que han conocido la derrota pueden alcanzar la verdadera victoria (Kenshin Himura - Rurouni Kenshin)",
    "El futuro no está escrito, lo creamos nosotros mismos (Son Goku - Dragon Ball)",
    "Si no puedes ganar solo, entonces gana con los demás (Yoichi Isagi - Blue Lock)"
];