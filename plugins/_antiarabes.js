
const latinAmericaCodes = [
  /^(\+?51|51)\d*/,        // Perú ✅
  /^(\+?52|52)\d*/,        // México ✅
  /^(\+?53|53)\d*/,        // Cuba ✅
  /^(\+?54|54)\d*/,        // Argentina ✅
  /^(\+?55|55)\d*/,        // Brasil ✅
  /^(\+?56|56)\d*/,        // Chile ✅
  /^(\+?57|57)\d*/,        // Colombia ✅
  /^(\+?58|58)\d*/,        // Venezuela ✅
  /^(\+?591|591)\d*/,      // Bolivia ✅
  /^(\+?592|592)\d*/,      // Guyana ✅
  /^(\+?593|593)\d*/,      // Ecuador ✅
  /^(\+?594|594)\d*/,      // Guayana Francesa ✅
  /^(\+?595|595)\d*/,      // Paraguay ✅
  /^(\+?596|596)\d*/,      // Martinica ✅
  /^(\+?597|597)\d*/,      // Surinam ✅
  /^(\+?598|598)\d*/,      // Uruguay ✅
  /^(\+?599|599)\d*/,      // Antillas Neerlandesas ✅
]

const arabicSpamPatterns = [
  
  /^(\+?202|202)\d*/,      // Egipto
  /^(\+?20|20)\d*/,        // Egipto (código corto)
  /^(\+?212|212)\d*/,      // Marruecos  
  /^(\+?213|213)\d*/,      // Argelia
  /^(\+?216|216)\d*/,      // Túnez
  /^(\+?218|218)\d*/,      // Libia
  /^(\+?221|221)\d*/,      // Senegal
  /^(\+?222|222)\d*/,      // Mauritania
  /^(\+?223|223)\d*/,      // Mali
  /^(\+?224|224)\d*/,      // Guinea
  /^(\+?225|225)\d*/,      // Costa de Marfil
  /^(\+?226|226)\d*/,      // Burkina Faso
  /^(\+?227|227)\d*/,      // Níger
  /^(\+?228|228)\d*/,      // Togo
  /^(\+?229|229)\d*/,      // Benín
  /^(\+?230|230)\d*/,      // Mauricio
  /^(\+?231|231)\d*/,      // Liberia
  /^(\+?232|232)\d*/,      // Sierra Leona
  /^(\+?233|233)\d*/,      // Ghana
  /^(\+?234|234)\d*/,      // Nigeria
  /^(\+?235|235)\d*/,      // Chad
  /^(\+?236|236)\d*/,      // República Centroafricana
  /^(\+?237|237)\d*/,      // Camerún
  /^(\+?238|238)\d*/,      // Cabo Verde
  /^(\+?239|239)\d*/,      // Santo Tomé y Príncipe
  /^(\+?240|240)\d*/,      // Guinea Ecuatorial
  /^(\+?241|241)\d*/,      // Gabón
  /^(\+?242|242)\d*/,      // República del Congo
  /^(\+?243|243)\d*/,      // República Democrática del Congo
  /^(\+?244|244)\d*/,      // Angola
  /^(\+?245|245)\d*/,      // Guinea-Bissau
  /^(\+?246|246)\d*/,      // Diego García
  /^(\+?247|247)\d*/,      // Santa Elena
  /^(\+?248|248)\d*/,      // Seychelles
  /^(\+?249|249)\d*/,      // Sudán
  /^(\+?250|250)\d*/,      // Ruanda
  /^(\+?251|251)\d*/,      // Etiopía
  /^(\+?252|252)\d*/,      // Somalia
  /^(\+?253|253)\d*/,      // Yibuti
  /^(\+?254|254)\d*/,      // Kenia
  /^(\+?255|255)\d*/,      // Tanzania
  /^(\+?256|256)\d*/,      // Uganda
  /^(\+?257|257)\d*/,      // Burundi
  /^(\+?258|258)\d*/,      // Mozambique
  /^(\+?260|260)\d*/,      // Zambia
  /^(\+?261|261)\d*/,      // Madagascar
  /^(\+?262|262)\d*/,      // Reunión/Mayotte
  /^(\+?263|263)\d*/,      // Zimbabue
  /^(\+?264|264)\d*/,      // Namibia
  /^(\+?265|265)\d*/,      // Malawi
  /^(\+?266|266)\d*/,      // Lesoto
  /^(\+?267|267)\d*/,      // Botsuana
  /^(\+?268|268)\d*/,      // Esuatini
  /^(\+?269|269)\d*/,      // Comoras
  /^(\+?290|290)\d*/,      // Santa Elena
  /^(\+?291|291)\d*/,      // Eritrea
  /^(\+?297|297)\d*/,      // Aruba
  /^(\+?298|298)\d*/,      // Islas Feroe
  /^(\+?299|299)\d*/,      // Groenlandia
  /^(\+?350|350)\d*/,      // Gibraltar
  /^(\+?351|351)\d*/,      // Portugal
  /^(\+?352|352)\d*/,      // Luxemburgo
  /^(\+?353|353)\d*/,      // Irlanda
  /^(\+?354|354)\d*/,      // Islandia
  /^(\+?355|355)\d*/,      // Albania
  /^(\+?356|356)\d*/,      // Malta
  /^(\+?357|357)\d*/,      // Chipre
  /^(\+?358|358)\d*/,      // Finlandia
  /^(\+?359|359)\d*/,      // Bulgaria
  /^(\+?370|370)\d*/,      // Lituania
  /^(\+?371|371)\d*/,      // Letonia
  /^(\+?372|372)\d*/,      // Estonia
  /^(\+?373|373)\d*/,      // Moldavia
  /^(\+?374|374)\d*/,      // Armenia
  /^(\+?375|375)\d*/,      // Bielorrusia
  /^(\+?376|376)\d*/,      // Andorra
  /^(\+?377|377)\d*/,      // Mónaco
  /^(\+?378|378)\d*/,      // San Marino
  /^(\+?380|380)\d*/,      // Ucrania
  /^(\+?381|381)\d*/,      // Serbia
  /^(\+?382|382)\d*/,      // Montenegro
  /^(\+?383|383)\d*/,      // Kosovo
  /^(\+?385|385)\d*/,      // Croacia
  /^(\+?386|386)\d*/,      // Eslovenia
  /^(\+?387|387)\d*/,      // Bosnia y Herzegovina
  /^(\+?389|389)\d*/,      // Macedonia del Norte
  /^(\+?420|420)\d*/,      // República Checa
  /^(\+?421|421)\d*/,      // Eslovaquia
  /^(\+?423|423)\d*/,      // Liechtenstein
  /^(\+?500|500)\d*/,      // Islas Malvinas
  /^(\+?501|501)\d*/,      // Belice
  /^(\+?502|502)\d*/,      // Guatemala
  /^(\+?503|503)\d*/,      // El Salvador
  /^(\+?504|504)\d*/,      // Honduras
  /^(\+?505|505)\d*/,      // Nicaragua
  /^(\+?506|506)\d*/,      // Costa Rica
  /^(\+?507|507)\d*/,      // Panamá
  /^(\+?508|508)\d*/,      // San Pedro y Miquelón
  /^(\+?509|509)\d*/,      // Haití
  /^(\+?590|590)\d*/,      // Guadalupe
  /^(\+?591|591)\d*/,      // Bolivia
  /^(\+?592|592)\d*/,      // Guyana
  /^(\+?593|593)\d*/,      // Ecuador
  /^(\+?594|594)\d*/,      // Guayana Francesa
  /^(\+?595|595)\d*/,      // Paraguay
  /^(\+?596|596)\d*/,      // Martinica
  /^(\+?597|597)\d*/,      // Surinam
  /^(\+?598|598)\d*/,      // Uruguay
  /^(\+?599|599)\d*/,      // Antillas Neerlandesas
  /^(\+?670|670)\d*/,      // Timor Oriental
  /^(\+?672|672)\d*/,      // Territorio Antártico Australiano
  /^(\+?673|673)\d*/,      // Brunéi
  /^(\+?674|674)\d*/,      // Nauru
  /^(\+?675|675)\d*/,      // Papúa Nueva Guinea
  /^(\+?676|676)\d*/,      // Tonga
  /^(\+?677|677)\d*/,      // Islas Salomón
  /^(\+?678|678)\d*/,      // Vanuatu
  /^(\+?679|679)\d*/,      // Fiyi
  /^(\+?680|680)\d*/,      // Palaos
  /^(\+?681|681)\d*/,      // Wallis y Futuna
  /^(\+?682|682)\d*/,      // Islas Cook
  /^(\+?683|683)\d*/,      // Niue
  /^(\+?684|684)\d*/,      // Samoa Americana
  /^(\+?685|685)\d*/,      // Samoa
  /^(\+?686|686)\d*/,      // Kiribati
  /^(\+?687|687)\d*/,      // Nueva Caledonia
  /^(\+?688|688)\d*/,      // Tuvalu
  /^(\+?689|689)\d*/,      // Polinesia Francesa
  /^(\+?690|690)\d*/,      // Tokelau
  /^(\+?691|691)\d*/,      // Micronesia
  /^(\+?692|692)\d*/,      // Islas Marshall
  /^(\+?850|850)\d*/,      // Corea del Norte
  /^(\+?852|852)\d*/,      // Hong Kong
  /^(\+?853|853)\d*/,      // Macao
  /^(\+?855|855)\d*/,      // Camboya
  /^(\+?856|856)\d*/,      // Laos
  /^(\+?880|880)\d*/,      // Bangladés
  /^(\+?886|886)\d*/,      // Taiwán
  /^(\+?960|960)\d*/,      // Maldivas
  /^(\+?961|961)\d*/,      // Líbano
  /^(\+?962|962)\d*/,      // Jordania
  /^(\+?963|963)\d*/,      // Siria
  /^(\+?964|964)\d*/,      // Irak
  /^(\+?965|965)\d*/,      // Kuwait
  /^(\+?966|966)\d*/,      // Arabia Saudí
  /^(\+?967|967)\d*/,      // Yemen
  /^(\+?968|968)\d*/,      // Omán
  /^(\+?970|970)\d*/,      // Palestina
  /^(\+?971|971)\d*/,      // Emiratos Árabes Unidos
  /^(\+?972|972)\d*/,      // Israel
  /^(\+?973|973)\d*/,      // Baréin
  /^(\+?974|974)\d*/,      // Catar
  /^(\+?975|975)\d*/,      // Bután
  /^(\+?976|976)\d*/,      // Mongolia
  /^(\+?977|977)\d*/,      // Nepal
  /^(\+?992|992)\d*/,      // Tayikistán
  /^(\+?993|993)\d*/,      // Turkmenistán
  /^(\+?994|994)\d*/,      // Azerbaiyán
  /^(\+?995|995)\d*/,      // Georgia
  /^(\+?996|996)\d*/,      // Kirguistán
  /^(\+?998|998)\d*/,      // Uzbekistán
  
  
]


const arabicCharacterPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/



function isSpamNumber(phoneNumber) {
  if (!phoneNumber) return false
  
  const cleanNumber = phoneNumber.replace(/[\s\-\(\)]/g, '')
  console.log(`🔍 [ANTIARABES] Analizando número: ${cleanNumber}`)
  
  
  if (cleanNumber.includes('jid') || /\d{15,}/.test(cleanNumber)) {
    console.log(`🚨 [ANTIARABES] JID detectado (número muy largo): ${cleanNumber}`)
    return true
  }
  
  
  if (cleanNumber.includes('net') || cleanNumber.includes('srv') || /\d{13,14}/.test(cleanNumber)) {
    console.log(`🚨 [ANTIARABES] NET/SERVER detectado: ${cleanNumber}`)
    return true
  }
  
  
  if (/^\d{13,}$/.test(cleanNumber) && cleanNumber.length > 15) {
    console.log(`🔧 [ANTIARABES] LID detectado (número extremo): ${cleanNumber}`)
    return true
  }
  
  return false
}

function isArabicSpamNumber(phoneNumber) {
  if (!phoneNumber) return false
  
  
  if (isSpamNumber(phoneNumber)) {
    console.log(`💢 [ANTIARABES] Número spam detectado: ${phoneNumber}`)
    return true
  }
  
  const cleanNumber = phoneNumber.replace(/[\s\-\(\)]/g, '')
  
  
  const isLatinAmerica = latinAmericaCodes.some(pattern => pattern.test(cleanNumber))
  if (isLatinAmerica) {
    console.log(`✅ [ANTIARABES] Número latinoamericano válido (NO bloqueado): ${cleanNumber}`)
    return false 
  }
  
  
  const isSpam = arabicSpamPatterns.some(pattern => pattern.test(cleanNumber))
  if (isSpam) {
    console.log(`🚫 [ANTIARABES] Número de spam árabe detectado: ${cleanNumber}`)
    return true
  }
  
  return false
}


