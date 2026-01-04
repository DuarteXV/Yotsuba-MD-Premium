var handler = async (m, { conn, command, text }) => {

if (!text) return conn.reply(m.chat, `⚽🔥 Escribe tu nombre y el nombre de la otra persona para analizar su compatibilidad egoísta en el campo...`, m, global.rcanal)
let [text1, ...text2] = text.split(' ')

text2 = (text2 || []).join(' ')
if (!text2) return conn.reply(m.chat, `🎯💎 Escribe el nombre de la segunda persona para calcular el potencial de dupla...`, m, global.rcanal)

let compatibilidad = Math.floor(Math.random() * 100)
let mensaje = ""

if (compatibilidad >= 90) {
    mensaje = "¡DUPLA PERFECTA! Como Isagi y Bachira ⚽✨"
} else if (compatibilidad >= 70) {
    mensaje = "Gran conexión en el campo - potencial de genios 🎯🔥"
} else if (compatibilidad >= 50) {
    mensaje = "Compatibilidad media - necesitan más entrenamiento 🏃♂️💪"
} else if (compatibilidad >= 30) {
    mensaje = "Poca química - rivales más que aliados 💀⚔️"
} else {
    mensaje = "Compatibilidad mínima - egos en conflicto total 🚫🔥"
}

let love = `⚽ *ANÁLISIS DE DUPLA BLUE LOCK* 🔥\n\n🎯 *${text1}* tu compatibilidad egoísta con *${text2}* es de ${compatibilidad}% 💎\n\n${mensaje}\n\n🏆 "En el fútbol, solo los que se complementan sobreviven"`

m.reply(love, null, { mentions: conn.parseMention(love) })

}
handler.help = ['ship', 'love', 'dupla']
handler.tags = ['fun']
handler.command = ['ship','pareja', 'dupla', 'compatibilidad']
handler.group = true;
handler.register = true

export default handler