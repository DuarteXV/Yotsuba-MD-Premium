const { generateWAMessageFromContent, proto } = (await import('@whiskeysockets/baileys')).default

var handler = async (m, { conn, text}) => {

conn.reply(m.chat, `${emoji2} Buscando un chiste, espere un momento...`, m)

conn.reply(m.chat, `*┏━_͜͡-͜͡-͜͡-͜͡-͜͡-͜͡-͜͡⚘-͜͡-͜͡-͜͡-͜͡-͜͡-͜͡-͜͡⚘-͜͡-͜͡-͜͡-͜͡-͜͡-͜͡-͜͡⚘-͜͡-͜͡-͜͡-͜͡-͜͡-͜͡_͜͡━┓*\n\n❥ *"${pickRandom(global.chiste)}"*\n\n*┗━_͜͡-͜͡-͜͡-͜͡-͜͡-͜͡-͜͡⚘-͜͡-͜͡-͜͡-͜͡-͜͡-͜͡-͜͡⚘-͜͡-͜͡-͜͡-͜͡-͜͡-͜͡-͜͡⚘-͜͡-͜͡-͜͡-͜͡-͜͡-͜͡_͜͡━┛*`, m)

}
handler.help = ['chiste']
handler.tags = ['fun']
handler.command = ['chiste']
handler.fail = null
handler.exp = 0
handler.group = true;
handler.register = true

export default handler

let hasil = Math.floor(Math.random() * 5000)
function pickRandom(list) {
return list[Math.floor(list.length * Math.random())]
}