function hasArabicCharacters(text) {
  return arabicCharacterPattern.test(text)
}



function isArabicSpam(phoneNumber, messageText = '') {
  console.log(`🔍 [ANTIARABES] ======== ANÁLISIS COMPLETO ========`)
  console.log(`🔍 [ANTIARABES] Número: ${phoneNumber}`)
  console.log(`🔍 [ANTIARABES] Mensaje: "${messageText.substring(0, 50)}..."`)
  
  
  if (isArabicSpamNumber(phoneNumber)) {
    console.log(`✅ [ANTIARABES] SPAM DETECTADO por número`)
    return true
  }
  
  
  if (messageText && hasArabicCharacters(messageText)) {
    console.log(`✅ [ANTIARABES] SPAM DETECTADO por caracteres árabes en mensaje`)
    return true
  }
  
  console.log(`✅ [ANTIARABES] Número y mensaje verificados como legítimos`)
  console.log(`🔍 [ANTIARABES] ======== FIN ANÁLISIS ========`)
  return false
}

const handler = async (m, { conn, isAdmin, isBotAdmin, isOwner }) => {
  
  if (!m.isGroup) return
  
  
  let chat = global.db.data.chats[m.chat]
  if (!chat.antiarabes) return
  
  
  if (isAdmin || isOwner) return
  
  
  if (!isBotAdmin) return
  
  try {
    const senderNumber = m.sender.split('@')[0]
    const messageText = m.text || ''
    
    console.log(`🔍 Anti-Árabes: Verificando número ${senderNumber}`)
    
    
    if (isArabicSpam(senderNumber, messageText)) {
      console.log(`🚫 Anti-Árabes: ¡SPAM DETECTADO! Número: ${senderNumber}`)
      
      
      await conn.sendMessage(m.chat, { delete: m.key })
      
      
      const warningMsg = await conn.sendMessage(m.chat, {
        text: `🚫 *ANTI-ÁRABES ACTIVADO*\n\n` +
              `👤 *Usuario:* @${senderNumber}\n` +
              `📱 *Número:* +${senderNumber}\n` +
              `🔍 *Razón:* Número sospechoso de spam (JID/NET/LID o código árabe)\n` +
              `⚡ *Acción:* Usuario expulsado\n\n` +
              `> *Este grupo está protegido contra spam internacional*`,
        mentions: [m.sender]
      })
      
     
      await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
      
      
      setTimeout(async () => {
        try {
          await conn.sendMessage(m.chat, { delete: warningMsg.key })
        } catch (e) {}
      }, 10000)
      
      return true
    } else {
      console.log(`✅ Anti-Árabes: Número verificado como legítimo: ${senderNumber}`)
    }
    
  } catch (error) {
    console.error('Error en anti-árabes:', error)
  }
  
  return false
}

handler.before = async (m, { conn, isAdmin, isBotAdmin, isOwner }) => {
  return await handler(m, { conn, isAdmin, isBotAdmin, isOwner })
}

export default handler