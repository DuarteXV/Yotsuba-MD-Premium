// 🛡️ ANTITÓXICO AVANZADO - Base de datos expandida de palabras
console.log('🚀 [ANTITOXIC-ADVANCED] Base de datos de moderación cargada')

// 🎯 Lista expandida de palabras prohibidas por categorías
export const toxicDatabase = {
  // 🔸 Palabras básicamente ofensivas (solo advertencia)
  basic: [
    // Insultos comunes
    'tonto', 'tonta', 'idiota', 'estupido', 'estúpido', 'imbecil', 'imbécil',
    'burro', 'burra', 'bestia', 'animal', 'salvaje', 'bruto', 'bruta',
    'loco', 'loca', 'demente', 'enfermo', 'enferma',
    
    // Palabras ofensivas básicas
    'puto', 'puta', 'cabron', 'cabrón', 'pendejo', 'pendeja',
    'mierda', 'joder', 'coño', 'cono', 'carajo', 'verga',
    'chingar', 'chinga', 'pinche', 'culero', 'culera',
    
    // Variaciones con números/símbolos
    'p3nd3jo', 'p3nd3ja', 'c4bron', 'c4brón', 'm13rd4',
    'p.u.t.o', 'p-u-t-a', 'c@bron', 'c@brón',
    
    // Palabras en otros idiomas
    'fuck', 'shit', 'damn', 'bitch', 'asshole',
    'merda', 'cazzo', 'stronzo', 'figlio di puttana'
  ],
  
  // 🚨 Palabras muy ofensivas (expulsión inmediata)
  severe: [
    // Insultos familiares graves
    'hijo de puta', 'hijueputa', 'hija de puta', 'hijaputa',
    'la concha de tu madre', 'tu madre', 'tu mama',
    'vete a la mierda', 'vete al carajo',
    'chupa pija', 'chupapijas', 'come mierda', 'comemierda',
    'malparido', 'malparida', 'gonorrea',
    
    // Abreviaciones ofensivas
    'hp', 'hdp', 'hdspm', 'ptm', 'ctm', 'lcdtm',
    'sdjp', 'vlm', 'qtm', 'lpm',
    
    // Insultos sexuales severos
    'perra', 'zorra', 'guarra', 'furcia', 'ramera',
    'prostituta', 'meretriz', 'putón', 'putona',
    
    // Variaciones extremas
    'h1j0 d3 p*t4', 'h.d.p', 'p.t.m', 'c.t.m'
  ],
  
  // 🚫 Palabras discriminatorias (expulsión inmediata)
  discriminatory: [
    // Discriminación racial
    'negro de mierda', 'india', 'indio sucio', 'chino', 'china',
    'sudaca', 'sudaco', 'pocho', 'pocha', 'gringo sucio',
    'blanquito', 'moreno', 'trigueño', 'amarillo',
    
    // Discriminación por orientación
    'marica', 'maricon', 'maricón', 'gay de mierda', 'joto',
    'pargo', 'loca', 'travesti', 'transformista',
    'bollera', 'tortillera', 'lesbiana',
    
    // Discriminación religiosa
    'cristiano', 'musulman', 'judio', 'ateo', 'pagano',
    
    // Discriminación por nacionalidad
    'mexicano', 'colombiano', 'venezolano', 'argentino',
    'chileno', 'peruano', 'ecuatoriano', 'boliviano'
  ],
  
  // ⚠️ Contenido inapropiado (advertencia)
  inappropriate: [
    // Referencias a drogas
    'cocaina', 'marihuana', 'mota', 'porro', 'hierba',
    'crack', 'heroina', 'lsd', 'extasis', 'mdma',
    'droga', 'drogadicto', 'fumarse', 'esnifar',
    
    // Referencias a violencia
    'matar', 'morir', 'muerte', 'asesinar', 'suicidio',
    'suicidate', 'matate', 'murete', 'ahorcate',
    'disparar', 'balacera', 'cuchillo', 'navaja',
    
    // Contenido sexual inapropiado
    'sexo', 'follar', 'coger', 'tirar', 'culear',
    'masturbarse', 'pajear', 'masturbar', 'venirse',
    'orgasmo', 'eyacular', 'correrse', 'gemir',
    
    // Partes del cuerpo de forma vulgar
    'pene', 'vagina', 'tetas', 'culo', 'nalgas',
    'polla', 'verga', 'pito', 'chocha', 'concha'
  ],
  
  // 🔥 Patrones especiales (detección avanzada)
  patterns: [
    // Repetición de caracteres para evitar filtros
    /(.)\1{3,}/g, // ej: "puuuuuta", "cabronnnnn"
    
    // Espacios entre letras para evitar filtros
    /p\s*u\s*t\s*[oa]/gi, // ej: "p u t o", "p-u-t-a"
    /c\s*a\s*b\s*r\s*[oó]\s*n/gi, // ej: "c a b r ó n"
    
    // Números y símbolos como letras
    /p3nd3j[oa]/gi, // ej: "p3nd3jo", "p3nd3ja"
    /m13rd4/gi, // ej: "m13rd4"
    /c4br[oó]n/gi, // ej: "c4brón"
    
    // Símbolos como separadores
    /p[\.\-_@#\*]u[\.\-_@#\*]t[\.\-_@#\*][oa]/gi,
    /c[\.\-_@#\*]a[\.\-_@#\*]b[\.\-_@#\*]r[\.\-_@#\*][oó][\.\-_@#\*]n/gi
  ]
}

// 🔍 Función para detectar patrones especiales
export function detectSpecialPatterns(text) {
  const normalizedText = text.toLowerCase()
  
  for (const pattern of toxicDatabase.patterns) {
    if (pattern.test(normalizedText)) {
      console.log(`🔍 [ANTITOXIC-ADVANCED] Patrón especial detectado: ${pattern}`)
      return true
    }
  }
  
  return false
}

// 🛡️ Función para obtener nivel de toxicidad
export function getToxicityLevel(foundWords) {
  // Determinar el nivel más alto encontrado
  const levels = {
    severe: 4,
    discriminatory: 3,
    inappropriate: 2,
    basic: 1
  }
  
  let maxLevel = 0
  let maxSeverity = 'none'
  
  for (const category in toxicDatabase) {
    if (category === 'patterns') continue
    
    for (const word of foundWords) {
      if (toxicDatabase[category].includes(word.toLowerCase())) {
        if (levels[category] > maxLevel) {
          maxLevel = levels[category]
          maxSeverity = category
        }
      }
    }
  }
  
  return maxSeverity
}

// 📊 Estadísticas de la base de datos
const stats = {
  basic: toxicDatabase.basic.length,
  severe: toxicDatabase.severe.length,
  discriminatory: toxicDatabase.discriminatory.length,
  inappropriate: toxicDatabase.inappropriate.length,
  patterns: toxicDatabase.patterns.length,
  total: toxicDatabase.basic.length + toxicDatabase.severe.length + 
         toxicDatabase.discriminatory.length + toxicDatabase.inappropriate.length
}

console.log('📊 [ANTITOXIC-ADVANCED] Base de datos cargada:')
console.log(`📊 [ANTITOXIC-ADVANCED] - Básicas: ${stats.basic} palabras`)
console.log(`📊 [ANTITOXIC-ADVANCED] - Severas: ${stats.severe} palabras`)
console.log(`📊 [ANTITOXIC-ADVANCED] - Discriminatorias: ${stats.discriminatory} palabras`)
console.log(`📊 [ANTITOXIC-ADVANCED] - Inapropiadas: ${stats.inappropriate} palabras`)
console.log(`📊 [ANTITOXIC-ADVANCED] - Patrones especiales: ${stats.patterns}`)
console.log(`📊 [ANTITOXIC-ADVANCED] - TOTAL: ${stats.total} palabras + patrones`)

export { stats }