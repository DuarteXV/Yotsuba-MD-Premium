const { generateWAMessageFromContent, proto } = (await import('@whiskeysockets/baileys')).default

var handler = async (m, { conn, text}) => {

conn.sendMessage(m.chat, {text: `⚽🔥 Analizando potencial egoísta... ¡Buscando el piropo perfecto!`}, {quoted: m, ...rcanal})

conn.sendMessage(m.chat, {text: `*┏━⚽-🔥-🎯-💎-🏆-⚡-🌟-🏃-♂-━┓*\n\n🎯 *"${pickRandom(global.piropo)}"* 💎\n\n*┗━⚽-🔥-🎯-💎-🏆-⚡-🌟-🏃-♂-━┛*`}, {quoted: m, ...rcanal})

}
handler.help = ['piropo']
handler.tags = ['fun']
handler.command = ['piropo']
handler.fail = null
handler.exp = 0
handler.group = true;
handler.register = true

export default handler

let hasil = Math.floor(Math.random() * 5000)
function pickRandom(list) {
return list[Math.floor(list.length * Math.random())]
}

global.piropo = [
    // Piropo originales (mantenidos)
    "Si tu cuerpo fuera cárcel y tus labios cadena, qué bonito lugar para pasar mi condena.",
    "!Lo tuyo es un dos por uno, además de guapa eres simpática!",
    "Fíjate como es la ciencia que ahora hasta hacen bombones que andan.",
    "Por la luna daría un beso, daría todo por el sol, pero por la luz de tu mirada, doy mi vida y corazón.",
    "Si yo fuera un avión y tu un aeropuerto, me la pasaría aterrizando por tu hermoso cuerpo.",
    "Tantas estrellas en el espacio y ninguna brilla como tú.",
    "Me gusta el café, pero prefiero tener-té.",
    "No eres Google, pero tienes todo lo que yo busco.",
    "Mis ganas de ti no se quitan, se acumulan.",
    "Te regalo esta flor, aunque ninguna será jamás tan bella como tú.",
    "Cuando te multen por exceso de belleza, yo pagaré tu fianza.",
    "Si cada gota de agua sobre tu cuerpo es un beso, entonces quiero convertirme en aguacero.",
    "Estás como para invitarte a dormir, y no dormir.",
    "Si tu cuerpo fuera cárcel y tus brazos cadenas, ese sería el lugar perfecto para cumplir condena.",
    "Cómo podría querer irme a dormir si estás tú al otro lado de la pantalla?",
    "Quisiera ser hormiguita para subir por tu balcón y decirte al oído: guapa, bonita, bombón.",
    "En mi vida falta vida, en mi vida falta luz, en mi vida falta alguien y ese alguien eres tú.",
    "Señorita, si supiera nadar, me tiraría en la piscina de tus ojos desde el trampolín de sus pestañas.",
    "Señorita disculpe, pero la llaman de la caja... –Qué caja?... –De la caja de bombones que te escapaste",
    "Eres tan hermosa que te regalaría un millón de besos y si no te gustasen te los aceptaría de regreso.",
    "Eres tan bonita que Dios bajaría a la tierra tan solo para verte pasar.",
    "¡Eres como una cámara Sony! Cada vez que la miro no puedo evitar sonreir.",
    "En una isla desierta me gustaría estar y sólo de tus besos poderme alimentar.",
    "Si fueras lluvia de invierno, yo cerraría el paraguas para sentirte en mi cuerpo.",
    "Me gustas tanto, tanto, que hasta me gusta estar preso, en las redes de tu encanto.",
    "Si te pellizco seguro que te enojas pero si me pellizcas tu, seguro que me despierto.",
    "No son palabras de oro ni tampoco de rubí, son palabras de cariño que compongo para usted.",
    "Te invito a ser feliz yo pago.",
    "Cuando caminas no pisas el suelo, lo acaricias.",
    "Nos veríamos lindo en un pastel de boda juntos.",
    "Tantas formas de vida y yo solo vivo en sus ojos.",
    "¿A qué numero llamo si quiero marcarte de por vida?",
    "Me gustas tanto que no se por donde empezar a decírtelo.",
    "Todos se quedan con tu físico, pero yo prefiero tu corazón.",
    "Hola si te gustan los idiomas cuando quieras te enseño mi lengua.",
    "Dime por donde paseas para besar el suelo que pisas, preciosidad!",
    "Tu belleza me enciega porque viene desde su corazón y se refleja en tus ojos.",
    "Eres de esa clase de personas, por las cuales a las estrellas se les piden deseos.",
    "Si alguna vez te han dicho que eres bella te mintieron, no eres bella eres hermosa.",
    "Celeste es el cielo, amarilla la nata y negros son los ojos de la chica que me mata.",
    "Si yo fuera Colón navegaría día y noche para llegar a lo más profundo de tu corazón.",
    "Cinco calles he cruzado, seis con el callejón, sólo me falta una para llegar a tu corazón.",
    "Si fueras mi novia me volvería ateo ¿ Por que? Porque no tendría nada más que pedirle a Dios.",
    "A una hermosa niña acompañada de la madre: ¡Que linda flor, lástima que venga con la maceta!",
    "Si me dedicas una sonrisa pasas de ser linda a perfecta.",
    "¿Qué pasó en el cielo que se están cayendo los ángeles?",
    "¡Te voy a poner una multa!. ¿Por qué? Por exceso de belleza.",
    "Como se habrán querido tus padres... por haberte hecho tan bonita.",
    "Por qué el cielo está nublado? Porque todo el azul está en tus ojos.",
    "¿Tienes alguna herida, guapa ? Tiene que ser duro caerse del cielo.",
    "Tus ojos son verdes los míos café, los míos te quieren los tuyos no sé.",
    "Cuando el día se nubla, no extraño al sol, porque lo tengo en tu sonrisa.",
    "Pasa una mujer y dice adiós... -a DIOS lo vi cuando me miraron tus ojos!",
    "En otras partes del mundo se están quejando, porque el sol está acá nada mas.",
    "Aprovecha que estoy en rebaja guapa y te dejo dos besos por el precio de uno. Dios se pasó al crearte a ti.",
    "Al amor y a ti los conocí al mismo tiempo.",
    "Si la belleza fuese tiempo, tú serías 24 horas.",
    "Si algún día te pierdes, búscate en mis pensamientos!",
    "Si amarte fuera pecado, tendría el infierno asegurado.",
    "Eres lo único que le falta a mi vida para ser perfecto.",
    "Eres la única estrella que falta en el cielo de mi vida!",
    "Ahora que te conozco, no tengo nada mas que pedirle a la vida!",
    "Voy a tener que cobrarte alquiler, porque desde que te vi no has dejado de vivir en mis sueños.",
    "Me gustaría ser tu almohada, para que me abraces todas las mañanas.",
    "No te digo palabras bonitas, sino un verso sincero: mi amor por ti es infinito y mi corazón es verdadero.",
    "Lo que siento por ti es tan inmenso que, para guardarlo, me haría falta otro universo.",
    "Las matemáticas siempre dicen la verdad: tú y yo juntos hasta la eternidad.",
    "Que fácil sería cumplir una condena si tu cuerpo fuera cárcel y tus brazos cadenas.",
    "Mi madre me dijo que no debía pecar, pero por ti estoy dispuesta a confesarme.",
    "No se trata del whisky ni la cerveza, eres tú quien se me ha subido a la cabeza.",
    "De noche brilla la luna, y de día brilla el sol, pero tus ojos bonitos alumbran mi corazón.",
    "No me busques, prefiero seguir perdido en tu mirada.",
    "Unos quieren el mundo, otros quieren el sol, pero yo solo quiero un rincón en tu corazón.",
    "Te dejaré de amar a partir del día que encuentre el alfiler que ahora tiro al mar.",
    "Bienaventurados los borrachos, porque ellos te verán dos veces.",
    "Como avanza la ciencia si ya las flores caminan.",
    "Tanta curva y yo sin frenos.",
    "Si Adán por Eva se comió una manzana, yo por Ti me comería una frutería.",
    "Si yo fuera astronauta te llevaría a Plutón, pero como no lo soy te llevo siempre en mi corazón.",
    "Tú debes ser atea, porque estás como quieres y no como Dios manda.",
    "Si que está avanzada la ciencia; que hasta los bombones caminan.",
    "¿De qué juguetería te escapaste?, ¡muñeca!",
    "Ayer pasé por tu casa y me tiraste un ladrillo … mañana pasaré de nuevo para construirte un castillo.",
    "¿Te dolió caer del cielo… angelito?",
    "Tu madre debía de ser pastelera porque un bombón como tú no lo hace cualquiera.",
    "Tu papá debe ser un pirata, porque tú eres un tesoro!",
    "Siempre escucho decir a las personas que Disneyland es el lugar más feliz del mundo. Pero me pregunto ¿si han estado alguna vez a tu lado?",
    "Por algún motivo, hoy me sentía un poco mal. Pero cuando te vi llegar, me excitaste y se me fue todo el malestar.",

    // Nuevos piropos estilo Blue Lock
    "Tu sonrisa es la jugada maestra que mi corazón no puede defender.",
    "Eres el gol perfecto que siempre busqué en el partido del amor.",
    "Si el amor fuera fútbol, tú serías mi campeonato mundial.",
    "Tu mirada tiene más poder que mi mejor tiro libre.",
    "Eres la táctica perfecta que derrotaría cualquier defensa emocional.",
    "Contigo, cada momento es como marcar en tiempo de descuento.",
    "Tu belleza es más letal que el remate de Barou en el área.",
    "Eres el pase decisivo que cambió completamente mi juego.",
    "Como Isagi en el área, encuentro en ti mi oportunidad de gol.",
    "Tu amor es el hat-trick que siempre soñé marcar.",
    "Eres la transferencia más valiosa que podría conseguir.",
    "Tu sonrisa ilumina más que las luces del estadio en la final.",
    "Eres la victoria que vale más que cualquier trofeo.",
    "Contigo, cada día es una nueva oportunidad de marcar el gol del amor.",
    "Tu corazón es la portería donde quiero anotar para siempre.",
    "Eres la estrategia que ningún rival podría descifrar.",
    "Tu amor es mi mayor motivación para ser el número 1.",
    "Como un buen delantero, voy directo a tu corazón.",
    "Eres el complemento perfecto para mi equipo emocional.",
    "Tu presencia en mi vida es el gol de oro que tanto esperaba.",
    "Eres la inspiración que necesito para superar mis límites.",
    "Contigo, el amor es un deporte que quiero practicar siempre.",
    "Tu mirada tiene la intensidad de un partido de final.",
    "Eres la campeona indiscutible de mi corazón.",
    "Tu amor es la energía que alimenta mi ego más puro.",
    "Como en Blue Lock, contigo quiero evolucionar cada día.",
    "Eres la meta-visión que me guía hacia la felicidad.",
    "Tu sonrisa es mi mayor recompensa después de la victoria.",
    "Eres el entrenamiento que vale la pena repetir siempre.",
    "Contigo, cada beso es como marcar el gol de la victoria."
]