global.chiste = [
    "¿Cuál es el último animal que subió al arca de Noé? El del-fin..", 
    "¿Cómo se dice pañuelo en japonés? Saka-moko", 
    "¿Cómo se dice disparo en árabe? Ahí-va-la-bala..", 
    "¿Qué le dice un gusano a otro gusano? Voy a dar una vuelta a la manzana.", 
    "Un gato empieza a ladrar en el tejado de una casa. Otro gato, sorprendido, le dice: Estás loco gato, ¿por qué ladras en vez de maullar? El gatito le responde: ¿A caso no puedo aprender otro idioma?", 
    "El doctor le dice al paciente: respire profundo que lo voy a auscultar. El paciente le responde: doctor, ¿de quién me va a ocultar si no le debo a nadie?\nSale el doctor después de un parto y el padre de la criatura le pregunta: ¿Doctor cómo salió todo? El doctor le dice: todo salió bien, pero tuvimos que colocarle oxígeno al bebé. El padre, horrorizado, le dice: pero doctor, nosotros queríamos ponerle Gabriel..", 
    "Un pez le pregunta a otro pez: ¿qué hace tu mamá? Este le contesta: Nada, ¿y la tuya qué hace? Nada también.", 
    "¿Cuál es el colmo de Aladdín? Tener mal genio", 
    "El profesor le dice al estudiante después de haberle corregido la tarea: Tu trabajo me ha conmovido. El estudiante, sorprendido, le pregunta: ¿Y eso por qué profesor? El profesor con cara de burla le dice: Porque me dio mucha pena.", 
    "Le dice el niño a la madre: Mamá, no quiero jugar más con Pedrito. La madre le pregunta al niño: ¿Por qué no quieres jugar más con él? Porque cuando jugamos a los tacos de madera y le pego con uno en la cabeza, de repente se pone a llorar.", 
    "A Juanito le dice la maestra: Juanito, ¿qué harías si te estuvieses ahogando en la piscina? Juanito le responde: Me pondría a llorar mucho para desahogarme.", 
    "Hijo, me veo gorda, fea y vieja. ¿Qué tengo hijo, qué tengo? Mamá, tienes toda la razón.", 
    "¿Cómo se dice pelo sucio en chino? Chin cham pu.", 
    "Había una vez un niño tan, tan, tan despistado que... ¡da igual, me he olvidado del chiste!", 
    "Una amiga le dice a otra amiga: ¿Qué tal va la vida de casada? Pues no me puedo quejar, dice ella. ¿O sea que va muy bien, no? No, no me puedo quejar porque mi marido está aquí al lado.", 
    "¿Por qué las focas miran siempre hacia arriba? ¡Porque ahí están los focos!", 
    "Camarero, ese filete tiene muchos nervios. Pues normal, es la primera vez que se lo comen.", 
    "¿Cómo se llama el primo de Bruce Lee? Broco Lee.", 
    "Una madre le dice a su hijo: Jaimito, me ha dicho un pajarito que te drogas. La que te drogas eres tú, que hablas con pajaritos.",
    
    // Chistes con doble sentido
    "¿Qué hace una abeja en el gimnasio? ¡Zum-ba!",
    "¿Por qué los pájaros vuelan hacia el sur? Porque caminando tardarían mucho...",
    "¿Qué le dijo un semáforo a otro semáforo? No me mires, me estoy cambiando...",
    "¿Cómo se llama el campeón de buceo japonés? Tokofondo",
    "¿Qué hace una uva en un columpio? U-va y viene",
    "¿Por qué los esqueletos no pelean entre sí? Porque no tienen agallas...",
    "¿Qué le dice una iguana a su hermana gemela? Somos iguanitas",
    "¿Cómo se despiden los químicos? Ácido un placer",
    "¿Qué le dice un techo a otro techo? Techo de menos",
    "¿Por qué las galletas van al psicólogo? Porque se sienten deshechas",
    "¿Qué hace una aguja en un pajar? Buscando al marido",
    "¿Cómo se llama el vendedor de huevos? Don Ovo",
    "¿Qué le dice un árbol a otro? ¿Qué hojas?",
    "¿Por qué los músicos no pueden esconderse? Porque siempre dan la nota",
    "¿Qué hace un perro con un taladro? Taladrando",
    "¿Cómo se llama el primo de un calvo? Pelón",
    "¿Qué le dice un zapato a otro? ¿Qué pisas?",
    "¿Por qué los elefantes no usan computadoras? Porque le tienen miedo al mouse",
    "¿Qué hace un pez en el cine? Nada",
    "¿Cómo se dice 'silla' en chino? Chi-lla",
    "¿Qué le dijo el tomate al otro tomate? ¡Vamos, date prisa, que nos ketchup!",
    "¿Por qué los fantasmas no mienten? Porque se les transparenta todo",
    "¿Qué hace una lavadora en una fiesta? Da vueltas y más vueltas",
    "¿Cómo se llama el rey de los tomates? El rey Tomate",
    "¿Qué le dice un huevo a una sartén? Me tienes frito",
    "¿Por qué los libros de matemáticas están siempre tristes? Porque tienen muchos problemas",
    "¿Qué hace un mago en la cocina? Hace des-a-pariciones",
    "¿Cómo se saluda un esquimal? Con hielo",
    "¿Qué le dice un limón a otro? ¡Juntos hacemos limonada!",
    "¿Por qué las plantas no pueden jugar al escondite? Porque siempre las encuentran",
    
    // Chistes negros (humor oscuro)
    "¿Qué hace un mudo en un funeral? Nada, pero se hace el interesante",
    "¿Cuál es el colmo de un electricista? Morir electrocutado",
    "¿Por qué los cementerios tienen rejas? Porque la gente se muere por entrar",
    "¿Qué le dice un esqueleto a otro? Si no me hablas te desarmo",
    "¿Cómo se llama el que corta el césped en el cementerio? Corta-muertos",
    "¿Qué hace un zombie cuando llueve? Se moja",
    "Mamá, mamá, en el colegio me dicen fantasma. Cállate y pasa la pared",
    "¿Por qué los fantasmas son tan malos estudiantes? Porque siempre andan en blanco",
    "¿Qué le dice una tumba a otra? ¿Qué hay de nuev-o-tario?",
    "Doctor, doctor, me siento como una ventana. No se preocupe, eso se le pasará transparente",
    "¿Cuál es la fruta más suicida? La manzana de Blancanieves",
    "¿Qué hace un calvo en una peluquería? Perder el tiempo",
    "¿Por qué los esqueletos no usan armas? Porque no tienen cuerpo",
    "Mamá, mamá, en la escuela me dicen despistado. ¿Y tú quién eres?",
    "¿Qué le dice un ciego a un sordo? Nos vemos, que no te veo",
    "¿Cuál es el animal más antiguo? La cebra, porque está en blanco y negro",
    "¿Por qué los muertos no pueden comer ajos? Porque no tienen estómago",
    "¿Qué hace un fantasma con hipo? Asustar con interrupciones",
    "¿Cómo se llama el vampiro vegetariano? El conde No-cuela",
    "¿Qué le dice un zombie a otro? Qué cerebro tienes, ¿me pasas la receta?",
    "¿Por qué los esqueletos no montan bicicleta? Porque no tienen agallas para agarrar el manubrio",
    "¿Cuál es el café más peligroso? El ex-preso",
    "¿Qué hace un muerto en el gimnasio? Ejercicios de estiramiento",
    "¿Por qué los fantasmas no pueden tener hijos? Porque se les transparenta todo",
    "¿Qué le dice un ataúd a otro? ¿Tú también estás lleno?",
    "¿Cómo se saluda un zombie? Con la mano descompuesta",
    "¿Qué estudian los fantasmas? Espectrología",
    "¿Por qué los esqueletos no van a la iglesia? Porque no tienen alma que salvar",
    "¿Qué hace un muerto en una fiesta? Se queda tieso en la pista",
    "¿Cuál es el colmo de un bombero? Quemarse en el trabajo"
]