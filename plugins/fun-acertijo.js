import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys'

// Objeto global para almacenar acertijos activos por chat/usuario
global.acertijosActivos = global.acertijosActivos || {};

var handler = async (m, { conn, text, usedPrefix, command }) => {
    const chatId = m.chat;
    const userId = m.sender;
    
    // DEBUG: Ver qué comando llega
    console.log('Comando recibido:', command, 'Texto:', text);
    
    // Comando: acertijo
    if (command === 'acertijo' || command === 'riddle') {
        // Iniciar nuevo acertijo
        if (global.acertijosActivos[chatId]) {
            return conn.sendMessage(m.chat, { 
                text: `❌ *Ya hay un acertijo activo en este chat*\n\n` +
                      `Pregunta: *${global.acertijosActivos[chatId].pregunta}*\n\n` +
                      `Para responder escribe directamente:\n` +
                      `*${global.acertijosActivos[chatId].respuesta.charAt(0).toUpperCase()}...* o usa:\n` +
                      `• *${usedPrefix}adivina [respuesta]*\n` +
                      `• *${usedPrefix}pista* para ayuda\n` +
                      `• *${usedPrefix}rendirse* para rendirte` 
            }, { quoted: m });
        }

        // Obtener categoría si se especificó
        const categoria = text ? text.toLowerCase().trim() : null;
        let acertijo;
        
        if (categoria && categoria !== '') {
            const acertijosCategoria = global.acertijos.filter(a => a.categoria === categoria);
            if (acertijosCategoria.length > 0) {
                acertijo = pickRandom(acertijosCategoria);
            } else {
                acertijo = pickRandom(global.acertijos);
                await conn.sendMessage(m.chat, { 
                    text: `⚠️ *Categoría "${categoria}" no encontrada*\nTe doy un acertijo aleatorio en su lugar.` 
                }, { quoted: m });
            }
        } else {
            acertijo = pickRandom(global.acertijos);
        }

        // Guardar acertijo activo
        global.acertijosActivos[chatId] = {
            ...acertijo,
            intentos: 0,
            timestamp: Date.now(),
            userId: userId,
            pistasUsadas: []
        };

        // Enviar acertijo
        const mensajeAcertijo = `🎯 *ACERTIJO #${acertijo.id}*\n\n` +
                               `📝 *Pregunta:*\n"${acertijo.pregunta}"\n\n` +
                               `📂 *Categoría:* ${acertijo.categoria}\n` +
                               `⏰ *Tiempo:* 5 minutos\n\n` +
                               `🔍 *¿Cómo responder?*\n` +
                               `1. Escribe directamente tu respuesta\n` +
                               `   Ejemplo: *pera*\n\n` +
                               `2. O usa el comando:\n` +
                               `   *${usedPrefix}adivina [respuesta]*\n\n` +
                               `💡 *Otros comandos:*\n` +
                               `• ${usedPrefix}pista - Obtener ayuda\n` +
                               `• ${usedPrefix}rendirse - Ver respuesta\n` +
                               `• ${usedPrefix}categorias - Ver categorías`;

        await conn.sendMessage(m.chat, { text: mensajeAcertijo }, { quoted: m });

        // Eliminar acertijo después de 5 minutos
        setTimeout(() => {
            if (global.acertijosActivos[chatId]) {
                conn.sendMessage(chatId, { 
                    text: `⏰ *Tiempo agotado*\n\nEl acertijo ha expirado. La respuesta era: *${global.acertijosActivos[chatId].respuesta}*\n\nUsa ${usedPrefix}acertijo para un nuevo acertijo.`
                });
                delete global.acertijosActivos[chatId];
            }
        }, 5 * 60 * 1000);

        return;
    }
    
    // Comando: adivina
    if (command === 'adivina' || command === 'guess') {
        const acertijoActivo = global.acertijosActivos[chatId];
        if (!acertijoActivo) {
            return conn.sendMessage(m.chat, { 
                text: `❌ *No hay ningún acertijo activo*\n\nUsa ${usedPrefix}acertijo para comenzar uno.` 
            }, { quoted: m });
        }

        const respuestaUsuario = text ? text.toLowerCase().trim() : '';
        if (!respuestaUsuario) {
            return conn.sendMessage(m.chat, { 
                text: `⚠️ *Por favor, escribe tu respuesta*\n\nEjemplo: *${usedPrefix}adivina pera*\n\nO simplemente escribe: *pera*` 
            }, { quoted: m });
        }

        acertijoActivo.intentos++;

        // Verificar si se excedieron los intentos
        if (acertijoActivo.intentos > 5) {
            delete global.acertijosActivos[chatId];
            return conn.sendMessage(m.chat, { 
                text: `❌ *Has excedido el límite de intentos*\n\nLa respuesta era: *${acertijoActivo.respuesta}*\n\nUsa ${usedPrefix}acertijo para un nuevo acertijo.` 
            }, { quoted: m });
        }

        if (respuestaUsuario === acertijoActivo.respuesta.toLowerCase()) {
            // Respuesta correcta
            const mensajeCorrecto = `✅ *¡CORRECTO!* 🎉\n\n` +
                                   `🎯 *Respuesta:* ${acertijoActivo.respuesta}\n` +
                                   `📊 *Intentos:* ${acertijoActivo.intentos}\n` +
                                   `📂 *Categoría:* ${acertijoActivo.categoria}\n\n` +
                                   `¡Felicidades *${m.pushName || 'participante'}*! 👏`;

            delete global.acertijosActivos[chatId];
            return conn.sendMessage(m.chat, { text: mensajeCorrecto }, { quoted: m });
        } else {
            // Respuesta incorrecta
            return conn.sendMessage(m.chat, { 
                text: `❌ *Respuesta incorrecta*\n\n` +
                     `📊 Intentos: ${acertijoActivo.intentos}/5\n` +
                     `💡 Usa *${usedPrefix}pista* para una ayuda\n\n` +
                     `O escribe otra respuesta directamente.` 
            }, { quoted: m });
        }
    }
    
    // Comando: pista
    if (command === 'pista' || command === 'hint') {
        const acertijoActivo = global.acertijosActivos[chatId];
        if (!acertijoActivo) {
            return conn.sendMessage(m.chat, { 
                text: `❌ *No hay ningún acertijo activo*\n\nUsa ${usedPrefix}acertijo para comenzar uno.` 
            }, { quoted: m });
        }

        const pistasDisponibles = acertijoActivo.pistas.filter(
            p => !acertijoActivo.pistasUsadas.includes(p)
        );

        if (pistasDisponibles.length === 0) {
            return conn.sendMessage(m.chat, { 
                text: `ℹ️ *Ya has usado todas las pistas*\n\n` +
                     `La respuesta comienza con: *${acertijoActivo.respuesta.charAt(0).toUpperCase()}*` 
            }, { quoted: m });
        }

        const pista = pistasDisponibles[0];
        acertijoActivo.pistasUsadas.push(pista);

        return conn.sendMessage(m.chat, { 
            text: `💡 *PISTA #${acertijoActivo.pistasUsadas.length}:*\n${pista}\n\n` +
                 `📊 Pistas usadas: ${acertijoActivo.pistasUsadas.length}/${acertijoActivo.pistas.length}` 
        }, { quoted: m });
    }
    
    // Comando: rendirse
    if (command === 'rendirse' || command === 'giveup') {
        const acertijoActivo = global.acertijosActivos[chatId];
        if (!acertijoActivo) {
            return conn.sendMessage(m.chat, { 
                text: `❌ *No hay ningún acertijo activo*` 
            }, { quoted: m });
        }

        const mensajeRendicion = `😔 *Te has rendido*\n\n` +
                                `🎯 *Respuesta:* ${acertijoActivo.respuesta}\n` +
                                `📂 *Categoría:* ${acertijoActivo.categoria}\n` +
                                `📊 *Intentos realizados:* ${acertijoActivo.intentos}\n\n` +
                                `Usa *${usedPrefix}acertijo* para intentar con otro.`;

        delete global.acertijosActivos[chatId];
        return conn.sendMessage(m.chat, { text: mensajeRendicion }, { quoted: m });
    }
    
    // Comando: categorias
    if (command === 'categorias' || command === 'categories') {
        const categorias = [...new Set(global.acertijos.map(a => a.categoria))];
        let mensajeCategorias = `📂 *CATEGORÍAS DISPONIBLES:*\n\n`;

        categorias.forEach(cat => {
            const cantidad = global.acertijos.filter(a => a.categoria === cat).length;
            mensajeCategorias += `• *${cat.charAt(0).toUpperCase() + cat.slice(1)}* (${cantidad} acertijos)\n`;
        });

        mensajeCategorias += `\n✨ *Uso:* ${usedPrefix}acertijo [categoría]\n` +
                            `Ejemplo: *${usedPrefix}acertijo frutas*`;

        return conn.sendMessage(m.chat, { text: mensajeCategorias }, { quoted: m });
    }
    
    // Comando: ayudaacertijo
    if (command === 'ayudaacertijo' || command === 'helpacertijo') {
        const mensajeAyuda = `🎯 *AYUDA DE ACERTIJOS*\n\n` +
                           `*Comandos disponibles:*\n\n` +
                           `• *${usedPrefix}acertijo* - Nuevo acertijo aleatorio\n` +
                           `• *${usedPrefix}acertijo [categoría]* - Acertijo específico\n` +
                           `• *${usedPrefix}adivina [respuesta]* - Responder\n` +
                           `• *${usedPrefix}pista* - Obtener una pista\n` +
                           `• *${usedPrefix}rendirse* - Rendirse\n` +
                           `• *${usedPrefix}categorias* - Ver categorías\n\n` +
                           `📝 *O simplemente escribe tu respuesta directamente*`;

        return conn.sendMessage(m.chat, { text: mensajeAyuda }, { quoted: m });
    }
}

