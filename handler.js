import { smsg } from "./lib/simple.js"
import { fileURLToPath } from "url"
import path from "path"
import { unwatchFile, watchFile } from "fs"

// --- FIX PARA __filename en ESM ---
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

global.sessions = (global.sessions && typeof global.sessions === 'object') ? global.sessions : {}

global.handlerConfig = { 
    mainMenu: "menu", 
    timeout: 15 * 60 * 1000,
    routes: {} 
}

export async function handler(chatUpdate) {
    this.msgqueque = this.msgqueque || []
    if (!chatUpdate) return
    
    let m = chatUpdate.messages[chatUpdate.messages.length - 1]
    if (!m) return
    if (global.db.data == null) await global.loadDatabase()

    try {
        m = smsg(this, m) || m
        if (!m || m.isBaileys) return
        
        // 🚨 CAMBIO IMPORTANTE: Quitamos el "if (m.isGroup) return" para que funcione en grupos
        const isGroup = m.isGroup
        
        if (!m.text || typeof m.text !== 'string') return
        
        const sender = m.sender
        const now = Date.now()

        // Lógica de sesiones/menú interactivo
        if (global.sessions[sender] && (now - global.sessions[sender].time < global.handlerConfig.timeout)) {
            global.sessions[sender].time = now 
            if (/^[0-9]+$/.test(m.text.trim())) {
                const choice = m.text.trim()
                const state = global.sessions[sender].state || 'main'
                if (global.handlerConfig.routes[state]?.[choice]) {
                    m.text = global.handlerConfig.routes[state][choice]
                    if (m.text === 'salir') delete global.sessions[sender]
                }
            }
        }

        const user = global.db.data.users[m.sender] || (global.db.data.users[m.sender] = {})
        const chat = global.db.data.chats[m.chat] || (global.db.data.chats[m.chat] = {})

        // Verificación de Owners
        const isROwner = [...global.owner.map(n => Array.isArray(n) ? n[0] : n)]
            .map(v => String(v).replace(/[^0-9]/g, "") + "@s.whatsapp.net")
            .includes(m.sender)
        const isOwner = isROwner || m.fromMe

        // Ejecutor de Plugins
        for (const name in global.plugins) {
            const plugin = global.plugins[name]
            if (!plugin || plugin.disabled) continue

            const text = (m.text || "").trim()
            // Soporte para prefijo punto (.)
            const usedPrefix = '.'
            const isCommand = Array.isArray(plugin.command) ? 
                plugin.command.some(cmd => text.startsWith(usedPrefix + cmd)) : 
                (plugin.command instanceof RegExp ? plugin.command.test(text) : text.startsWith(usedPrefix + plugin.command))

            if (!isCommand) continue

            // Validaciones de Propiedades del Plugin
            if (plugin.rowner && !isROwner) {
                await this.reply(m.chat, '⚠️ Solo el Propietario Root.', m)
                continue
            }
            if (plugin.group && !isGroup) {
                await this.reply(m.chat, '⚠️ Este comando es solo para grupos.', m)
                continue
            }

            const args = text.split(' ').slice(1)
            const command = text.split(' ')[0].slice(1)

            try {
                // Usamos plugin.exec o plugin.call según como lo definas en tus archivos
                const execution = plugin.exec || plugin.call || plugin.default
                await execution.call(this, m, {
                    conn: this, 
                    usedPrefix, 
                    args, 
                    command, 
                    isROwner, 
                    isOwner, 
                    isGroup,
                    user, 
                    chat
                })
            } catch (e) { 
                console.error(e)
            }
            break
        }

    } catch (e) {
        console.error("Error en handler:", e)
    } finally {
        // Print en consola
        try {
            const print = await import("./lib/print.js")
            await print.default(m, this)
        } catch (e) { 
            console.warn("Error en print:", e) 
        }
    }
}

// Corregido para que no de error de "global.__filename is not a function"
watchFile(__filename, async () => {
    unwatchFile(__filename)
    console.log("═══ Handler recargado ═══")
})
