const SHOP_ITEMS = {
  potion: {
    name: "🧪 Poción de Salud",
    description: "Restaura 50 HP",
    price: 100,
    effect: 'heal'
  },
  megapotion: {
    name: "💉 Mega Poción",
    description: "Restaura toda la salud",
    price: 250,
    effect: 'fullheal'
  },
  strength: {
    name: "⚔️ Poción de Fuerza",
    description: "Aumenta ataque permanentemente +3",
    price: 500,
    effect: 'attack'
  },
  defense: {
    name: "🛡️ Poción de Defensa", 
    description: "Aumenta defensa permanentemente +2",
    price: 400,
    effect: 'defense'
  },
  vitality: {
    name: "❤️ Poción de Vitalidad",
    description: "Aumenta HP máximo permanentemente +15",
    price: 600,
    effect: 'hp'
  },
  experience: {
    name: "⭐ Pergamino de Experiencia",
    description: "Otorga 75 puntos de experiencia",
    price: 300,
    effect: 'exp'
  }
}

let handler = async (m, { conn, usedPrefix, command, text }) => {
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
  
  const coins = user.coin || 0
  
  
  if (!text) {
    let shopMessage = `🏪 *TIENDA RPG* 🏪\n\n`
    shopMessage += `💰 *Tus monedas:* ${coins}\n\n`
    shopMessage += `📋 *Artículos disponibles:*\n\n`
    
    Object.entries(SHOP_ITEMS).forEach(([key, item]) => {
      shopMessage += `*${item.name}*\n`
      shopMessage += `💭 ${item.description}\n`
      shopMessage += `💰 Precio: ${item.price} monedas\n`
      shopMessage += `📝 Comando: \`${usedPrefix}tiendarpg ${key}\`\n\n`
    })
    
    shopMessage += `💡 *Cómo usar:*\n`
    shopMessage += `• Escribe \`${usedPrefix}tiendarpg [item]\` para comprar\n`
    shopMessage += `• Ejemplo: \`${usedPrefix}tiendarpg potion\`\n\n`
    shopMessage += `🎮 *Otros comandos:*\n`
    shopMessage += `• \`${usedPrefix}aventura\` - Ir de aventura\n`
    shopMessage += `• \`${usedPrefix}rpgstats\` - Ver tu perfil`
    
    return m.reply(shopMessage)
  }
  
 
  const itemKey = text.toLowerCase().trim()
  const item = SHOP_ITEMS[itemKey]
  
  if (!item) {
    return m.reply(`❌ Artículo no encontrado. Usa \`${usedPrefix}tiendarpg\` para ver la tienda.`)
  }
  
  
  if (coins < item.price) {
    return m.reply(`💸 No tienes suficientes monedas.\n\n💰 *Necesitas:* ${item.price} monedas\n💳 *Tienes:* ${coins} monedas\n📊 *Te faltan:* ${item.price - coins} monedas`)
  }
  
  
  user.coin -= item.price
  let resultMessage = `✅ *¡Compra exitosa!* ✅\n\n`
  resultMessage += `🛍️ *Artículo:* ${item.name}\n`
  resultMessage += `💰 *Precio:* ${item.price} monedas\n`
  resultMessage += `💳 *Saldo restante:* ${user.coin} monedas\n\n`
  
  
  switch (item.effect) {
    case 'heal':
      const healAmount = Math.min(50, user.rpgData.maxHp - user.rpgData.hp)
      user.rpgData.hp += healAmount
      resultMessage += `❤️ *Efecto:* Recuperaste ${healAmount} HP\n`
      resultMessage += `🩺 *HP actual:* ${user.rpgData.hp}/${user.rpgData.maxHp}`
      break
      
    case 'fullheal':
      const fullHealAmount = user.rpgData.maxHp - user.rpgData.hp
      user.rpgData.hp = user.rpgData.maxHp
      resultMessage += `💚 *Efecto:* Recuperaste ${fullHealAmount} HP (Salud completa)\n`
      resultMessage += `🩺 *HP actual:* ${user.rpgData.hp}/${user.rpgData.maxHp}`
      break
      
    case 'attack':
      user.rpgData.attack += 3
      resultMessage += `⚔️ *Efecto:* Ataque aumentado permanentemente +3\n`
      resultMessage += `💪 *Ataque actual:* ${user.rpgData.attack}`
      break
      
    case 'defense':
      user.rpgData.defense += 2
      resultMessage += `🛡️ *Efecto:* Defensa aumentada permanentemente +2\n`
      resultMessage += `🔰 *Defensa actual:* ${user.rpgData.defense}`
      break
      
    case 'hp':
      user.rpgData.maxHp += 15
      user.rpgData.hp += 15 
      resultMessage += `❤️ *Efecto:* HP máximo aumentado permanentemente +15\n`
      resultMessage += `💓 *HP máximo actual:* ${user.rpgData.maxHp}`
      break
      
    case 'exp':
      user.rpgData.exp += 75
      resultMessage += `⭐ *Efecto:* Ganaste 75 puntos de experiencia\n`
      
      
      const expNeeded = user.rpgData.level * 100
      if (user.rpgData.exp >= expNeeded) {
        user.rpgData.level += 1
        user.rpgData.exp -= expNeeded
        user.rpgData.maxHp += 20
        user.rpgData.hp = user.rpgData.maxHp
        user.rpgData.attack += 5
        user.rpgData.defense += 3
        
        resultMessage += `\n🎉 *¡SUBISTE DE NIVEL!** 🎉\n`
        resultMessage += `📊 *Nuevo nivel:* ${user.rpgData.level}\n`
        resultMessage += `❤️ *HP máximo:* ${user.rpgData.maxHp}\n`
        resultMessage += `⚔️ *Ataque:* ${user.rpgData.attack}\n`
        resultMessage += `🛡️ *Defensa:* ${user.rpgData.defense}`
      } else {
        resultMessage += `📈 *EXP actual:* ${user.rpgData.exp}/${user.rpgData.level * 100}`
      }
      break
  }
  
  await m.reply(resultMessage)
}

handler.help = ['tiendarpg']
handler.tags = ['rpg']
handler.command = /^(tiendarpg|shopprg)$/i
handler.register = true

export default handler

