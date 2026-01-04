import { setTimeout } from 'timers/promises'


const RPG_CONFIG = {
  cooldown: 300000, 
  minReward: 50,
  maxReward: 300,
  criticalChance: 0.15, 
  escapeChance: 0.25, 
  bossChance: 0.05 
}


const ENEMIES = {
  common: [
    { name: "🐺 Lobo Salvaje", hp: 80, attack: 25, reward: [50, 100] },
    { name: "🕷️ Araña Gigante", hp: 60, attack: 20, reward: [40, 80] },
    { name: "🐍 Serpiente Venenosa", hp: 70, attack: 30, reward: [60, 120] },
    { name: "🦇 Murciélago Vampiro", hp: 50, attack: 35, reward: [45, 90] },
    { name: "🐻 Oso Feroz", hp: 120, attack: 40, reward: [80, 160] }
  ],
  boss: [
    { name: "🐉 Dragón Anciano", hp: 300, attack: 80, reward: [500, 800] },
    { name: "👹 Demonio Supremo", hp: 250, attack: 90, reward: [600, 900] },
    { name: "🔥 Fénix Ardiente", hp: 280, attack: 75, reward: [550, 750] },
    { name: "⚡ Titán del Trueno", hp: 320, attack: 85, reward: [700, 1000] }
  ]
}


const LOCATIONS = [
  "🌲 Bosque Encantado",
  "🏔️ Montañas Heladas", 
  "🏜️ Desierto Ardiente",
  "🏰 Ruinas Antiguas",
  "🌊 Costas Brumosas",
  "🌋 Volcán Activo",
  "❄️ Glaciar Eterno",
  "🗡️ Campo de Batalla"
]


const SPECIAL_EVENTS = [
  {
    name: "💎 Tesoro Encontrado",
    description: "¡Encuentras un cofre del tesoro!",
    reward: [200, 400],
    chance: 0.1
  },
  {
    name: "🍄 Poción Mágica", 
    description: "¡Bebes una poción que te da energía!",
    reward: [100, 200],
    chance: 0.15
  },
  {
    name: "⚔️ Arma Legendaria",
    description: "¡Encuentras un arma que vendes por buen precio!",
    reward: [300, 500],
    chance: 0.05
  }
]