// Handler para responder directamente (sin comando)
export async function all(m, { conn, text }) {
    const chatId = m.chat;
    
    // Si hay un acertijo activo y el mensaje no es un comando
    if (global.acertijosActivos[chatId] && text && !text.startsWith('.')) {
        const acertijoActivo = global.acertijosActivos[chatId];
        const respuestaUsuario = text.toLowerCase().trim();
        
        // Ignorar si es muy corto (menos de 2 letras)
        if (respuestaUsuario.length < 2) return;
        
        acertijoActivo.intentos++;

        if (acertijoActivo.intentos > 5) {
            const mensaje = `❌ *Has excedido el límite de intentos*\n\nLa respuesta era: *${acertijoActivo.respuesta}*\n\nUsa .acertijo para un nuevo acertijo.`;
            delete global.acertijosActivos[chatId];
            return conn.sendMessage(chatId, { text: mensaje }, { quoted: m });
        }

        if (respuestaUsuario === acertijoActivo.respuesta.toLowerCase()) {
            // Respuesta correcta
            const mensajeCorrecto = `✅ *¡CORRECTO!* 🎉\n\n` +
                                   `🎯 *Respuesta:* ${acertijoActivo.respuesta}\n` +
                                   `📊 *Intentos:* ${acertijoActivo.intentos}\n` +
                                   `📂 *Categoría:* ${acertijoActivo.categoria}\n\n` +
                                   `¡Felicidades *${m.pushName || 'participante'}*! 👏`;

            delete global.acertijosActivos[chatId];
            return conn.sendMessage(chatId, { text: mensajeCorrecto }, { quoted: m });
        } else {
            // Respuesta incorrecta
            return conn.sendMessage(chatId, { 
                text: `❌ *Respuesta incorrecta*\n\n` +
                     `📊 Intentos: ${acertijoActivo.intentos}/5\n` +
                     `💡 Usa *.pista* para una ayuda` 
            }, { quoted: m });
        }
    }
}

