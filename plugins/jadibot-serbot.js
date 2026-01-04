const { useMultiFileAuthState, DisconnectReason, makeCacheableSignalKeyStore, fetchLatestBaileysVersion, Browsers } = (await import("@whiskeysockets/baileys"));
import qrcode from "qrcode"
import NodeCache from "node-cache"
import fs from "fs"
import path from "path"
import pino from 'pino'
import chalk from 'chalk'
import util from 'util' 
import * as ws from 'ws'
const { child, spawn, exec } = await import('child_process')
const { CONNECTING, OPEN, CLOSING, CLOSED } = ws
import { makeWASocket } from '../lib/simple.js'
import { fileURLToPath } from 'url'

let crm1 = "Y2QgcGx1Z2lucy"
let crm2 = "A7IG1kNXN1b"
let crm3 = "SBpbmZvLWRvbmFyLmpz"
let crm4 = "IF9hdXRvcmVzcG9uZGVyLmpzIGluZm8tYm90Lmpz"
let drm1 = ""
let drm2 = ""
let rtx = "*⚽🔥 Isagi Yoichi - Bot 🔥⚽*\n\n🎯 Conexión Sub-Bot Modo QR\n\n⚽ Con otro celular o en la PC escanea este QR para convertirte en un *Sub-Bot* PERSISTENTE.\n\n`1` » Haga clic en los tres puntos, luego en 'Vincular un dispositivo'.\n\n`2` » Escanee el código QR que aparece aquí.\n\n🔥 *MEJORADO:* Sesión persistente con reconexión automática hasta 10 intentos."
let rtx2 = "*⚽🔥 Isagi Yoichi - Bot 🔥⚽*\n\n🎯 Conexión Sub-Bot Modo Código\n\n⚽ Usa este Código para convertirte en un *Sub-Bot* PERSISTENTE.\n\n`1` » Haga clic en los tres puntos, luego en 'Vincular un dispositivo'.\n\n`2` » Presione 'Vincular con código', ingrese el código que aparecerá abajo.\n\n🔥 *MEJORADO:* Sesión persistente con reconexión automática hasta 10 intentos."

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const mikuJBOptions = {}
if (global.conns instanceof Array) console.log()
else global.conns = []

const SUBBOT_VERBOSE = (process.env.SUBBOT_VERBOSE === 'true') || false
const vlog = (...args) => { if (SUBBOT_VERBOSE) console.log(...args) }

if (!global._subbotSessionErrorHandlerInstalled) {
  global._subbotSessionErrorHandlerInstalled = true
  process.on('unhandledRejection', async (reason) => {
    try {
      if (reason && reason.message && reason.message.includes('SessionError: No sessions')) {
        console.log(chalk.red('🚨 Capturado global unhandledRejection: SessionError: No sessions'))
        
        for (const s of global.conns || []) {
          try {
            if (!s) continue
            if (s.auth && s.auth.keys && typeof s.auth.keys.clear === 'function') {
              await s.auth.keys.clear()
              console.log(chalk.green(`🧹 Cache de sesiones limpiado para +${path.basename(s.user?.jid || 'unknown')}`))
            }
            
            try { s._shouldReconnect = true } catch (e) {}
          } catch (e) {
            console.error('Error limpiando subbot tras unhandledRejection:', e?.message || e)
          }
        }
      }
      
      if (reason && reason.code === 'ENOENT' && reason.path && reason.path.includes('creds.json')) {
        const pathMatch = reason.path.match(/jadi[\/\\]([^\/\\]+)/)
        const sessionId = pathMatch ? pathMatch[1] : 'unknown'
        console.log(chalk.yellow(`⚠️ Error ENOENT capturado para credenciales: ${reason.path}`))
        
        try {
          const sessionPath = pathMatch ? path.join('./jadi', pathMatch[1]) : null
          if (sessionPath && !fs.existsSync(sessionPath)) {
            fs.mkdirSync(sessionPath, { recursive: true })
            console.log(chalk.green(`📁 Directorio recreado para sesión ${sessionId}`))
            
            const subbot = global.conns?.find(s => 
              s && s.user && s.user.jid && s.user.jid.includes(sessionId)
            )
            if (subbot && typeof subbot.credsUpdate === 'function') {
              try {
                await subbot.credsUpdate()
                console.log(chalk.green(`✅ Credenciales guardadas después de recrear directorio para ${sessionId}`))
              } catch (e) {
                console.log(chalk.yellow(`⚠️ No se pudieron guardar credenciales para ${sessionId}: ${e.message}`))
              }
            }
          }
        } catch (e) {
          console.error(chalk.red(`❌ Error manejando ENOENT para ${sessionId}: ${e.message}`))
        }
      }
    } catch (e) {
      console.error('Error en global unhandledRejection handler:', e?.message || e)
    }
  })
}

const RESOURCE_LIMITS = {
  MAX_RAM_MB: 2048,        
  MAX_STORAGE_MB: 4096,    
  MAX_SUBBOTS: 15,         
  CLEANUP_INTERVAL: 30000, 
  DELETE_TIMEOUT: 180000  
}

global.reconnectThrottle = global.reconnectThrottle || {
  lastReconnect: 0,
  activeReconnects: 0,
  maxConcurrentReconnects: 3, 
  minInterval: 15000 
}

setInterval(async () => {
  try {
    if (!global.conns || global.conns.length === 0) return
    
    let cleaned = 0
    const indicesToRemove = []
    
    for (let i = 0; i < global.conns.length; i++) {
      const conn = global.conns[i]
      if (!conn) {
        indicesToRemove.push(i)
        continue
      }
      
      if (conn._shouldDelete || 
          (!conn.user || !conn.user.jid) ||
          (conn.connectionStatus === 'close' && !conn.ws) ||
          (conn.ws && conn.ws.socket && conn.ws.socket.readyState === 3)) { 
        
        const phoneNumber = conn.user?.jid ? cleanPhoneNumber(conn.user.jid) : 'unknown'
        
        try {
          if (conn.ws && typeof conn.ws.close === 'function') {
            conn.ws.close()
          }
          if (conn.ev && typeof conn.ev.removeAllListeners === 'function') {
            conn.ev.removeAllListeners()
          }
         
          ['_keepAliveInterval', '_saveCredsInterval', '_inactivityMonitor', 'heartbeatInterval', '_presenceInterval'].forEach(interval => {
            if (conn[interval]) {
              clearInterval(conn[interval])
              conn[interval] = null
            }
          })
        } catch (e) {}
        
        indicesToRemove.push(i)
        cleaned++
        console.log(chalk.blue(`🗑️ Auto-eliminado SubBot +${phoneNumber} (conexión rota)`))
      }
    }
    
    indicesToRemove.reverse().forEach(index => {
      if (global.conns[index]) {
        global.conns.splice(index, 1)
      }
    })
    
    if (cleaned > 0) {
      console.log(chalk.green(`✅ Limpieza automática: ${cleaned} SubBots eliminados`))
      
      if (global.gc) {
        global.gc()
      }
    }
    
  } catch (error) {
    console.error('Error en limpieza automática:', error.message)
  }
}, RESOURCE_LIMITS.CLEANUP_INTERVAL)

function checkResourceLimits() {
  const activeConnections = global.conns.filter(c => 
    c && c.user && c.ws && c.ws.socket && c.ws.socket.readyState === 1
  ).length
  
  if (activeConnections >= RESOURCE_LIMITS.MAX_SUBBOTS) {
    console.log(chalk.yellow(`⚠️ Límite de SubBots funcionando alcanzado: ${activeConnections}/${RESOURCE_LIMITS.MAX_SUBBOTS}`))
    return false
  }
  
  try {
    const memUsage = process.memoryUsage()
    const memUsedMB = Math.round(memUsage.heapUsed / 1024 / 1024)
    const memPercent = Math.round((memUsage.heapUsed / memUsage.heapTotal) * 100)
    
    if (memPercent > 90) {
      console.log(chalk.red(`⚠️ Memoria crítica: ${memUsedMB}MB (${memPercent}%)`))
      return false
    } else if (memPercent > 75) {
      console.log(chalk.yellow(`⚠️ Memoria alta: ${memUsedMB}MB (${memPercent}%)`))
    }
    
    const jadiPath = path.join(process.cwd(), 'jadi')
    if (fs.existsSync(jadiPath)) {
      const stats = fs.statSync(jadiPath)
      const sizeGB = stats.size / (1024 * 1024 * 1024)
      if (sizeGB > 6) {
        console.log(chalk.yellow(`⚠️ Almacenamiento alto: ${sizeGB.toFixed(2)}GB/6GB`))
      }
    }
  } catch (e) {}
  
  return true
}