let handler = async (m, { conn, usedPrefix, command }) => {
  const user = global.db.data.users[m.sender]
  
  
  if (!user.rpgData) {
    user.rpgData = {
      level: 1,
      hp: 100,
      maxHp: 100,
      attack: 20,
      defense: 10,
      exp: 0,
      wins: 0,
      losses: 0,
      lastAdventure: 0
    }
  }
  

  const now = Date.now()
  const cooldownTime = user.rpgData.lastAdventure + RPG_CONFIG.cooldown
  
  if (now < cooldownTime) {
    const remaining = Math.ceil((cooldownTime - now) / 1000 / 60)
    return m.reply(`⏰ Debes esperar ${remaining} minutos antes de tu próxima aventura.`)
  }
  
  
  if (user.rpgData.hp < user.rpgData.maxHp) {
    user.rpgData.hp = user.rpgData.maxHp
  }
  
  const location = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)]
  
 
  for (let event of SPECIAL_EVENTS) {
    if (Math.random() < event.chance) {
      const reward = Math.floor(Math.random() * (event.reward[1] - event.reward[0] + 1)) + event.reward[0]
      user.coin = (user.coin || 0) + reward
      user.rpgData.lastAdventure = now
      
      return m.reply(
        `🎲 **AVENTURA RPG** 🎲\n\n` +
        `📍 **Ubicación:** ${location}\n\n` +
        `${event.name}\n` +
        `${event.description}\n\n` +
        `💰 **Recompensa:** ${reward} monedas\n` +
        `💳 **Saldo:** ${user.coin} monedas`
      )
    }
  }
  
  
  const isBoss = Math.random() < RPG_CONFIG.bossChance
  const enemyList = isBoss ? ENEMIES.boss : ENEMIES.common
  const enemy = enemyList[Math.floor(Math.random() * enemyList.length)]
  
  
  const battleEnemy = {
    ...enemy,
    hp: enemy.hp
  }
  
  let battleLog = []
  battleLog.push(`🎲 *AVENTURA RPG* 🎲`)
  battleLog.push(`📍 *Ubicación:* ${location}`)
  battleLog.push(``)
  battleLog.push(`⚔️ *¡COMBATE!* ⚔️`)
  battleLog.push(`${isBoss ? "👑 *¡JEFE ENCONTRADO!* 👑" : ""}`)
  battleLog.push(`🆚 *Enemigo:* ${battleEnemy.name}`)
  battleLog.push(`❤️ HP: ${battleEnemy.hp} | ⚔️ ATK: ${battleEnemy.attack}`)
  battleLog.push(``)
  
  
  let turn = 1
  let playerWon = false
  
  while (user.rpgData.hp > 0 && battleEnemy.hp > 0 && turn <= 10) {
    battleLog.push(`🔸 *Turno ${turn}*`)
    
    
    let playerDamage = user.rpgData.attack + Math.floor(Math.random() * 20) - 10
    const isCritical = Math.random() < RPG_CONFIG.criticalChance
    
    if (isCritical) {
      playerDamage = Math.floor(playerDamage * 1.5)
      battleLog.push(`💥 *¡GOLPE CRÍTICO!*`)
    }
    
    playerDamage = Math.max(1, playerDamage)
    battleEnemy.hp -= playerDamage
    
    battleLog.push(`⚔️ Atacas por ${playerDamage} de daño`)
    battleLog.push(`❤️ ${battleEnemy.name}: ${Math.max(0, battleEnemy.hp)} HP`)
    
    if (battleEnemy.hp <= 0) {
      playerWon = true
      break
    }
    
    
    let enemyDamage = battleEnemy.attack + Math.floor(Math.random() * 15) - 7
    enemyDamage = Math.max(1, enemyDamage - user.rpgData.defense)
    
    user.rpgData.hp -= enemyDamage
    
    battleLog.push(`🗡️ ${battleEnemy.name} te ataca por ${enemyDamage} de daño`)
    battleLog.push(`❤️ Tu HP: ${Math.max(0, user.rpgData.hp)}`)
    battleLog.push(``)
    
    turn++
  }
  
  
  user.rpgData.lastAdventure = now
  
  if (playerWon) {
    const baseReward = Math.floor(Math.random() * (enemy.reward[1] - enemy.reward[0] + 1)) + enemy.reward[0]
    const bossBonus = isBoss ? Math.floor(baseReward * 0.5) : 0
    const totalReward = baseReward + bossBonus
    
    user.coin = (user.coin || 0) + totalReward
    user.rpgData.exp += isBoss ? 50 : 25
    user.rpgData.wins += 1
    
   
    const expNeeded = user.rpgData.level * 100
    if (user.rpgData.exp >= expNeeded) {
      user.rpgData.level += 1
      user.rpgData.exp = 0
      user.rpgData.maxHp += 20
      user.rpgData.hp = user.rpgData.maxHp
      user.rpgData.attack += 5
      user.rpgData.defense += 3
      
      battleLog.push(`🎉 *¡SUBISTE DE NIVEL!* 🎉`)
      battleLog.push(`📊 *Nivel:* ${user.rpgData.level}`)
      battleLog.push(`❤️ *HP Máximo:* ${user.rpgData.maxHp}`)
      battleLog.push(`⚔️ *Ataque:* ${user.rpgData.attack}`)
      battleLog.push(`🛡️ *Defensa:* ${user.rpgData.defense}`)
      battleLog.push(``)
    }
    
    battleLog.push(`🎉 *¡VICTORIA!* 🎉`)
    battleLog.push(`💰 *Recompensa:* ${totalReward} monedas ${bossBonus > 0 ? `(+${bossBonus} bonus jefe)` : ''}`)
    battleLog.push(`💳 *Saldo:* ${user.coin} monedas`)
    battleLog.push(`⭐ *EXP:* +${isBoss ? 50 : 25} (${user.rpgData.exp}/${user.rpgData.level * 100})`)
    
  } else {
    user.rpgData.losses += 1
    user.rpgData.hp = 0
    
    battleLog.push(`💀 *¡DERROTA!* 💀`)
    battleLog.push(`😵 Has sido derrotado...`)
    battleLog.push(`🏥 Tu HP se restaurará en la próxima aventura`)
  }
  
  
  battleLog.push(``)
  battleLog.push(`📊 *TUS ESTADÍSTICAS*`)
  battleLog.push(`🏆 Nivel: ${user.rpgData.level}`)
  battleLog.push(`❤️ HP: ${user.rpgData.hp}/${user.rpgData.maxHp}`)
  battleLog.push(`⚔️ ATK: ${user.rpgData.attack} | 🛡️ DEF: ${user.rpgData.defense}`)
  battleLog.push(`✅ Victorias: ${user.rpgData.wins} | ❌ Derrotas: ${user.rpgData.losses}`)
  
  await m.reply(battleLog.join('\n'))
}

handler.help = ['aventura', 'rpg']
handler.tags = ['rpg']
handler.command = /^(aventura|rpg)$/i
handler.group = true
handler.register = true

export default handler

