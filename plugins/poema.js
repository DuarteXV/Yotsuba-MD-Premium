const { generateWAMessageFromContent, proto } = (await import('@whiskeysockets/baileys')).default

var handler = async (m, { conn, text }) => {

conn.sendMessage(m.chat, {text: `✨ Buscando un poema para ti, espere un momento...`}, {quoted: m})

conn.sendMessage(m.chat, {text: `*┏━_͜͡-͜͡-͜͡-͜͡-͜͡-͜͡-͜͡❤️-͜͡-͜͡-͜͡-͜͡-͜͡-͜͡-͜͡❤️-͜͡-͜͡-͜͡-͜͡-͜͡-͜͡-͜͡❤️-͜͡-͜͡-͜͡-͜͡-͜͡-͜͡_͜͡━┓*\n\n*_${pickRandom(global.poemas).titulo}_* \n\n❥ *"${pickRandom(global.poemas).contenido}"*\n\n_${pickRandom(global.poemas).emoji}: ${pickRandom(global.poemas).descripcion}_\n\n~${pickRandom(global.poemas).autor}\n\n*┗━_͜͡-͜͡-͜͡-͜͡-͜͡-͜͡-͜͡❤️-͜͡-͜͡-͜͡-͜͡-͜͡-͜͡-͜͡❤️-͜͡-͜͡-͜͡-͜͡-͜͡-͜͡-͜͡❤️-͜͡-͜͡-͜͡-͜͡-͜͡-͜͡_͜͡━┛*`}, {quoted: m})

}
handler.help = ['poema']
handler.tags = ['fun']
handler.command = ['poema']
handler.fail = null
handler.exp = 0
handler.group = true;
handler.register = true

export default handler

function pickRandom(list) {
return list[Math.floor(list.length * Math.random())]
}

