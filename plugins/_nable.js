import { createHash } from 'crypto' 
import fetch from 'node-fetch'

const handler = async (m, { conn, usedPrefix, command, args, isOwner, isAdmin, isROwner }) => {
  let chat = global.db.data.chats[m.chat]
  let user = global.db.data.users[m.sender]
  let bot = global.db.data.settings[conn.user.jid] || {}
  let type = command.toLowerCase()
  let isAll = false, isUser = false

  const typeMap = {
    'antilink': 'antiLink',
    'antilink2': 'antiLink2',
    'antibot': 'antiBot',
    'antibots': 'antiBot',
    'antibot2': 'antiBot2',
    'antisubbots': 'antiBot2',
    'autoaceptar': 'autoAceptar',
    'aceptarauto': 'autoAceptar',
    'autorechazar': 'autoRechazar',
    'rechazarauto': 'autoRechazar',
    'antiprivado': 'antiPrivate',
    'antiprivate': 'antiPrivate'
  }

  let dbKey = typeMap[type] || type
  let isEnable = chat[dbKey] || bot[dbKey] || false

  const validFunctions = [
    'welcome', 'bienvenida',
    'antibot', 'antibots', 
    'autoaceptar', 'aceptarauto',
    'autorechazar', 'rechazarauto',
    'autoresponder', 'autorespond',
    'antisubbots', 'antibot2',
    'modoadmin', 'soladmin',
    'reaction', 'reaccion',
    'nsfw', 'modohorny',
    'detect', 'avisos',
    'antilink', 'antilink2',
    'antifake',
    'antiarabes', 'antiarab',
    'antitoxic', 'antitoxics', 
    'autolevelup', 'autonivel',
    'antispam',
    'antiprivado', 'antiprivate',
    'restrict', 'restringir',
    'jadibotmd', 'modejadibot',
    'subbots',
    'audios', 'audiosmenu'
  ]

  const isValidFunction = (funcName) => {
    return validFunctions.includes(funcName.toLowerCase())
  }

  if (command === 'enable') {
    if (args[0]) {
      type = args[0].toLowerCase()

      if (!isValidFunction(type)) {
        return conn.reply(m.chat, `❌ *Error:* La función "*${type}*" no existe.\n\n> Use *${usedPrefix}enable* sin parámetros para ver las funciones disponibles.`, m)
      }

      isEnable = true
    } else {
      const funcionesDisponibles = [
        '⚽ **FUNCIONES DISPONIBLES PARA ACTIVAR:**\n',
        '┌─⊷ **EQUIPO**',
        '│ • welcome/bienvenida - Mensaje de bienvenida',
        '│ • antibot/antibots - Anti bots',
        '│ • autoaceptar - Auto aceptar jugadores',
        '│ • autorechazar - Auto rechazar jugadores',
        '│ • autoresponder - Respuestas automáticas',
        '│ • antisubbots/antibot2 - Anti sub-bots',
        '│ • modoadmin/soladmin - Solo capitanes',
        '│ • reaction/reaccion - Reacciones automáticas',
        '│ • nsfw/modohorny - Contenido NSFW',
        '│ • detect/avisos - Detectar cambios del equipo',
        '│ • antilink - Anti enlaces',
        '│ • antifake - Anti números falsos',
        '│ • antiarabes - Anti números árabes/spam',
        '│ • antitoxic - Anti lenguaje tóxico/ofensivo',
        '│ • autolevelup/autonivel - Subir nivel automático',
        '│ • antispam - Anti spam',
        '│ • audios - Audios automáticos por palabras',
        '├─⊷ **BOT GLOBAL**',
        '│ • antiprivado/antiprivate - Anti chat privado',
        '│ • restrict/restringir - Modo restricción',
        '│ • jadibotmd/modejadibot - Modo jadibot',
        '│ • subbots - Sub-bots',
        '└─────────────────',
        '',
        `> Uso: *${usedPrefix}enable [función]*`,
        `> Ejemplo: *${usedPrefix}enable antilink*`
      ].join('\n')

      return conn.reply(m.chat, funcionesDisponibles, m)
    }
  } else if (command === 'disable') {
    if (args[0]) {
      type = args[0].toLowerCase()

      if (!isValidFunction(type)) {
        return conn.reply(m.chat, `❌ *Error:* La función "*${type}*" no existe.\n\n> Use *${usedPrefix}disable* sin parámetros para ver las funciones disponibles.`, m)
      }

      isEnable = false
    } else {
      const funcionesDisponibles = [
        '⚽ **FUNCIONES DISPONIBLES PARA DESACTIVAR:**\n',
        '┌─⊷ **EQUIPO**',
        '│ • welcome/bienvenida - Mensaje de bienvenida',
        '│ • antibot/antibots - Anti bots',
        '│ • autoaceptar - Auto aceptar jugadores',
        '│ • autorechazar - Auto rechazar jugadores',
        '│ • autoresponder - Respuestas automáticas',
        '│ • antisubbots/antibot2 - Anti sub-bots',
        '│ • modoadmin/soladmin - Solo capitanes',
        '│ • reaction/reaccion - Reacciones automáticas',
        '│ • nsfw/modohorny - Contenido NSFW',
        '│ • detect/avisos - Detectar cambios del equipo',
        '│ • antilink - Anti enlaces',
        '│ • antifake - Anti números falsos',
        '│ • antiarabes - Anti números árabes/spam',
        '│ • antitoxic - Anti lenguaje tóxico/ofensivo',
        '│ • autolevelup/autonivel - Subir nivel automático',
        '│ • antispam - Anti spam',
        '│ • audios - Audios automáticos por palabras',
        '├─⊷ **BOT GLOBAL**',
        '│ • antiprivado/antiprivate - Anti chat privado',
        '│ • restrict/restringir - Modo restricción',
        '│ • jadibotmd/modejadibot - Modo jadibot',
        '│ • subbots - Sub-bots',
        '└─────────────────',
        '',
        `> Uso: *${usedPrefix}disable [función]*`,
        `> Ejemplo: *${usedPrefix}disable antilink*`
      ].join('\n')

      return conn.reply(m.chat, funcionesDisponibles, m)
    }
  } else if (args[0] === 'on' || args[0] === 'enable') {

    if (!isValidFunction(type)) {
      return conn.reply(m.chat, `❌ *Error:* La función "*${type}*" no existe.\n\n> Funciones disponibles: ${validFunctions.filter((f, i, arr) => arr.indexOf(f) === i).slice(0, 10).join(', ')}...`, m)
    }
    isEnable = true;
  } else if (args[0] === 'off' || args[0] === 'disable') {

    if (!isValidFunction(type)) {
      return conn.reply(m.chat, `❌ *Error:* La función "*${type}*" no existe.\n\n> Funciones disponibles: ${validFunctions.filter((f, i, arr) => arr.indexOf(f) === i).slice(0, 10).join(', ')}...`, m)
    }
    isEnable = false
  } else {

    if (!isValidFunction(type)) {
      return conn.reply(m.chat, `❌ *Error:* La función "*${type}*" no existe.\n\n> Use *${usedPrefix}enable* para ver las funciones disponibles.`, m)
    }
    const estado = isEnable ? '✓ Activado' : '✗ Desactivado'
    return conn.reply(m.chat, `⚽ Un capitán puede activar o desactivar el *${command}* utilizando:\n\n> ✐ *${usedPrefix}${command} on* para activar.\n> ✐ *${usedPrefix}${command} off* para desactivar.\n> ✐ *${usedPrefix}enable ${command}* para activar.\n> ✐ *${usedPrefix}disable ${command}* para desactivar.\n\n✧ Estado actual » *${estado}*`, m, global.rcanal)
  }

  switch (type) {
    case 'welcome':
    case 'bienvenida':
      if (!m.isGroup) {
        if (!isOwner) {
          global.dfail('group', m, conn)
          throw false
        }
      } else if (!isAdmin) {
        global.dfail('admin', m, conn)
        throw false
      }
      chat.welcome = isEnable
      break  

    case 'antiprivado':
    case 'antiprivate':
      isAll = true
      if (!isOwner) {
        global.dfail('rowner', m, conn)
        throw false
      }
      bot.antiPrivate = isEnable
      break

    case 'audios':
    case 'audiosmenu':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.audios = isEnable
      break

    case 'restrict':
    case 'restringir':
      isAll = true
      if (!isOwner) {
        global.dfail('rowner', m, conn)
        throw false
      }
      bot.restrict = isEnable
      break

    case 'antibot':
    case 'antibots':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.antiBot = isEnable
      break

    case 'autoaceptar':
    case 'aceptarauto':
      if (!m.isGroup) {
        if (!isOwner) {
          global.dfail('group', m, conn)
          throw false
        }
      } else if (!isAdmin) {
        global.dfail('admin', m, conn)
        throw false
      }
      chat.autoAceptar = isEnable
      break

    case 'autorechazar':
    case 'rechazarauto':
      if (!m.isGroup) {
        if (!isOwner) {
          global.dfail('group', m, conn)
          throw false
        }
      } else if (!isAdmin) {
        global.dfail('admin', m, conn)
        throw false
      }
      chat.autoRechazar = isEnable
      break

    case 'autoresponder':
    case 'autorespond':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.autoresponder = isEnable
      
      // AÑADIDO: Controlar ISAGI_ACTIVE
      if (typeof global.ISAGI_ACTIVE !== 'undefined') {
        global.ISAGI_ACTIVE = isEnable
      }
      
      // AÑADIDO: Enviar mensaje cuando se desactiva
      if (!isEnable && m.chat) {
        await conn.sendMessage(m.chat, {
          text: `⚽ La función *autoresponder* se *desactivó* para este equipo`
        }, { quoted: m })
      }
      break

    case 'antisubbots':
    case 'antibot2':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.antiBot2 = isEnable
      break

    case 'modoadmin':
    case 'soloadmin':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn);
          throw false;
        }
      }
      chat.modoadmin = isEnable;
      break;

    case 'reaction':
    case 'reaccion':
      if (!m.isGroup) {
        if (!isOwner) {
          global.dfail('group', m, conn)
          throw false
        }
      } else if (!isAdmin) {
        global.dfail('admin', m, conn)
        throw false
      }
      chat.reaction = isEnable
      break

    case 'nsfw':
    case 'modohorny':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.nsfw = isEnable
      break

    case 'jadibotmd':
    case 'modejadibot':
      isAll = true
      if (!isOwner) {
        global.dfail('rowner', m, conn)
        throw false
      }
      bot.jadibotmd = isEnable
      break

    case 'detect':
    case 'avisos':
      if (!m.isGroup) {
        if (!isOwner) {
          global.dfail('group', m, conn)
          throw false
        }
      } else if (!isAdmin) {
        global.dfail('admin', m, conn)
        throw false
      }
      chat.detect = isEnable
      break

    case 'antilink':
      if (!m.isGroup) {
        return conn.reply(m.chat, '⚽ Este comando debe usarse dentro del equipo que desea configurar. Use el comando en el equipo objetivo.', m)
      }
      if (!(isAdmin || isOwner)) {
        global.dfail('admin', m, conn)
        throw false
      }
      chat.antiLink = isEnable
      break

    case 'antilink2':
      if (!m.isGroup) {
        return conn.reply(m.chat, '⚽ Este comando debe usarse dentro del equipo que desea configurar. Use el comando en el equipo objetivo.', m)
      }
      if (!(isAdmin || isOwner)) {
        global.dfail('admin', m, conn)
        throw false
      }
      chat.antiLink2 = isEnable
      break

    case 'antifake':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.antifake = isEnable
      break

    case 'antiarabes':
    case 'antiarab':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.antiarabes = isEnable
      break

    case 'antitoxic':
    case 'antitoxics':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.antitoxic = isEnable
      break

    case 'autolevelup':
    case 'autonivel':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.autolevelup = isEnable
      break

    case 'antispam':
      if (m.isGroup) {
        if (!(isAdmin || isOwner)) {
          global.dfail('admin', m, conn)
          throw false
        }
      }
      chat.antispam = isEnable
      break

    case 'subbots':
      isAll = true
      if (!isOwner) {
        global.dfail('rowner', m, conn)
        throw false
      }
      bot.subbots = isEnable
      break
  }

  if (isAll) {
    bot[dbKey] = isEnable
  } else {
    chat[dbKey] = isEnable
  }

  conn.reply(m.chat, `⚽ La función *${type}* se *${isEnable ? 'activó' : 'desactivó'}* ${isAll ? 'para este Bot' : isUser ? '' : 'para este equipo'}`, m, rcanal);
};

