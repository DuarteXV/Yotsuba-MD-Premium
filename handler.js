import { smsg } from "./lib/simple.js"
import { fileURLToPath } from "url"
import path from "path"
import { unwatchFile, watchFile } from "fs"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

global.sessions = (global.sessions && typeof global.sessions === 'object') ? global.sessions : {}

global.handlerConfig = { 
    mainMenu: "menu", 
    timeout: 15 * 60 * 1000,
    routes: {} 
}

export async function handler(chatUpdate) {
    // FIX: Usamos 'this' (que es conn) y aseguramos que msgqueque exista
    this.msgqueque = this.msgqueque || []
    
    if (!chatUpdate) return
    let m = chatUpdate.messages[chatUpdate.messages.length - 1]
    if (!m) return
    
    // Cargar base de datos si es necesario
    if (global.db && global.db.data == null) await global.loadDatabase()

    try {
        m = smsg(this, m) || m
        if (!m || m.isBaileys) return
        
        const isGroup = m.isGroup
        const text = (m.text || "").trim()
        const usedPrefix = '.' // Prefijo configurado

        // Lógica de Owners
        const isROwner = [...(global.owner || [])].map(v => v[0] + "@s.whatsapp.net").includes(m.sender)
        const isOwner = isROwner || m.fromMe

        // Ejecutor de Plugins
        for (const name in global.plugins) {
            const plugin = global.plugins[name]
            if (!plugin || plugin.disabled) continue

            // Verificación de comando con prefijo
            const isCommand = Array.isArray(plugin.command) ? 
                plugin.command.some(cmd => text.toLowerCase().startsWith(usedPrefix + cmd.toLowerCase())) : 
                (plugin.command instanceof RegExp ? plugin.command.test(text) : text.toLowerCase().startsWith(usedPrefix + plugin.command?.toLowerCase()))

            if (!isCommand) continue

            // Restricciones
            if (plugin.group && !isGroup) {
                await this.reply(m.chat, '⚠️ Este comando es solo para grupos.', m)
                continue
            }

            // Extraer comando y argumentos
            const str = text.slice(usedPrefix.length).trim()
            const [command, ...args] = str.split(' ').filter(v => v)

            try {
                // Ejecutamos el plugin pasando todo lo necesario
                const execution = plugin.exec || plugin.call || plugin.default
                await execution.call(this, m, {
                    conn: this, 
                    usedPrefix, 
                    args, 
                    command, 
                    isROwner, 
                    isOwner, 
                    isGroup
                })
            } catch (e) { 
                console.error(`Error en plugin ${name}:`, e)
            }
            break
        }

    } catch (e) {
        console.error("Error en handler:", e)
    } finally {
        // Print en consola
        try {
            const print = await import("./lib/print.js")
            if (print.default) print.default(m, this)
        } catch (e) { 
            // Ignorar errores de print para no detener el proceso
        }
    }
}

// Watcher corregido
watchFile(__filename, () => {
    unwatchFile(__filename)
    console.log("✅ Handler actualizado")
})