global.poemas = [
    {
        titulo: "Mi vida",
        contenido: "Mi vida está confusa no encuentro las palabras para dedicar este momento mis ojos mis oidos no me asen caso no quieren encontrar paz porque tienen miedo de perder todo aquello que una vez fue importante para ellos y también no estoy listo a dejar esas ataduras de mi corazón las cuales no me permiten disfrutar la paz de mi existencia donde todos me miran otros lloran pero cada quien pensó lo mismo no hay lugar para quien nunca se a sido aceptado debo seguir adelante teniendo en mente que nada me saldrá bien y que no valore lo que tenía porque no fui capaz de verlo aquí terminó aquí sigo pero no sé si seguiré después",
        emoji: "🤍",
        descripcion: "como tener depresión",
        autor: "walo"
    },
    {
        titulo: "Porfin te encontré",
        contenido: "Te encontré fue hermoso el momento donde ví que me entendiste y me amaste te quedaste aunque sea insoportable y no te alejaste después de mucho tiempo conocí a alguien el cual puedo amar sin sentir miedo de ser rechazado que después de tanto no se a alejado y estás conmigo aunque no soy bueno tampoco malo te quiero agradecer ya que pude Aser promesas las cuales atesoro y no defraudare porque gracias ati enamorarme pude otra vez pero está vez estoy seguro que no fracasare porque me esforzare para que no te canses para que no me odies y espero me perdones si ago algo tonto esque estoy muy feliz y me pongo bobo por eso quiero estar a tu lado para que tú y yo nos queramos y mientras nunca me abandones yo siempre estaré a tu lado por eso quiero agradecerte porque por fin en mucho tiempo me siento amado",
        emoji: "❤️",
        descripcion: "te amo mucho amor",
        autor: "walo"
    },
    {
        titulo: "Estoy aquí",
        contenido: "Estaré aquí esperando que tú estés lista para que puedas ver qué mi amor va sin prisa que las estrellas siempre se iluminan al ver lo mucho que mi amor aumenta espero que esto dure asta después de los 280 que tú vida encuentre conmigo belleza porque mi amor va mucho más de este simple poema esto es hermoso ver cómo las plantas florecen cuando veo tu lindo rostro el como me despierto y no solo pienso en ti pienso en que seamos esposos que estoy aquí esperaré de aquí asta el fin no te dejare porque sin ti no podría vivir y espero que con esto se pudiera describir lo mucho que amor siento por ti 🌹",
        emoji: "❤️",
        descripcion: "Gracias por estar ahí",
        autor: "walo"
    },
    {
        titulo: "Conciente de ello",
        contenido: "Soy consciente de ello que lo que una vez fue no volverá que lo que tanto me gusto no regresara en hiervas secas recordarás el momento en donde tú fuiste mi hogar\n\nQuiero volver necesito olvidar pero mi cerebro no quiere perder el recuerdo de tu mirar porque sabe que contigo te necesite y sin ti no sobrevivire porque solo en ti me e sentido bien",
        emoji: "🤍",
        descripcion: "como recordar aquello que fue especial para ti",
        autor: "walo"
    },
    {
        titulo: "El amor de mi vida",
        contenido: "El amor de mi vida sería la persona más linda hermosa tierna bella preciosa y amorosa que conozco y le diría lo que siento todos los días cada momento sería amor llanto y cariño para nosotros y el amor de mi vida le estoy escribiendo ahora mismo este poema que es insierto por las palabras de contento que puedo decir y lo siento pero ya no puedes retractarte porque ya te volviste muy importante y este poemita significa bastante y quiero que cuando lo leas sepas que no necesitas cambiarte porque eres perfecta aunque sea un gordito el que te lo quiera mencionar porque se a enamorado de ti y nada más no puede resistir el amor que te quiere dar y lo único que quiere es que nunca lo vayas a dejar",
        emoji: "❤️",
        descripcion: "siempre pienso eso cuando tú recuerdo llega a mi cerebro",
        autor: "walo"
    },
    {
        titulo: "Eres mi despertar",
        contenido: "Las luces de la noche son hermosas como el cantar de los grillos que cantan a puro zumbido como el río que trae agua nueva para beber y las piedras que les sale musgo para los insectos comer en la naturaleza se asen descubrimientos espectaculares pero creo que nunca pensaron en el descubrimiento de encontrarte ya que desde que te descubrí las noches con preciosas y los días hermosos y siempre que te pienso mis poemas crecen  tanto como mis ganas de poder verte",
        emoji: "💎",
        descripcion: "el sentimiento llamado amor",
        autor: "walo"
    },
    {
        titulo: "Quería decir te amo pero dije",
        contenido: "recuerda esto en cada momento, el amor no es solo el sentimiento sino también el deseo de estar con esa persona la alegría de pasar tiempo con ella y los recuerdos hermosos que agas con esta el amor está lleno de sorpresas algunas buenas otras malas pero a lo que quiero llegar es que mi amor es sincero y quiero dártelo ati y a nadie más",
        emoji: "🌹",
        descripcion: "recuerda que es el amor",
        autor: "walo"
    },
    {
        titulo: "Tu eres mi 1%",
        contenido: "Llegaste a ese punto donde eres mi prioridad y mi mayor tesoro, dónde las personas no llegan ni aunque hagan un millón de coros, con intenciones de agradarme, lo cual no les servía porque solo ati puedo amarte, eres ese 1% que siempre busque y ahora que te encontré, no déjare, que me dejes de querer, porque para eso mejore, para eso a amar empeze, por ti me recupere y solo ati podré querer, así que lo único que quiero pedirte, es que me ames como el porcentaje que siempre ame",
        emoji: "❤️",
        descripcion: "eres el 1% ese porcentaje que me hacía falta para ser feliz",
        autor: "walo"
    },
    {
        titulo: "Gracias por este momento",
        contenido: "Son ustedes los que porfin me ayudaron los que me salvaron los que me refugiaron en cálidos momentos los cuales se isieron inolvidables por lo bueno que fue estar con ustedes si gracias por estar aquí y mi deseo que les pediría a las estrellas es que no pueda olvidar tan bellos momentos y que el recuerdo sea eterno en una historia sin fin dónde todos estemos en ese tan ansiado lugar feliz",
        emoji: "💎",
        descripcion: "para ustedes mis diamantes de papel 💎",
        autor: "walo"
    }
];