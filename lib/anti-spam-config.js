/* 
⚽🏃‍♂️ Configuraciones Anti-Spam - Blue Lock Bot
Código creado por Brauliovh3 
https://github.com/Brauliovh3/HATSUNE-MIKU.git 
⚽ Configuraciones para evitar que el bot sea reportado 🏃‍♂️🔥
*/

// Configuraciones globales para evitar detección de spam
global.antiSpamConfig = {
    // Delays y tiempos de espera
    delays: {
        minResponseTime: 800,     // Mínimo 0.8 segundos antes de responder
        maxResponseTime: 3000,    // Máximo 3 segundos antes de responder
        betweenMessages: 1500,    // 1.5 segundos entre mensajes consecutivos
        heavyCommands: 5000,      // 5 segundos para comandos pesados (descargas, IA)
        mediaCommands: 3000       // 3 segundos para comandos de media
    },

    // Límites por usuario
    userLimits: {
        commandsPerMinute: 6,     // Máximo 6 comandos por minuto por usuario
        messagesPerHour: 50,      // Máximo 50 mensajes por hora por usuario
        consecutiveCommands: 3,   // Máximo 3 comandos seguidos sin pausa
        cooldownAfterLimit: 30000 // 30 segundos de cooldown después del límite
    },

    // Límites por chat
    chatLimits: {
        messagesPerMinute: 15,    // Máximo 15 respuestas por minuto por chat
        messagesPerHour: 200,     // Máximo 200 respuestas por hora por chat
        maxActiveChats: 50        // Máximo 50 chats activos simultáneamente
    },

    // Configuraciones de presencia
    presence: {
        enabled: true,            // Habilitar actualizaciones de presencia
        probability: 0.3,         // 30% de probabilidad de mostrar presencia
        randomDelay: true,        // Usar delays aleatorios para presencia
        types: ['composing', 'available'] // Tipos de presencia permitidos
    },

    // Comandos que requieren más delay
    heavyCommands: [
        'play', 'play2', 'facebook', 'instagram', 'tiktok', 'youtube',
        'ytmp3', 'ytmp4', 'spotify', 'apk', 'mega', 'mediafire',
        'dalle', 'flux', 'gemini', 'gpt', 'ia', 'simi'
    ],

    // Mensajes de limite alcanzado
    limitMessages: [
        '⚽ ¡Espera un momento! Isagi necesita analizar la jugada... 🏃‍♂️',
        '🏃‍♂️ Dame unos segundos para encontrar la mejor línea de pase... 🔥',
        '⚽ ¡Wow! Estás muy intenso. Pequeña pausa táctica... 🔥',
        '🔥 Un momento, déjame visualizar la jugada perfecta... ⚽',
        '🏃‍♂️ Pequeña pausa para no saturar el campo... ⚽'
    ],

    // Configuraciones para autoresponder
    autoresponder: {
        enabled: true,
        probability: 0.7,         // 70% de probabilidad de responder automáticamente
        minDelay: 2000,           // Mínimo 2 segundos de delay
        maxDelay: 8000,           // Máximo 8 segundos de delay
        maxLength: 150            // Máximo 150 caracteres en respuestas automáticas
    }
}

// Función para obtener delay aleatorio
global.getRandomDelay = (min = 800, max = 3000) => {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

// Función para verificar si un comando es pesado
global.isHeavyCommand = (command) => {
    return global.antiSpamConfig.heavyCommands.includes(command.toLowerCase())
}

// Función para obtener mensaje de límite aleatorio
global.getRandomLimitMessage = () => {
    const messages = global.antiSpamConfig.limitMessages
    return messages[Math.floor(Math.random() * messages.length)]
}

export default global.antiSpamConfig