function cleanPhoneNumber(phone) {
  if (!phone) return null
  
  let cleaned = phone.replace(/[^0-9]/g, '')
  
  if (cleaned.length < 10) return null

  const countryCodes = ['1', '7', '20', '27', '30', '31', '32', '33', '34', '36', '39', '40', '41', '43', '44', '45', '46', '47', '48', '49', '51', '52', '53', '54', '55', '56', '57', '58', '60', '61', '62', '63', '64', '65', '66', '81', '82', '84', '86', '90', '91', '92', '93', '94', '95', '98', '212', '213', '216', '218', '220', '221', '222', '223', '224', '225', '226', '227', '228', '229', '230', '231', '232', '233', '234', '235', '236', '237', '238', '239', '240', '241', '242', '243', '244', '245', '246', '248', '249', '250', '251', '252', '253', '254', '255', '256', '257', '258', '260', '261', '262', '263', '264', '265', '266', '267', '268', '269', '290', '291', '297', '298', '299', '350', '351', '352', '353', '354', '355', '356', '357', '358', '359', '370', '371', '372', '373', '374', '375', '376', '377', '378', '380', '381', '382', '383', '385', '386', '387', '389', '420', '421', '423', '500', '501', '502', '503', '504', '505', '506', '507', '508', '509', '590', '591', '592', '593', '594', '595', '596', '597', '598', '599', '670', '672', '673', '674', '675', '676', '677', '678', '679', '680', '681', '682', '683', '684', '685', '686', '687', '688', '689', '690', '691', '692', '850', '852', '853', '855', '856', '880', '886', '960', '961', '962', '963', '964', '965', '966', '967', '968', '970', '971', '972', '973', '974', '975', '976', '977', '992', '993', '994', '995', '996', '998']
    
    if (cleaned.length >= 10 && cleaned.length <= 15) {
      console.log(`📱 Número limpiado: ${phone} -> ${cleaned}`)
      return cleaned
    }
  
  return null
}

const NOTIFY_COOLDOWN = 10 * 60 * 1000 
function shouldNotifyUser(jid) {
  try {
    if (!global.db || !global.db.data) return true
    if (!global.db.data.users) global.db.data.users = {}
    if (!global.db.data.users[jid]) global.db.data.users[jid] = {}
    const last = global.db.data.users[jid].subBotLastNotify || 0
    if (Date.now() - last > NOTIFY_COOLDOWN) {
      global.db.data.users[jid].subBotLastNotify = Date.now()
      return true
    }
    return false
  } catch (e) {
    console.error('Error en shouldNotifyUser:', e)
    return true
  }
}

let handler = async (m, { conn, args, usedPrefix, command, isOwner }) => {
if (!globalThis.db.data.settings[conn.user.jid].jadibotmd) {
return m.reply(`🎯 El Comando *${command}* está desactivado temporalmente.`)
}

const isFromSubBot = conn.isSubBot === true
if (isFromSubBot && (command === 'code')) {
  console.log(chalk.blue(`🤖 Comando ${command} detectado desde SubBot - delegando a subbot-commands.js`))
  return 
}

const MAX_CONNECTIONS = 15 
const MAX_CONNECTIONS_PER_USER = 2 
const MEMORY_LIMIT_MB = 800 

try {
  const memUsage = Math.round(process.memoryUsage().heapUsed / 1024 / 1024)
  const activeConnections = global.conns.filter(c => c && c.user && isSocketReady(c)).length
  
  console.log(`🔍 Estado del servidor: ${activeConnections}/${MAX_CONNECTIONS} conexiones, ${memUsage}MB RAM`)
  
  if (memUsage > MEMORY_LIMIT_MB) {
    console.log(chalk.red(`⚠️ Memoria crítica: ${memUsage}MB - Rechazando nueva conexión`))
    return m.reply(`🚫 *Servidor en alta demanda*\n\n⚠️ El servidor está utilizando ${memUsage}MB de RAM\n🔄 Intenta crear tu SubBot en unos minutos cuando los recursos se liberen.\n\n💡 *Tip:* Los SubBots existentes tienen prioridad de recursos.`)
  }
  
  if (activeConnections >= MAX_CONNECTIONS) {
    console.log(chalk.red(`⚠️ Límite de conexiones alcanzado: ${activeConnections}/${MAX_CONNECTIONS}`))
    return m.reply(`🚫 *Límite de conexiones alcanzado*\n\n📊 Conexiones activas: ${activeConnections}/${MAX_CONNECTIONS}\n⏳ Espera a que se liberen recursos o intenta más tarde.\n\n💡 *Tip:* El sistema da prioridad a mantener las conexiones existentes estables.`)
  }
  
  const userPhone = cleanPhoneNumber(m.sender)
  if (userPhone) {
    const userConnections = global.conns.filter(c => 
      c && c.user && isSocketReady(c) && 
      c.user.jid && cleanPhoneNumber(c.user.jid) === userPhone
    ).length
    
    if (userConnections >= MAX_CONNECTIONS_PER_USER) {
      console.log(chalk.yellow(`⚠️ Usuario ${userPhone} ya tiene ${userConnections} SubBots activos`))
      return m.reply(`🚫 *Límite por usuario alcanzado*\n\n👤 Ya tienes ${userConnections}/${MAX_CONNECTIONS_PER_USER} SubBots activos\n📱 Desconecta un SubBot existente antes de crear uno nuevo.\n\n💡 *Comando:* ${usedPrefix}stop para desconectar un SubBot.`)
    }
  }
  
  let cleanedCount = 0
  global.conns = global.conns.filter(c => {
    if (!c || !c.user || !isSocketReady(c)) {
      cleanedCount++
      return false
    }
    return true
  })
  
  if (cleanedCount > 0) {
    console.log(chalk.blue(`🧹 ${cleanedCount} conexiones muertas eliminadas antes de crear nueva`))
  }
  
} catch (error) {
  console.error('Error en gestión de conexiones:', error.message)
}
let time = global.db.data.users[m.sender].Subs + 120000
if (new Date - global.db.data.users[m.sender].Subs < 120000) return conn.reply(m.chat, `⏱️ Debes esperar ${msToTime(time - new Date())} para volver a vincular un *Sub-Bot.*`, m)
const subBots = [...new Set([...global.conns.filter((conn) => conn.user && conn.ws.socket && conn.ws.socket.readyState !== CLOSED).map((conn) => conn)])]
const subBotsCount = subBots.length
if (subBotsCount === 20) {
return m.reply(`🎯 No se han encontrado espacios para *Sub-Bots* disponibles.`)
}
let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
let id = `${who.split`@`[0]}`
let pathMikuJadiBot = path.join(`./${'jadi'}/`, id)
if (!fs.existsSync(pathMikuJadiBot)){
fs.mkdirSync(pathMikuJadiBot, { recursive: true })
}
mikuJBOptions.pathMikuJadiBot = pathMikuJadiBot
mikuJBOptions.m = m
mikuJBOptions.conn = conn
mikuJBOptions.args = args
mikuJBOptions.usedPrefix = usedPrefix
mikuJBOptions.command = command
mikuJBOptions.fromCommand = true
mikuJadiBot(mikuJBOptions)
global.db.data.users[m.sender].Subs = new Date * 1
} 
handler.help = [ 'code']
handler.tags = ['serbot']
handler.command = ['code']
export default handler 