handler.help = ['welcome', 'bienvenida', 'antiprivado', 'antiprivate', 'restrict', 'restringir', 'autolevelup', 'autonivel', 'antibot', 'antibots', 'autoaceptar', 'aceptarauto', 'autorechazar', 'rechazarauto', 'autoresponder', 'autorespond', 'antisubbots', 'antibot2', 'modoadmin', 'soloadmin', 'reaction', 'reaccion', 'nsfw', 'modohorny', 'antispam', 'jadibotmd', 'modejadibot', 'subbots', 'detect', 'avisos', 'antilink', 'antilink2', 'antifake', 'antiarabes', 'antitoxic', 'audios', 'enable', 'disable']
handler.tags = ['nable'];
handler.command = ['welcome', 'bienvenida', 'antiprivado', 'antiprivate', 'restrict', 'restringir', 'autolevelup', 'autonivel', 'antibot', 'antibots', 'autoaceptar', 'aceptarauto', 'autorechazar', 'rechazarauto', 'autoresponder', 'autorespond', 'antisubbots', 'antibot2', 'modoadmin', 'soloadmin', 'reaction', 'reaccion', 'nsfw', 'modohorny', 'antispam', 'jadibotmd', 'modejadibot', 'subbots', 'detect', 'avisos', 'antilink', 'antilink2', 'antifake', 'antiarabes', 'antitoxic', 'audios', 'enable', 'disable']

export default handler