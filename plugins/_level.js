import { canLevelUp } from '../lib/levelling.js'

const roles = {
'*⚽ Aprendiz de Blue Lock V ⚽*': 0,
'*⚽ Aprendiz de Blue Lock IV ⚽*': 2,
'*⚽ Aprendiz de Blue Lock III ⚽*': 4,
'*⚽ Aprendiz de Blue Lock II ⚽*': 6,
'*⚽ Aprendiz de Blue Lock I ⚽*': 8,
'*🏃‍♂️ Delantero Novato V 🏃‍♂️*': 10,
'*🏃‍♂️ Delantero Novato IV 🏃‍♂️*': 12,
'*🏃‍♂️ Delantero Novato III 🏃‍♂️*': 14,
'*🏃‍♂️ Delantero Novato II 🏃‍♂️*': 16,
'*🏃‍♂️ Delantero Novato I 🏃‍♂️*': 18,
'*🔵 Jugador Estelar V 🔵*': 20,
'*🔵 Jugador Estelar IV 🔵*': 22,
'*🔵 Jugador Estelar III 🔵*': 24,
'*🔵 Jugador Estelar II 🔵*': 26,
'*🔵 Jugador Estelar I 🔵*': 28,
'*🔥 Asesino del Área V 🔥*': 30,
'*🔥 Asesino del Área IV 🔥*': 32,
'*🔥 Asesino del Área III 🔥*': 34,
'*🔥 Asesino del Área II 🔥*': 36,
'*🔥 Asesino del Área I 🔥*': 38,
'*⚽ Maestro del Control V ⚽*': 40,
'*⚽ Maestro del Control IV ⚽*': 42,
'*⚽ Maestro del Control III ⚽*': 44,
'*⚽ Maestro del Control II ⚽*': 46,
'*⚽ Maestro del Control I ⚽*': 48,
'*👑 Capitán del Equipo V 👑*': 50,
'*👑 Capitán del Equipo IV 👑*': 52,
'*👑 Capitán del Equipo III 👑*': 54,
'*👑 Capitán del Equipo II 👑*': 56,
'*👑 Capitán del Equipo I 👑*': 58,
'*🌟 Talento Emergente V 🌟*': 60,
'*🌟 Talento Emergente IV 🌟*': 62,
'*🌟 Talento Emergente III 🌟*': 64,
'*🌟 Talento Emergente II 🌟*': 66,
'*🌟 Talento Emergente I 🌟*': 68,
'*💎 Diamante en Bruto V 💎*': 70,
'*💎 Diamante en Bruto IV 💎*': 72,
'*💎 Diamante en Bruto III 💎*': 74,
'*💎 Diamante en Bruto II 💎*': 76,
'*💎 Diamante en Bruto I 💎*': 78,
'*🔥🚀 Estrella en Ascenso V 🚀🔥*': 80,
'*🔥🚀 Estrella en Ascenso IV 🚀🔥*': 85,
'*🔥🚀 Estrella en Ascenso III 🚀🔥*': 90,
'*🔥🚀 Estrella en Ascenso II 🚀🔥*': 95,
'*🔥🚀 Estrella en Ascenso I 🚀🔥*': 99,
'*👑⚽ Leyenda del Campo V ⚽👑*': 100,
'*👑⚽ Leyenda del Campo IV ⚽👑*': 110,
'*👑⚽ Leyenda del Campo III ⚽👑*': 120,
'*👑⚽ Leyenda del Campo II ⚽👑*': 130,
'*👑⚽ Leyenda del Campo I ⚽👑*': 140,
'*🔥👑 Rey del Gol V 👑🔥*': 150,
'*🔥👑 Rey del Gol IV 👑🔥*': 160,
'*🔥👑 Rey del Gol III 👑🔥*': 170,
'*🔥👑 Rey del Gol II 👑🔥*': 180,
'*🔥👑 Rey del Gol I 👑🔥*': 199,
'*💎🌟 Titán del Fútbol V 🌟💎*': 200,
'*💎🌟 Titán del Fútbol IV 🌟💎*': 225,
'*💎🌟 Titán del Fútbol III 🌟💎*': 250,
'*💎🌟 Titán del Fútbol II 🌟💎*': 275,
'*💎🌟 Titán del Fútbol I 🌟💎*': 299,
'*🔵👑 Guardián del Juego V 👑🔵*': 300,
'*🔵👑 Guardián del Juego IV 👑🔵*': 325,
'*🔵👑 Guardián del Juego III 👑🔵*': 350,
'*🔵👑 Guardián del Juego II 👑🔵*': 375,
'*🔵👑 Guardián del Juego I 👑🔵*': 399,
'*⚽🔥 Maestro de la Estrategia V 🔥⚽*': 400,
'*⚽🔥 Maestro de la Estrategia IV 🔥⚽*': 425,
'*⚽🔥 Maestro de la Estrategia III 🔥⚽*': 450,
'*⚽🔥 Maestro de la Estrategia II 🔥⚽*': 475,
'*⚽🔥 Maestro de la Estrategia I 🔥⚽*': 499,
'*🌟🔵 Señor del Balón V 🔵🌟*': 500,
'*🌟🔵 Señor del Balón IV 🔵🌟*': 525,
'*🌟🔵 Señor del Balón III 🔵🌟*': 550,
'*🌟🔵 Señor del Balón II 🔵🌟*': 575,
'*🌟🔵 Señor del Balón I 🔵🌟*': 599,
'*👑⚽ Héroe Inmortal V ⚽👑*': 600,
'*👑⚽ Héroe Inmortal IV ⚽👑*': 625,
'*👑⚽ Héroe Inmortal III ⚽👑*': 650,
'*👑⚽ Héroe Inmortal II ⚽👑*': 675,
'*👑⚽ Héroe Inmortal I ⚽👑*': 699,
'*🔥🚀 Maestro del Deporte V 🚀🔥*': 700,
'*🔥🚀 Maestro del Deporte IV 🚀🔥*': 725,
'*🔥🚀 Maestro del Deporte III 🚀🔥*': 750,
'*🔥🚀 Maestro del Deporte II 🚀🔥*': 775,
'*🔥🚀 Maestro del Deporte I 🚀🔥*': 799,
'*💎✨ Sabio del Fútbol V ✨💎*': 800,
'*💎✨ Sabio del Fútbol IV ✨💎*': 825,
'*💎✨ Sabio del Fútbol III ✨💎*': 850,
'*💎✨ Sabio del Fútbol II ✨💎*': 875,
'*💎✨ Sabio del Fútbol I ✨💎*': 899,
'*🌟⚽ Viajero del Deporte V ⚽🌟*': 900,
'*🌟⚽ Viajero del Deporte IV ⚽🌟*': 925,
'*🌟⚽ Viajero del Deporte III ⚽🌟*': 950,
'*🌟⚽ Viajero del Deporte II ⚽🌟*': 975,
'*🌟⚽ Viajero del Deporte I ⚽🌟*': 999,
'*👑🔵 Deidad del Estadio V 🔵👑*': 1000,
'*👑🔵 Deidad del Estadio IV 🔵👑*': 2000,
'*👑🔵 Deidad del Estadio III 🔵👑*': 3000,
'*👑🔵 Deidad del Estadio II 🔵👑*': 4000,
'*👑🔵 Deidad del Estadio I 🔵👑*': 5000,
'*⚽🔥👑 Gran Leyenda de Blue Lock 👑🔥⚽*': 10000,
}

let handler = m => m
handler.before = async function (m, { conn }) {
    
    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
    let user = global.db.data.users[m.sender]
    
    let level = user.level
    let before = user.level * 1
    
    while (canLevelUp(user.level, user.exp, global.multiplier)) 
        user.level++
    
    if (before !== user.level) {
        let especial = 'coin'
        let especial2 = 'exp'
        let especialCant = Math.floor(Math.random() * (100 - 10 + 1)) + 10
        let especialCant2 = Math.floor(Math.random() * (100 - 10 + 1)) + 10

        if (user.level % 5 === 0) {
            user[especial] += especialCant
            user[especial2] += especialCant2
        }
    }

    let role = (Object.entries(roles).sort((a, b) => b[1] - a[1]).find(([, minLevel]) => level >= minLevel) || Object.entries(roles)[0])[0]
    user.role = role

    return !0
}

export default handler