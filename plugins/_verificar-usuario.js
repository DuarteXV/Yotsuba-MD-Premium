let restrictionCooldowns = new Map()

export async function before(m, { conn, isBotAdmin, isAdmin, usedPrefix }) {
  if (m.isBaileys || m.fromMe || m.chat?.endsWith('@g.us')) return true

  const user = global.db.data.users[m.sender]

  const comandosPermitidos = [
    'reg', 'register', 'registrar', 'verify', 'verificar',
    'menu', 'help', 'ayuda', 'start', 'ping', 'p', 'info', 'infobot',
    'estado', 'status', 'uptime', 'speed', 'speedtest'
  ]

  const comando = m.text?.slice(1)?.split(' ')?.[0]?.toLowerCase() || ''
  const esComandoPermitido = comandosPermitidos.some(cmd => comando.includes(cmd))

  if (esComandoPermitido) return true

  if (!user || !user.registered) {
    const userId = m.sender
    const now = Date.now()
    const lastMessage = restrictionCooldowns.get(userId) || 0
    const cooldownTime = 5 * 60 * 1000

    if (now - lastMessage < cooldownTime) {
      return false
    }

    restrictionCooldowns.set(userId, now)

    const restrictMsg = `🚫 *BOT RESTRINGIDO* 🚫\n\n🔥 *Para usar comandos necesitas registrarte*\n\n🎯 *Usa .reg nombre.edad*\n\n*Ejemplo:*\n.reg ${m.name || 'IsagiDelanero'}.18\n\n⚽️ *¡Regístrate para acceder a todas las funciones!*`

    await m.reply(restrictMsg)
    return false
  }

  return true
}

export async function handler() {
  return false
}