handler.help = ['acertijo', 'adivina [respuesta]', 'pista', 'rendirse', 'categorias', 'ayudaacertijo']
handler.tags = ['games', 'fun']
handler.command = ['acertijo', 'riddle', 'adivina', 'guess', 'pista', 'hint', 'rendirse', 'giveup', 'categorias', 'categories', 'ayudaacertijo', 'helpacertijo']
handler.fail = null
handler.exp = 0
handler.group = true
handler.register = true
handler.limit = true

export default handler

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)]
}

// Base de datos de acertijos
global.acertijos = [
    {
        id: 1,
        pregunta: "Blanco por dentro, verde por fuera. Si quieres que te lo diga, espera.",
        respuesta: "pera",
        pistas: ["Es una fruta", "Tiene forma de campana", "Comienza con P"],
        categoria: "frutas"
    },
    {
        id: 2,
        pregunta: "Tiene dientes y no come, tiene cabeza y no es hombre.",
        respuesta: "ajo",
        pistas: ["Se usa en la cocina", "Tiene un olor fuerte", "Es un condimento"],
        categoria: "alimentos"
    },
    {
        id: 3,
        pregunta: "Oro parece, plata no es. El que no lo adivine, bien tonto es.",
        respuesta: "plátano",
        pistas: ["Es una fruta", "Tiene forma curva", "Es amarillo"],
        categoria: "frutas"
    },
    {
        id: 4,
        pregunta: "Largo como un brazo, duro como piedra, lo abres y no lo comes.",
        respuesta: "hueso",
        pistas: ["Los perros lo muerden", "Está dentro del cuerpo", "Da estructura"],
        categoria: "cuerpo"
    },
    {
        id: 5,
        pregunta: "Sin alas vuela, sin ojos llora, sin boca canta.",
        respuesta: "viento",
        pistas: ["No se puede ver", "Mueve las hojas", "Hace frío"],
        categoria: "naturaleza"
    },
    {
        id: 6,
        pregunta: "Tengo llaves pero no abro puertas, tengo espacio pero no tengo habitaciones, puedes entrar pero no salir.",
        respuesta: "teclado",
        pistas: ["Lo usas con la computadora", "Tiene letras y números", "Es un periférico"],
        categoria: "tecnologia"
    },
    {
        id: 7,
        pregunta: "Redondo como la luna, blanco como la cal, todos me preguntan y yo siempre callo.",
        respuesta: "huevo",
        pistas: ["Es un alimento", "Lo ponen las gallinas", "Tiene yema"],
        categoria: "alimentos"
    },
    {
        id: 8,
        pregunta: "Un león en el zoológico, el rey de la jungla sin corona, pero no es animal ni hombre.",
        respuesta: "león",
        pistas: ["Es un felino", "Tiene melena", "Ruge fuerte"],
        categoria: "animales"
    }
];