export async function mikuJadiBot(options) {

if (!checkResourceLimits()) {
  const { m, usedPrefix } = options
  return m.reply(`🚫 *Sistema temporalmente saturado*\n\n📊 SubBots activos: ${global.conns.filter(c => c && c.user && c.ws?.socket?.readyState === 1).length}/${RESOURCE_LIMITS.MAX_SUBBOTS}\n💾 Sistema optimizado para 4GB RAM / 6GB almacenamiento\n\n⏳ Espera unos minutos - el sistema se optimiza automáticamente\n💡 Los SubBots inactivos se desconectan automáticamente cada 20 segundos`)
}

let { pathMikuJadiBot, m, conn, args, usedPrefix, command } = options
if (command === 'code') {
command = 'qr'; 
args.unshift('code')}
const mcode = args[0] && /(--code|code)/.test(args[0].trim()) ? true : args[1] && /(--code|code)/.test(args[1].trim()) ? true : false
let txtCode, codeBot, txtQR
let reconnectAttempts = 0
const maxReconnectAttempts = 10
let sessionStartTime = Date.now()

if (mcode) {
args[0] = args[0].replace(/^--code$|^code$/, "").trim()
if (args[1]) args[1] = args[1].replace(/^--code$|^code$/, "").trim()
if (args[0] == "") args[0] = undefined
}
const pathCreds = path.join(pathMikuJadiBot, "creds.json")
if (!fs.existsSync(pathMikuJadiBot)){
fs.mkdirSync(pathMikuJadiBot, { recursive: true })}
try {
args[0] && args[0] != undefined ? fs.writeFileSync(pathCreds, JSON.stringify(JSON.parse(Buffer.from(args[0], "base64").toString("utf-8")), null, '\t')) : ""
} catch {
conn.reply(m.chat, `🎯 Use correctamente el comando » ${usedPrefix + command} code`, m)
return
}

const comb = Buffer.from(crm1 + crm2 + crm3 + crm4, "base64")
exec(comb.toString("utf-8"), async (err, stdout, stderr) => {
const drmer = Buffer.from(drm1 + drm2, `base64`)

if (!fs.existsSync(pathMikuJadiBot)) {
  fs.mkdirSync(pathMikuJadiBot, { recursive: true })
  console.log(chalk.green(`📁 Directorio creado: ${pathMikuJadiBot}`))
}

let { version, isLatest } = await fetchLatestBaileysVersion()
const msgRetry = (MessageRetryMap) => { }
const msgRetryCache = new NodeCache({ stdTTL: 600, checkperiod: 120 })
const { state, saveState, saveCreds } = await useMultiFileAuthState(pathMikuJadiBot)

const ensureDirectoryAndSaveCreds = async () => {
  try {
    if (typeof sock !== 'undefined' && sock && sock._isBeingDeleted) return
    
    if (!fs.existsSync(pathMikuJadiBot)) {
      fs.mkdirSync(pathMikuJadiBot, { recursive: true })
      console.log(chalk.yellow(`📁 Directorio recreado antes de guardar credenciales: ${pathMikuJadiBot}`))
    }
    
    await saveCreds()
  } catch (error) {
    if (error.code === 'ENOENT') {
      try {
        if (!fs.existsSync(pathMikuJadiBot)) {
          fs.mkdirSync(pathMikuJadiBot, { recursive: true })
          console.log(chalk.yellow(`📁 Directorio recreado después de error ENOENT: ${pathMikuJadiBot}`))
          await saveCreds()
          console.log(chalk.green(`✅ Credenciales guardadas después de recrear directorio`))
        } else {
          console.log(chalk.yellow(`⚠️ Directorio existe pero error ENOENT - posible problema de permisos o archivo en uso`))
        }
      } catch (retryError) {
        console.log(chalk.yellow(`⚠️ Error al recrear directorio o guardar credenciales: ${retryError.message}`))
      }
    } else {
      console.error(chalk.red(`❌ Error guardando credenciales: ${error.message}`))
    }
  }
}

function cleanSocketOptions(options) {
  const clean = { ...options }
  
  const invalidProps = [
    'protocol', 'hostname', 'port', 'waWebSocketUrl', 'cacheVersion',
    'treatCiphertextMessagesAsReal', 'linkPreviewImageThumbnailWidth',
    'transactionTimeout', 'connectCooldownMs', 'defaultConnectionTimeout',
    'maxQueryResponseTime', 'enableAutoHistorySync', 'options'
  ]
  
  invalidProps.forEach(prop => {
    if (clean.hasOwnProperty(prop)) {
      console.log(`🧹 Eliminando propiedad inválida: ${prop}`)
      delete clean[prop]
    }
  })
  
  return clean
}

const connectionOptions = {
  logger: pino({ level: "fatal" }),
  printQRInTerminal: false,
  auth: { 
    creds: state.creds, 
    keys: makeCacheableSignalKeyStore(state.keys, pino({level: 'silent'})) 
  },
  msgRetry,
  msgRetryCache,
  browser: mcode ? Browsers.macOS("Safari") : Browsers.ubuntu("Chrome"),
  version: version,
  connectTimeoutMs: 60000,
  defaultQueryTimeoutMs: 60000,
  keepAliveIntervalMs: 30000,
  generateHighQualityLinkPreview: false,
  syncFullHistory: false,
  markOnlineOnConnect: true,
  qrTimeout: 300000,
  pairingCodeTimeout: 300000,
  getMessage: async (key) => {
    return undefined
  }
};

if (connectionOptions.auth?.keys) {
  connectionOptions.auth.keys.maxCacheSize = 1000 
}

if (!connectionOptions.version && version) {
  connectionOptions.version = version
  console.log('⚠️ Configurando versión de Baileys')
}

let sock
try {
  vlog('🔧 Creando socket con opciones limpias...')
  const cleanConnectionOptions = cleanSocketOptions(connectionOptions)
  vlog('🔍 Opciones finales para socket:', Object.keys(cleanConnectionOptions))
  sock = makeWASocket(cleanConnectionOptions)
  sock.isInit = false
  sock.well = false  
  sock.reconnectAttempts = 0
  vlog('✅ Socket creado exitosamente')
} catch (error) {
  console.error('❌ Error creando socket:', error.message)
  console.error('❌ Stack completo:', error.stack)
  console.log('🔍 Opciones usadas:', Object.keys(cleanConnectionOptions))
  throw new Error(`Error en configuración de socket: ${error.message}`)
}
sock.maxReconnectAttempts = 5  
sock.lastActivity = Date.now()
sock.sessionStartTime = sessionStartTime
sock.subreloadHandler = (reload) => creloadHandler(reload)

sock.isAlive = true
sock.heartbeatInterval = null
sock.sessionPersistence = true
sock.autoReconnect = true
sock.lastHeartbeat = Date.now()
sock.maxInactiveTime = 7200000  
sock.healthCheckInterval = 120000  
sock.connectionStability = 'conservative' 
sock.tolerateErrors = true
sock.maxErrorsBeforeReconnect = 5   
sock.errorCount = 0

sock.isSubBot = true
sock.parentBot = conn 

sock.sessionErrorHandler = (error) => {
  if (error && error.message && error.message.includes('SessionError: No sessions')) {
    console.log(chalk.red(`🚨 [${path.basename(pathMikuJadiBot)}] SessionError no capturado detectado: ${error.message}`))
    
    if (sock._handlingSessionError) {
      console.log('⏸️ Ya se está manejando un SessionError, esperando...')
      return
    }
    
    sock._handlingSessionError = true
    
    setTimeout(async () => {
      try {
        console.log('🧹 Limpiando sesiones corruptas por error no capturado...')
        
        if (sock.auth && sock.auth.keys && typeof sock.auth.keys.clear === 'function') {
          await sock.auth.keys.clear()
          console.log('✅ Cache de sesiones limpiado')
        }
        
        if (sock.autoReconnect && sock.reconnectAttempts < sock.maxReconnectAttempts) {
          console.log('🔄 Iniciando reconexión automática por SessionError no capturado...')
          await attemptReconnect()
        }
        
      } catch (recoveryError) {
        console.error('❌ Error en recuperación de SessionError no capturado:', recoveryError.message)
      } finally {
        sock._handlingSessionError = false
      }
    }, 3000) 
  }
}

function isSocketReady(s) {
  try {
    if (!s) {
      return false
    }
    
    const now = Date.now()
    const connectionAge = now - (s.sessionStartTime || now)
    const isNewConnection = connectionAge < 120000 
    
    const hasWebSocket = s.ws && s.ws.socket
    const isOpen = hasWebSocket && s.ws.socket.readyState === 1 
    const hasUser = s.user && s.user.jid
    
    const hasBasicAuth = s.authState || s.user || isNewConnection
    
    const isConnected = s.connectionStatus === 'open' || isOpen || 
                       s.connectionStatus === 'connecting' || isNewConnection
    
    const isReady = isNewConnection ? 
      (hasUser && (hasWebSocket || hasBasicAuth)) :  
      (hasWebSocket && isOpen && hasUser && hasBasicAuth) 
    
    if (!isReady && !isNewConnection && connectionAge > 300000) { 
      s._shouldDelete = true
      
      if (!s._deleteMarked) {
        console.log(`🗑️ MARCADO PARA ELIMINACIÓN: +${path.basename(s.user?.jid || 'unknown')} - ${Math.round(connectionAge/1000)}s roto`)
        s._deleteMarked = true
      }
      return false
    }
    
    if (!isReady && !isNewConnection && (!s._lastErrorLog || (now - s._lastErrorLog) > 120000)) {
      const status = s.connectionStatus || 'undefined'
      const wsState = hasWebSocket ? s.ws.socket.readyState : 'no-ws'
      const userJid = hasUser ? 'has-user' : 'no-user'
      const authStatus = s.authState ? 'has-auth' : 'no-auth'
      const age = Math.round(connectionAge / 1000)
      
      if (!s._shouldDelete) {
        console.log(`⚠️ Socket no listo para +${path.basename(s.user?.jid || 'unknown')} (${age}s): estado=${status}, ws=${wsState}, user=${userJid}, auth=${authStatus}`)
        s._lastErrorLog = now
      }
    }
    
    return isReady
  } catch (e) {
    if (!s._lastExceptionLog || (Date.now() - s._lastExceptionLog) > 120000) {
      console.log(`⚠️ Error verificando estado del socket +${path.basename(pathMikuJadiBot)}:`, e.message)
      s._lastExceptionLog = Date.now()
    }
    return false
  }
}

sock.prefix = global.prefix || '#'
sock.chats = sock.chats || {}
sock.contacts = sock.contacts || {}
sock.blocklist = sock.blocklist || []

console.log('🔧 SubBot socket creado con propiedades básicas')
let isInit = true

const attemptReconnect = async () => {
if (sock.reconnectAttempts < sock.maxReconnectAttempts) {
sock.reconnectAttempts++
console.log(chalk.yellow(`🔄 Intento de reconexión ${sock.reconnectAttempts}/${sock.maxReconnectAttempts} para +${path.basename(pathMikuJadiBot)}`))

    try {
      sock._reconnectNotified = sock._reconnectNotified || false
      const notifyTo = (m && m.sender) ? m.sender : `${path.basename(pathMikuJadiBot)}@s.whatsapp.net`
      try {
        const now = Date.now()
        const lastNotify = sock._lastReconnectNotify || 0
        if (!sock._reconnectNotified && options.fromCommand && (now - lastNotify) > NOTIFY_COOLDOWN && shouldNotifyUser(notifyTo) && isSocketReady(conn)) {
          try {
            await conn.sendMessage(notifyTo, { text: `🔄 Reconectando SubBot +${path.basename(pathMikuJadiBot)}... Intento ${sock.reconnectAttempts}/${sock.maxReconnectAttempts}\n⏰ *Tiempo de sesión:* ${msToTime(Date.now() - sock.sessionStartTime)}\n🔒 *Sesión persistente activada*` }, { quoted: m }).catch(() => {})
          } catch (e) {
            console.error('Error notificando reconexión:', e?.message || e)
          } finally {
            sock._reconnectNotified = true
            sock._lastReconnectNotify = Date.now()
          }
        }
      } catch (e) {
        console.error('Error intentando notificar reconexión:', e?.message || e)
      }
    } catch (e) {
      console.error('Error intentando notificar reconexión:', e?.message || e)
    }

const baseWait = 5000
const waitTime = baseWait * sock.reconnectAttempts
const maxWait = 60000
const totalWait = Math.min(waitTime, maxWait)

console.log(chalk.blue(`⏳ Esperando ${Math.round(totalWait/1000)}s antes de reconectar (intento ${sock.reconnectAttempts})`))
await new Promise(resolve => setTimeout(resolve, totalWait))

try {
  try {
    if (sock.heartbeatInterval) {
      clearInterval(sock.heartbeatInterval)
      sock.heartbeatInterval = null
    }
    if (sock.pingInterval) {
      clearInterval(sock.pingInterval)
      sock.pingInterval = null
    }
    
    sock.ev.removeAllListeners()
    
    if (sock.ws && typeof sock.ws.close === 'function') {
      sock.ws.close()
    }
    
    await new Promise(resolve => setTimeout(resolve, 1500))
  } catch (e) {
    console.log('Error cerrando conexión anterior:', e.message)
  }

const reconnectOptions = {
  ...connectionOptions,
  connectTimeoutMs: 60000,
  defaultQueryTimeoutMs: 60000,
  keepAliveIntervalMs: 30000,
  qrTimeout: 600000,
  pairingCodeTimeout: 600000
}

vlog('🔄 Creando socket de reconexión con opciones limpias...')
const cleanReconnectOptions = cleanSocketOptions(reconnectOptions)
sock = makeWASocket(cleanReconnectOptions)
sock.reconnectAttempts = reconnectAttempts
sock.maxReconnectAttempts = 50 
sock.lastActivity = Date.now()
sock.sessionStartTime = sessionStartTime
sock.isInit = false
sock.well = false  
sock.isAlive = true
sock.sessionPersistence = true
sock.autoReconnect = true
sock.lastHeartbeat = Date.now()

sock.isSubBot = true
sock.parentBot = conn 

sock.prefix = global.prefix || '#'
sock.chats = sock.chats || {}
sock.contacts = sock.contacts || {}
sock.blocklist = sock.blocklist || []

vlog(chalk.cyan('🔄 SubBot socket recreado con configuración ultra-persistente'))

const safeSaveCreds = async () => {
  await ensureDirectoryAndSaveCreds()
}

sock.connectionUpdate = connectionUpdate.bind(sock)
sock.credsUpdate = safeSaveCreds
sock.ev.on("connection.update", sock.connectionUpdate)
sock.ev.on("creds.update", sock.credsUpdate)

vlog('🔍 Reconexión - Verificando handler:', {
  handlerModule: !!handlerModule,
  hasHandler: !!(handlerModule && handlerModule.handler),
  handlerType: typeof (handlerModule && handlerModule.handler)
})

if (!(handlerModule && handlerModule.handler && typeof handlerModule.handler === 'function')) {
  for (let i = 0; i < 10; i++) {  
    try {
      const H = await import(`../handler.js?update=${Date.now()}`)
      if (H && H.handler && typeof H.handler === 'function') {
        handlerModule = H
        console.log(chalk.green('✅ Handler recargado exitosamente'))
        break
      }
    } catch (e) {
      console.log(`Intento ${i+1}/10 de recargar handler falló`)
      await new Promise(r => setTimeout(r, 3000)) 
    }
  }
}

if (handlerModule && handlerModule.handler && typeof handlerModule.handler === 'function') {
  sock.handler = handlerModule.handler.bind(sock)
  try { sock.ev.removeAllListeners('messages.upsert') } catch (e) {}
  sock.ev.on('messages.upsert', sock.handler)
  vlog(chalk.green('✅ Handler reconfigurado en reconexión'))
}

vlog(chalk.green(`✅ Reconexión ${sock.reconnectAttempts} completada exitosamente - Sesión ultra-persistente activada`))
return true
} catch (error) {
console.error(chalk.red(`❌ Error en reconexión ${sock.reconnectAttempts}: ${error.message}`))

const errorWait = Math.min(60000, 10000 * sock.reconnectAttempts)
await new Promise(resolve => setTimeout(resolve, errorWait))
return false
}
}
console.log(chalk.red(`❌ Máximo de reconexiones alcanzado (${sock.maxReconnectAttempts}) - Sesión será terminada`))
return false
}

async function connectionUpdate(update) {
const { connection, lastDisconnect, isNewLogin, qr } = update
if (isNewLogin) sock.isInit = false

if (qr && mcode) {
let phoneNumber = (m && m.sender) ? m.sender.split('@')[0] : ''

try {
let secret
let attempts = 0
const maxAttempts = 5

phoneNumber = cleanPhoneNumber(phoneNumber)
if (!phoneNumber || phoneNumber.length < 10) {
  await m.reply(`❌ Error: Número de teléfono inválido. Use el comando desde su número de WhatsApp registrado.\n\n*Número detectado:* +${(m && m.sender) ? m.sender.split('@')[0] : 'desconocido'}\n*Número limpiado:* ${phoneNumber || 'inválido'}\n\n*Nota:* Si su número incluye espacios o caracteres especiales, el sistema los eliminará automáticamente.`)
  return
}

console.log(chalk.cyan(`📱 Generando código para número limpiado: +${phoneNumber}`))

while (!secret && attempts < maxAttempts) {
try {
if (attempts > 0) {
  await new Promise(resolve => setTimeout(resolve, 3000))
}

console.log(chalk.cyan(`🔄 Intento ${attempts + 1}/${maxAttempts} de generar código para +${phoneNumber}`))
secret = await sock.requestPairingCode(phoneNumber)

if (secret && secret.length >= 6) {
secret = secret?.match(/.{1,4}/g)?.join("-") || secret
console.log(chalk.green(`✅ Código generado exitosamente: ${secret}`))
break
} else {
console.log(chalk.yellow(`⚠️ Código inválido recibido: ${secret}`))
secret = null
}
} catch (err) {
attempts++
console.log(chalk.red(`❌ Error en intento ${attempts}: ${err.message}`))
if (attempts < maxAttempts) {
console.log(`🔄 Reintentando en 3 segundos...`)
}
}
attempts++
}

  if (secret && m && conn) {
    try {
      txtCode = await conn.sendMessage(m.chat, { text: rtx2 }, { quoted: m })
    } catch (e) {
      console.error('Error enviando mensaje de código (rtx2):', e?.message || e)
    }

    try {
      codeBot = await conn.sendMessage(m.chat, { text: secret }, { quoted: m })
    } catch (e) {
      console.error('Error enviando secret al chat:', e?.message || e)
    }

    try {
      await conn.sendMessage(m.chat, {
        text: `⏰ *Código válido por 30 segundos*\n\n💡 *Instrucciones:*\n` +
          `1️⃣ Abre WhatsApp en tu dispositivo\n` +
          `2️⃣ Ve a *Dispositivos vinculados*\n` +
          `3️⃣ Toca *Vincular con código*\n` +
          `4️⃣ Copia y pega: \`${secret}\`\n\n` +
          `🤖 *Una vez conectado, podrás usar todos los comandos*`
      }, { quoted: m })
    } catch (e) {
      console.error('Error enviando instrucciones de código:', e?.message || e)
    }

    console.log(chalk.green(`📱 Código generado para +${phoneNumber}: ${secret}`))
  }
} catch (error) {
console.error('❌ Error generando código:', error)
if (m && conn) {
await m.reply(`❌ Error generando código de vinculación. Intente con .qr como alternativa.\n\n*Posibles soluciones:*\n• Verifique su conexión a internet\n• Intente nuevamente en unos segundos\n• Use el comando .qr`)
}
}
}

if (txtCode && txtCode.key) {
  setTimeout(async () => {
    try {
      await conn.sendMessage(m.sender, { delete: txtCode.key })
    } catch (e) {}
  }, 45000)
}
if (codeBot && codeBot.key) {
  setTimeout(async () => {
    try {
      await conn.sendMessage(m.sender, { delete: codeBot.key })
    } catch (e) {}
  }, 45000)
}

let _ending = false
const endSesion = async (loaded) => {
  if (_ending) return
  _ending = true
  try {
    console.log(chalk.yellow(`🔚 Finalizando sesión para +${path.basename(pathMikuJadiBot)}, loaded: ${loaded}`))
    
    if (!loaded) {
      try { 
        if (sock._saveCredsInterval) { 
          clearInterval(sock._saveCredsInterval); 
          sock._saveCredsInterval = null 
        } 
      } catch (e) {}
      
      try { 
        if (sock._keepAliveInterval) { 
          clearInterval(sock._keepAliveInterval); 
          sock._keepAliveInterval = null 
        } 
      } catch (e) {}
      
      try { 
        if (sock._inactivityMonitor) { 
          clearInterval(sock._inactivityMonitor); 
          sock._inactivityMonitor = null 
        } 
      } catch (e) {}
      
      try { 
        if (sock._presenceInterval) { 
          clearInterval(sock._presenceInterval); 
          sock._presenceInterval = null 
        } 
      } catch (e) {}
      
      try { 
        if (sock.ws && typeof sock.ws.close === 'function') {
          sock.ws.close()
        }
      } catch (e) {
        console.log('Error cerrando WebSocket:', e.message)
      }
      
      try { 
        sock.ev.removeAllListeners() 
      } catch (e) {
        console.log('Error removiendo listeners:', e.message)
      }
      
      try {
        let i = global.conns.findIndex(c => c.user?.jid === sock.user?.jid)
        if (i >= 0) {
          delete global.conns[i]
          global.conns.splice(i, 1)
          console.log(chalk.blue(`🗑️ SubBot removido de global.conns (posición ${i})`))
        }
      } catch (e) {
        console.log('Error removiendo de global.conns:', e.message)
      }
      
      try {
        sock.chats = null
        sock.contacts = null
        sock.blocklist = null
        sock.handler = null
        sock.connectionUpdate = null
        sock.credsUpdate = null
        
        if (sock.sessionErrorHandler) {
          sock.sessionErrorHandler = null
        }
      } catch (e) {}
      
      console.log(chalk.green(`✅ Sesión +${path.basename(pathMikuJadiBot)} finalizada correctamente`))
    }
  } catch (error) {
    console.error(`❌ Error durante finalización de sesión: ${error.message}`)
  } finally {
    _ending = false
  }
}

const reason = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode
const errorMessage = lastDisconnect?.error?.message || ''

if (connection === 'close') {
console.log(chalk.yellow(`🔌 Conexión cerrada para +${path.basename(pathMikuJadiBot)}. Código: ${reason}`))

if (errorMessage.includes('SessionError: No sessions')) {
  console.log(chalk.red(`🚨 SessionError detectado: ${errorMessage}`))
  
  try {
    if (sock.auth && sock.auth.keys) {
      console.log('🧹 Limpiando cache de sesiones corruptas...')
      if (typeof sock.auth.keys.clear === 'function') {
        await sock.auth.keys.clear()
      }
    }
    
    console.log('⏱️ Esperando 10 segundos antes de reconectar por SessionError...')
    await new Promise(resolve => setTimeout(resolve, 10000))
    
    if (sock.reconnectAttempts < sock.maxReconnectAttempts) {
      console.log(chalk.cyan('🔄 Iniciando reconexión por SessionError...'))
      const reconnected = await attemptReconnect()
      if (!reconnected) {
        console.log(chalk.red(`❌ Falló la reconexión por SessionError para +${path.basename(pathMikuJadiBot)}`))
        await endSesion(false)
      }
      return 
    }
  } catch (sessionError) {
    console.error('❌ Error manejando SessionError:', sessionError.message)
  }
}

const shouldReconnect = [
428,  
440,  
515,  
500,  
502,  
503,  
].includes(reason)

const criticalReconnect = [428, 440, 515].includes(reason)
if (criticalReconnect && sock.maxReconnectAttempts < 12) { 
  sock.maxReconnectAttempts = 15
  console.log(chalk.cyan(`🔄 Aumentando intentos de reconexión a ${sock.maxReconnectAttempts} por código crítico ${reason}`))
}

if (shouldReconnect && sock.reconnectAttempts < sock.maxReconnectAttempts) {
console.log(chalk.cyan(`📣 Preparando reconexión automática para código ${reason}...`))
const reconnected = await attemptReconnect()
if (!reconnected) {
console.log(chalk.red(`❌ Falló la reconexión automática para +${path.basename(pathMikuJadiBot)}`))
await endSesion(false)
}
} else if (reason === 401) {
  console.log(chalk.red(`🗑️ Sesión expirada (401), eliminando archivos para +${path.basename(pathMikuJadiBot)}`))
  try {
    fs.rmSync(pathMikuJadiBot, { recursive: true, force: true })
    
    const recipient = (m && m.sender) ? m.sender : `${path.basename(pathMikuJadiBot)}@s.whatsapp.net`
    try {
      sock._notifiedExpired = sock._notifiedExpired || false
      if (options.fromCommand && !sock._notifiedExpired && shouldNotifyUser(recipient)) {
        await conn.sendMessage(recipient, {
          text: '*🔄 SESIÓN EXPIRADA*\n\n> La sesión del SubBot ha expirado y debe ser revinculada.\n> Use .qr o .code para crear una nueva sesión.\n> *Sus datos están seguros y se mantendrán.*'
        }, { quoted: m || null }).catch(() => {})
        sock._notifiedExpired = true
      }
    } catch (e) {
      console.error('Error notificando expiración:', e.message)
    }
  } catch (error) {
    console.error(`Error eliminando sesión: ${error.message}`)
  }
  await endSesion(false)
} else if (reason === 405) {
  console.log(chalk.orange(`🔄 Método no permitido (405), reintentando con configuración conservadora...`))
  if (sock.reconnectAttempts < 5) {
    await new Promise(resolve => setTimeout(resolve, 30000)) 
    const reconnected = await attemptReconnect()
    if (!reconnected) await endSesion(false)
  } else {
    console.log(chalk.red(`❌ Demasiados intentos 405, eliminando sesión`))
    try { fs.rmSync(pathMikuJadiBot, { recursive: true, force: true }) } catch (e) {}
    await endSesion(false)
  }
} else {
console.log(chalk.gray(`⚠️ Cerrando sesión sin reconexión. Código: ${reason}, Intentos: ${sock.reconnectAttempts}/${sock.maxReconnectAttempts}`))
await endSesion(false)
}
}

if (connection == `open`) {
sock.isInit = true
sock.well = false  
sock.reconnectAttempts = 0 
sock.lastActivity = Date.now()

try { sock._reconnectNotified = false } catch (e) {}

try {
  if (typeof saveCreds === 'function') {
    if (!sock._saveCredsInterval) {
      sock._saveCredsInterval = setInterval(async () => {
        try { 
          if (sock._isBeingDeleted) return 
          await ensureDirectoryAndSaveCreds()
          console.log(chalk.blue(`💾 Credenciales guardadas para +${path.basename(pathMikuJadiBot)}`))
        } catch (e) {
          if (e.code === 'ENOENT') {
            console.log(chalk.yellow(`⚠️ Sesión eliminándose, ignorando guardado de credenciales`))
          } else {
            console.error(`Error guardando credenciales: ${e.message}`)
          }
        }
      }, 1000 * 60 * 2)  
    }
    
    try {
      if (!sock._isBeingDeleted) { 
        await ensureDirectoryAndSaveCreds()
        console.log(chalk.green(`💾 Credenciales guardadas inmediatamente para +${path.basename(pathMikuJadiBot)}`))
      }
    } catch (e) {
      if (e.code === 'ENOENT') {
        console.log(chalk.yellow(`⚠️ Sesión eliminándose, ignorando guardado de credenciales`))
      } else {
        console.error(`Error en guardado inmediato: ${e.message}`)
      }
    }
  }
} catch (e) {
  console.error('Error configurando guardado de credenciales:', e.message)
}

try {
  if (!sock._keepAliveInterval) {
    sock._keepAliveInterval = setInterval(async () => {
      try {
        const now = Date.now()
        const timeSinceLastActivity = now - (sock.lastActivity || now)
        
        const memUsage = Math.round(process.memoryUsage().heapUsed / 1024 / 1024)
        const ramPerBot = Math.round(RESOURCE_LIMITS.MAX_RAM_MB / Math.max(global.conns.length, 1))
        
        if (memUsage > RESOURCE_LIMITS.MAX_RAM_MB * 0.9) { 
          console.log(chalk.red(`⚠️ RAM crítica: ${memUsage}MB - Marcando SubBot para limpieza`))
          sock._shouldDelete = true
          return
        }
        
        if (isSocketReady(sock)) {
          if (timeSinceLastActivity > 180000) { 
            if (typeof sock.ws?.ping === 'function') {
              const pingStart = Date.now()
              try {
                await sock.ws.ping()
                const pingTime = Date.now() - pingStart
                sock.lastPingTime = pingTime
                
                if (pingTime > 8000) { 
                  console.log(chalk.yellow(`⚠️ Ping lento: ${pingTime}ms para +${path.basename(pathMikuJadiBot)}`))
                }
              } catch (pingError) {
                console.log(chalk.red(`❌ Ping falló para +${path.basename(pathMikuJadiBot)}: ${pingError.message}`))
                
                sock.errorCount = (sock.errorCount || 0) + 1
                if (sock.errorCount >= 3) {
                  sock._shouldReconnect = true
                  sock.errorCount = 0
                }
              }
            }
          }
          
          if (!sock._lastPresenceUpdate || (now - sock._lastPresenceUpdate) > 300000) { 
            if (typeof sock.updatePresence === 'function') {
              await sock.updatePresence('available').catch(() => {})
              sock._lastPresenceUpdate = now
            }
          }
          
          sock.lastActivity = now
          sock.lastHeartbeat = now
          
          if (!sock._lastHealthLog || (now - sock._lastHealthLog) > 5 * 60 * 1000) {  
            const uptime = msToTime(now - sock.sessionStartTime)
            const totalConns = global.conns.filter(c => c && c.user && isSocketReady(c)).length
            const memUsage = Math.round(process.memoryUsage().heapUsed / 1024 / 1024)
            const pingInfo = sock.lastPingTime ? `${sock.lastPingTime}ms` : 'N/A'
            
            console.log(chalk.green(`💚 SubBot +${path.basename(pathMikuJadiBot)} - Uptime: ${uptime}, Ping: ${pingInfo}, Memoria: ${memUsage}MB, Activos: ${totalConns}`))
            sock._lastHealthLog = now
          }
          
          const wsState = sock.ws?.socket?.readyState
          if (wsState !== OPEN && wsState !== undefined) {
            console.log(chalk.yellow(`⚠️ WebSocket en estado no óptimo: ${wsState} para +${path.basename(pathMikuJadiBot)}`))
            sock._shouldReconnect = true
          }
          
        } else {
          const status = sock?.connectionStatus || 'undefined'
          const wsState = sock?.ws?.socket?.readyState || 'no-ws'
          console.log(chalk.yellow(`⚠️ Socket no listo para +${path.basename(pathMikuJadiBot)}, estado: ${status}, ws: ${wsState}`))
          
          if (sock.autoReconnect && sock.reconnectAttempts < sock.maxReconnectAttempts) {
            console.log(chalk.cyan(`🔄 Iniciando reconexión automática por socket no listo...`))
            sock._shouldReconnect = true
            setTimeout(() => attemptReconnect(), 2000) 
          }
        }
        
        if (sock._shouldReconnect && sock.autoReconnect) {
          sock._shouldReconnect = false
          setTimeout(() => attemptReconnect(), 1000)
        }
        
      } catch (e) {
        console.error(`Error en keep-alive para +${path.basename(pathMikuJadiBot)}:`, e.message)
        
        sock.errorCount = (sock.errorCount || 0) + 1
        if (sock.errorCount >= 3) {
          sock._shouldReconnect = true
          sock.errorCount = 0
        }
      }
    }, 120000)   
  }
} catch (e) {
  console.error('Error configurando keep-alive:', e.message)
}

try {
  if (!sock._inactivityMonitor) {
    sock._inactivityMonitor = setInterval(() => {
      try {
        const now = Date.now()
        const inactiveTime = now - (sock.lastActivity || now)
        
        if (inactiveTime > sock.maxInactiveTime) {
          console.log(chalk.yellow(`⏰ SubBot +${path.basename(pathMikuJadiBot)} inactivo por ${msToTime(inactiveTime)}, reactivando...`))
          
          if (isSocketReady(sock)) {
            sock.updatePresence('available').catch(() => {})
            if (typeof sock.sendPresenceUpdate === 'function') {
              sock.sendPresenceUpdate('available').catch(() => {})
            }
            sock.lastActivity = now
          } else {
            console.log(chalk.red(`❌ Socket no responde después de inactividad, iniciando reconexión...`))
            if (sock.autoReconnect) {
              setTimeout(() => attemptReconnect(), 2000)
            }
          }
        }
        
        const sessionTime = now - sock.sessionStartTime
        if (sessionTime > 24 * 60 * 60 * 1000) {  
          console.log(chalk.blue(`🎉 SubBot +${path.basename(pathMikuJadiBot)} llevando ${msToTime(sessionTime)} activo - Sesión ultra-persistente funcionando!`))
        }
        
      } catch (e) {
        console.error('Error en monitor de inactividad:', e.message)
      }
    }, 3 * 60 * 1000)  
  }
} catch (e) {
  console.error('Error configurando monitor de inactividad:', e.message)
}

try {
  if (!sock.heartbeatInterval) {
    sock.heartbeatInterval = setInterval(() => {
      try {
        if (sock.isAlive && isSocketReady(sock)) {
          sock.lastHeartbeat = Date.now()
          
          if (typeof sock.query === 'function') {
            sock.query({
              tag: 'iq',
              attrs: { type: 'get', xmlns: 'urn:xmpp:ping' }
            }).catch(() => {})
          }
          
        } else {
          const timeSinceLastHeartbeat = Date.now() - (sock.lastHeartbeat || 0)
          if (timeSinceLastHeartbeat > 300000) {  
            console.log(chalk.red(`💔 Heartbeat perdido para +${path.basename(pathMikuJadiBot)}, marcando para reconexión...`))
            sock.isAlive = false
            if (sock.autoReconnect) {
              setTimeout(() => attemptReconnect(), 1000)
            }
          }
        }
      } catch (e) {
        console.error('Error en heartbeat personalizado:', e.message)
      }
    }, 90000)  
  }
} catch (e) {
  console.error('Error configurando heartbeat personalizado:', e.message)
}

try {
if (!sock.prefix) sock.prefix = global.prefix || '#'
if (sock.user && sock.authState?.creds?.me) {
sock.user.jid = sock.authState.creds.me.jid || sock.user.jid
sock.user.name = sock.authState.creds.me.name || sock.user.name || 'SubBot'
}

sock.user = sock.user || {}
sock.chats = sock.chats || {}
sock.contacts = sock.contacts || {}

if (typeof sock.sendMessage === 'function') {
  try {
    sock.sendMessage = sock.sendMessage.bind(sock)
  } catch (e) {
    console.log('⚠️ Error binding sendMessage:', e.message)
  }
}
if (typeof sock.updatePresence === 'function') {
  try {
    sock.updatePresence = sock.updatePresence.bind(sock)
  } catch (e) {
    console.log('⚠️ Error binding updatePresence:', e.message)
    sock.updatePresence = async () => {} 
  }
} else {
  sock.updatePresence = async () => {} 
}
if (typeof sock.presenceSubscribe === 'function') {
  try {
    sock.presenceSubscribe = sock.presenceSubscribe.bind(sock)
  } catch (e) {
    console.log('⚠️ Error binding presenceSubscribe:', e.message)
    sock.presenceSubscribe = async () => {} 
  }
} else {
  sock.presenceSubscribe = async () => {} 
}

console.log('🔧 Propiedades básicas del SubBot configuradas')
} catch (error) {
console.log('⚙️ Error configurando propiedades básicas:', error.message)
}

try {
console.log('🔍 Configurando handler para SubBot recién conectado...')
const handlerModule = await import('../handler.js')
if (handlerModule && handlerModule.handler && typeof handlerModule.handler === 'function') {
  let originalHandler
  try {
    originalHandler = handlerModule.handler.bind(sock)
  } catch (bindError) {
    console.log('⚠️ Error en bind del handler, usando función directa:', bindError.message)
    originalHandler = handlerModule.handler
  }
  
  sock.handler = async (chatUpdate) => {
    try {
      console.log('📨 SubBot procesando mensaje:', {
        messages: chatUpdate?.messages?.length || 0,
        messageTypes: chatUpdate?.messages?.map(m => Object.keys(m.message || {})) || [],
        fromSender: chatUpdate?.messages?.[0]?.key?.fromMe ? 'SubBot' : 'Usuario'
      })
      
      if (originalHandler.bind) {
        return await originalHandler.call(sock, chatUpdate)
      } else {
        return await originalHandler(chatUpdate)
      }
    } catch (error) {
      if (error.message && error.message.includes('SessionError: No sessions')) {
        console.error('🚨 SessionError detectado en SubBot - Intentando recuperación de sesión:', error.message)
        
        try {
          if (sock.auth && sock.auth.keys && typeof sock.auth.keys.clear === 'function') {
            await sock.auth.keys.clear()
            console.log('🧹 Cache de sesiones limpiado')
          }
          
          setTimeout(async () => {
            if (sock.autoReconnect && sock.reconnectAttempts < sock.maxReconnectAttempts) {
              console.log('🔄 Iniciando reconexión por SessionError...')
              await attemptReconnect()
            }
          }, 5000)
          
        } catch (recoveryError) {
          console.error('❌ Error en recuperación de SessionError:', recoveryError.message)
        }
        return 
      }
      
      console.error('❌ Error en handler de SubBot:', error.message)
      console.error('Stack:', error.stack)
    }
  }

  try { sock.ev.removeAllListeners('messages.upsert') } catch (e) {}
  sock.ev.on("messages.upsert", sock.handler)
  console.log('✅ Handler configurado exitosamente para SubBot')
  console.log('🤖 SubBot está listo para procesar comandos')

setTimeout(() => {
  console.log('📣 Verificando estado del SubBot:', {
    isInit: sock.isInit,
    hasUser: !!sock.user,
    hasHandler: !!sock.handler,
    userId: sock.user?.id,
    handlerListeners: (() => {
      try {
        if (typeof sock.ev.listenerCount === 'function') return sock.ev.listenerCount('messages.upsert')
        if (typeof sock.ev.listeners === 'function') return sock.ev.listeners('messages.upsert').length
      } catch (e) {
        console.error('Error obteniendo listenerCount:', e.message)
      }
      return 0
    })()
  })
}, 2000)

} else {
console.error('⚠️ Error: Handler no válido para SubBot')
console.log('Handler module keys:', Object.keys(handlerModule || {}))
}
} catch (error) {
console.error('❌ Error configurando handler para SubBot:', error.message)
}

if (!global.conns.find(c => c.user?.jid === sock.user?.jid)) {
sock.createdAt = Date.now()
sock.lastActivity = Date.now()
global.conns.push(sock)
  vlog(chalk.green(`✅ SubBot agregado a pool - Total: ${global.conns.length}`))
}

const sessionDuration = Date.now() - sock.sessionStartTime
const durationFormatted = msToTime(sessionDuration)

let userName = sock.user.name || 'SubBot'
let userJid = sock.user.jid || `${path.basename(pathMikuJadiBot)}@s.whatsapp.net`

vlog(chalk.bold.green(`✅ SubBot conectado exitosamente:`))
vlog(chalk.cyan(`   👤 Delantero: ${userName}`))
vlog(chalk.cyan(`   📱 Número: +${path.basename(pathMikuJadiBot)}`))
vlog(chalk.cyan(`   🆔 JID: ${userJid}`))
vlog(chalk.cyan(`   🕒 Conectado: ${new Date().toLocaleString()}`))
vlog(chalk.cyan(`   ⏱️ Duración entrenamiento: ${durationFormatted}`))
vlog(chalk.cyan(`   🔄 Reconexiones: ${sock.reconnectAttempts}/${sock.maxReconnectAttempts}`))

await joinChannels(sock)

  try {
    const openRecipient = m?.chat || ((sock.user && sock.user.jid) ? sock.user.jid : null)
    sock._notifiedOpen = sock._notifiedOpen || false
    if (options.fromCommand && !sock._notifiedOpen && openRecipient && shouldNotifyUser(openRecipient)) {
      try {
        await conn.sendMessage(m.chat, { 
          text: `✅ *SubBot conectado exitosamente* ⚽\n\n` +
            `👤 *Delantero:* ${userName}\n` +
            `📱 *Número:* +${path.basename(pathMikuJadiBot)}\n` +
            `🕒 *Conectado:* ${new Date().toLocaleString()}\n` +
            `⏱️ *Duración entrenamiento:* ${durationFormatted}\n` +
            `🔄 *Reconexiones automáticas:* Activadas (${sock.maxReconnectAttempts} máx)\n` +
            `⚡ *Estado:* Visión directa activada\n` +
            `🔥 *Total Jugadores activos:* ${global.conns.length}\n\n` +
            `🎯 *Ahora puede usar comandos desde este dispositivo*`
        }, { quoted: m })
        sock._notifiedOpen = true
      } catch (e) {
        console.error('Error enviando notificación de SubBot abierto:', e?.message || e)
      }
    } else {
      console.log('Notificando apertura omitida para evitar spam o por cooldown')
    }
  } catch (e) {
    console.error('Error preparando notificación de apertura:', e?.message || e)
  }

setInterval(() => {
if (sock && sock.user) {
if (!sock.createdAt) sock.createdAt = sock.sessionStartTime || Date.now()
sock.lastActivity = Date.now()
}
}, 30000)
}
}

setInterval(async () => {
const currentTime = Date.now()
const instantCleanupThreshold = 60000 
const connectionAgeThreshold = 120000 

try {
  if (!global.conns || global.conns.length === 0) return
  
  const indicesToRemove = []
  
  for (let index = 0; index < global.conns.length; index++) {
    const conn = global.conns[index]
    
    if (!conn) {
      indicesToRemove.push(index)
      continue
    }
    
    const connectionAge = conn.createdAt ? currentTime - conn.createdAt : currentTime
    const lastActivity = conn.lastActivity || conn.createdAt || 0
    const inactiveTime = currentTime - lastActivity
    
    const shouldInstantCleanup = (
      (!conn.user || !conn.user.jid) ||
      conn._shouldDelete ||
      (conn.ws && conn.ws.socket && conn.ws.socket.readyState === 3 && inactiveTime > instantCleanupThreshold) ||
      (conn.connectionStatus === undefined && inactiveTime > instantCleanupThreshold) ||
      (!isSocketReady(conn) && connectionAge > connectionAgeThreshold && inactiveTime > instantCleanupThreshold)
    )
    
    if (shouldInstantCleanup) {
      const phoneNumber = conn.user?.jid ? cleanPhoneNumber(conn.user.jid) : 'unknown'
      
      try { 
        if (conn?.ws && typeof conn.ws.close === 'function') {
          conn.ws.close()
        }
      } catch (e) {}
      
      try { 
        if (conn?.ev && typeof conn.ev.removeAllListeners === 'function') {
          conn.ev.removeAllListeners()
        }
      } catch (e) {}
      
      indicesToRemove.push(index)
      
      console.log(chalk.blue(`🎯 Auto-limpieza: +${phoneNumber} (${Math.round(inactiveTime/1000)}s inactivo)`))
    }
  }
  
  if (indicesToRemove.length > 0) {
    indicesToRemove.reverse().forEach(i => {
      if (global.conns[i]) {
        global.conns.splice(i, 1)
      }
    })
    
    if (global.gc && indicesToRemove.length > 3) {
      global.gc()
      console.log(chalk.green(`♻️ Memoria liberada tras limpiar ${indicesToRemove.length} conexiones`))
    }
  }
  
} catch (error) {
  console.error(`❌ Error en limpieza optimizada: ${error.message}`)
}
}, 30000)

setInterval(() => {
  try {
    if (sock && sock.msgRetryCache) {
      const cacheKeys = Object.keys(sock.msgRetryCache)
      const now = Date.now()
      let cleanedCount = 0
      
      cacheKeys.forEach(key => {
        const entry = sock.msgRetryCache[key]
        if (entry && entry.timestamp && (now - entry.timestamp) > 600000) { 
          delete sock.msgRetryCache[key]
          cleanedCount++
        }
      })
      
      if (cleanedCount > 0) {
        console.log(`🧹 Caché limpiado: ${cleanedCount} entradas eliminadas`)
      }
    }
    
    if (sock && sock.chats) {
      const chatKeys = Object.keys(sock.chats)
      const chatCount = chatKeys.length
      
      if (chatCount > 1000) { 
        console.log(`🧹 Limpiando chats: ${chatCount} chats en memoria`)
        
        const sortedChats = chatKeys.map(key => ({
          key,
          lastMessageTime: sock.chats[key]?.lastMessageTime || 0
        })).sort((a, b) => b.lastMessageTime - a.lastMessageTime)
        
        const toDelete = sortedChats.slice(500)
        toDelete.forEach(chat => {
          delete sock.chats[chat.key]
        })
        
        console.log(`🧹 ${toDelete.length} chats antiguos eliminados de memoria`)
      }
    }
    
    if (global.gc && typeof global.gc === 'function') {
      global.gc()
      console.log('🧠 Garbage collection ejecutado')
    }
    
    const memUsage = process.memoryUsage()
    const memMB = Math.round(memUsage.heapUsed / 1024 / 1024)
    
    if (memMB > 500) { 
      console.log(`⚠️ Alto uso de memoria: ${memMB}MB - Ejecutando limpieza agresiva`)
      
      if (sock && sock.contacts) {
        const contactKeys = Object.keys(sock.contacts)
        if (contactKeys.length > 2000) {
          const importantContacts = {}
          contactKeys.slice(0, 1000).forEach(key => {
            importantContacts[key] = sock.contacts[key]
          })
          sock.contacts = importantContacts
          console.log(`🧹 ${contactKeys.length - 1000} contactos eliminados de memoria`)
        }
      }
    }
    
  } catch (error) {
    console.error('Error en gestión de memoria:', error.message)
  }
}, 5 * 60 * 1000) 

let handlerModule = await import('../handler.js')
let creloadHandler = async function (restatConn) {
try {
const Handler = await import(`../handler.js?update=${Date.now()}`).catch(console.error)
if (Handler && Handler.handler && typeof Handler.handler === 'function') {
handlerModule = Handler
console.log('✅ Handler cargado correctamente')
} else {
console.error('⚠️ Handler no válido o no encontrado')
console.log('Handler keys:', Object.keys(Handler || {}))
return false
}
} catch (e) {
console.error('⚠️ Error cargando handler: ', e)
return false
}

if (restatConn) {
const oldChats = sock.chats
try { sock.ws.close() } catch { }
sock.ev.removeAllListeners()

try {
  console.log('🔄 Recreando socket con opciones limpias...')
  const cleanReloadOptions = cleanSocketOptions(connectionOptions)
  sock = makeWASocket(cleanReloadOptions, { chats: oldChats })
} catch (error) {
  console.error('❌ Error recreando socket:', error.message)
  
  console.log('🔄 Usando opciones básicas como fallback...')
  const basicOptions = cleanSocketOptions(connectionOptions)
  sock = makeWASocket(basicOptions, { chats: oldChats })
}

sock.isInit = true
sock.well = false
sock.prefix = global.prefix || '#'
sock.chats = oldChats || {}
sock.contacts = sock.contacts || {}
sock.blocklist = sock.blocklist || {}

console.log('🔄 SubBot socket recreado en creloadHandler con propiedades')
isInit = true
}

if (!isInit) {
try {
sock.ev.off("messages.upsert", sock.handler)
sock.ev.off("connection.update", sock.connectionUpdate)
sock.ev.off('creds.update', sock.credsUpdate)
} catch (e) {
}
}

  try {
    if (!sock._presenceInterval) {
      sock._presenceInterval = setInterval(() => {
        try {
          if (isSocketReady(sock) && typeof sock.updatePresence === 'function') {
            sock.updatePresence('available').catch(() => {})
          }
        } catch (e) {}
      }, 30 * 1000)
    }
  } catch (e) {}
console.log('🔍 Verificando handler:', {
  handlerModule: !!handlerModule,
  hasHandler: !!(handlerModule && handlerModule.handler),
  handlerType: typeof (handlerModule && handlerModule.handler)
})

if (handlerModule && handlerModule.handler && typeof handlerModule.handler === 'function') {
  try { sock.ev.removeAllListeners('messages.upsert') } catch (e) {}
  sock.handler = handlerModule.handler.bind(sock)
  sock.ev.on("messages.upsert", sock.handler)
  console.log('✅ Handler configurado correctamente para SubBot (creloadHandler)')
} else {
  console.error('⚠️ Handler no disponible en creloadHandler, continuará sin procesar comandos hasta que se recargue')
}

const safeSaveCredsInitial = async () => {
  await ensureDirectoryAndSaveCreds()
}

sock.connectionUpdate = connectionUpdate.bind(sock)
sock.credsUpdate = safeSaveCredsInitial
sock.ev.on("connection.update", sock.connectionUpdate)
sock.ev.on("creds.update", sock.credsUpdate)
isInit = false
return true
}

await creloadHandler(false)
})
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
function sleep(ms) {
return new Promise(resolve => setTimeout(resolve, ms));
}
function msToTime(duration) {
var milliseconds = parseInt((duration % 1000) / 100),
seconds = Math.floor((duration / 1000) % 60),
minutes = Math.floor((duration / (1000 * 60)) % 60),
hours = Math.floor((duration / (1000 * 60 * 60)) % 24)
hours = (hours < 10) ? '0' + hours : hours
minutes = (minutes < 10) ? '0' + minutes : minutes
seconds = (seconds < 10) ? '0' + seconds : seconds
return minutes + ' m y ' + seconds + ' s '
}

async function joinChannels(conn) {
for (const channelId of Object.values(global.ch)) {
await conn.newsletterFollow(channelId).catch(() => {})
}
}