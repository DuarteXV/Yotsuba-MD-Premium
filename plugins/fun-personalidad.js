var handler = async (m, { conn, command, text }) => {

if (!text) return conn.reply(m.chat, `⚽🔥 *BLUE LOCK ANALYSIS* 🔥⚽\n\nIngresa el nombre del jugador para analizar su potencial egoísta...`, m)

let personalidad = `⚽🔥 *ANÁLISIS BLUE LOCK - PROYECCIÓN DE EGOS* 🔥⚽

\`JUGADOR ANALIZADO\` : ${text}
\`POTENCIAL EGOÍSTA\` : ${pickRandom(['78%','84%','92%','96%','98%','99%','100%','150%','200%','∞%'])}
\`VISIÓN DIRECTA\` : ${pickRandom(['65%','72%','88%','94%','97%','99%','100%','S+'])}
\`HAMBRIENTO DE VICTORIAS\` : ${pickRandom(['85%','90%','95%','98%','99%','100%','🔥MAXIMO🔥'])}
\`TIPO DE DELANTERO\` : ${pickRandom(['Depredador del Área','Genio Táctico','Egoísta Nato','Rey Solitario','Asesino Instintivo','Estratega Frío','Máquina de Goles','Fénix Renacido'])}
\`ESTADO ACTUAL\` : ${pickRandom(['Devorando rivales','Analizando patrones','En zona de flujo','Cazando en el área','Creando jugadas maestras','Superando límites','Destruyendo defensas','Evolucionando en tiempo real'])}
\`ARMA SECRETA\` : ${pickRandom(['Meta-Visión','Instinto Asesino','Ego Infinito','Determinación Absoluta','Adaptación Instantánea','Frío Calculador','Hambre de Gol','Voluntad de Acero'])}
\`DEBILIDAD DETECTADA\` : ${pickRandom(['Exceso de análisis','Ego sobrecalentado','Falta de socios ideales','Miedo al fracaso','Dependencia tácticas','Inconsistencia emocional','Ninguna - Ego Puro'])}
\`NIVEL DE FLUJO\` : ${pickRandom(['65%','78%','85%','92%','96%','99%','¡ZONA DE FLUJO!','EVOLUCIÓN CONTINUA'])}
\`COMPATIBILIDAD ISAGI\` : ${pickRandom(['72%','85%','90%','95%','98%','RIVAL IDEAL','ALIADO PERFECTO','ENEMIGO MORTAL'])}
\`POTENCIAL FINAL\` : ${pickRandom(['Estrella Mundial','Número 1 Japón','Leyenda Blue Lock','Genio Incomprendido','Diamante en Bruto','Jugador de Élite','Fenómeno Único'])}

🔥 *"En este mundo, solo los más hambrientos sobreviven" - Jinpachi Ego* 🔥

⚽ *Análisis completado - ¡Demuestra tu ego en el campo!* ⚽`

conn.reply(m.chat, personalidad, m)

}
handler.help = ['bluelock', 'isagi', 'ego']
handler.tags = ['fun', 'anime']
handler.command = ['isagi','analisis']
handler.group = true;
handler.register = true

export default handler

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)]
}