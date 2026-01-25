import { smsg } from "./lib/simple.js"
import { fileURLToPath } from "url"
import path from "path"
import { unwatchFile, watchFile } from "fs"

global.sessions = (global.sessions && typeof global.sessions === 'object') ? global.sessions : {}

global.handlerConfig = { 
    mainMenu: "menu", 
    timeout: 15 * 60 * 1000,
    routes: {} 
}

export async function handler(chatUpdate) {
    this.msgqueque = this.msgqueque || []
    if (!chatUpdate) return
    this.pushMessage(chatUpdate.messages).catch(console.error)

    let m = chatUpdate.messages[chatUpdate.messages.length - 1]
    if (!m) return
    if (global.db.data == null) await global.loadDatabase()

    try {
        m = smsg(this, m) || m
        if (!m || m.isBaileys) return
        if (m.isGroup) return
        if (!m.text || typeof m.text !== 'string') return
        const sender = m.sender
        const now = Date.now()
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

        const isROwner = [...global.owner.map(n => Array.isArray(n) ? n[0] : n)]
            .map(v => String(v).replace(/[^0-9]/g, "") + "@s.whatsapp.net")
            .includes(m.sender)
        const isOwner = isROwner || m.fromMe

        const ___dirname = path.join(path.dirname(fileURLToPath(import.meta.url)), "./plugins")


        let commandFound = false

        for (const name in global.plugins) {
            const plugin = global.plugins[name]
            if (!plugin || plugin.disabled) continue

            if (typeof plugin.all === "function") {
                try { 
                    await plugin.all.call(this, m, { 
                        chatUpdate, 
                        user, 
                        chat,
                        conn: this,
                        isROwner,
                        isOwner,
                        command: null
                    }) 
                } catch (e) { 
                    console.error(`Error en plugin.all (${name}):`, e) 
                }
            }

            const text = (m.text || "").trim().toLowerCase()
            const isCommand = Array.isArray(plugin.command) ? 
                plugin.command.some(cmd => text === cmd.toLowerCase() || text.startsWith(cmd.toLowerCase() + " ")) : 
                (plugin.command instanceof RegExp ? plugin.command.test(text) : text === plugin.command?.toLowerCase() || text.startsWith(plugin.command?.toLowerCase() + " "))

            if (!isCommand) continue
            commandFound = true

            const [command, ...args] = text.split(" ").filter(v => v)

            if (plugin.rowner && !isROwner) {
                await this.reply(m.chat, '⚠ Solo el propietario root puede usar este comando.', m)
                continue
            }
            if (plugin.owner && !isOwner) {
                await this.reply(m.chat, '⚠ Solo el propietario puede usar este comando.', m)
                continue
            }

            try {
                await plugin.call(this, m, {
                    conn: this, 
                    usedPrefix: "", 
                    noPrefix: text, 
                    args, 
                    command, 
                    isROwner, 
                    isOwner, 
                    user, 
                    chat,
                    session: global.sessions[m.sender],
                    handlerConfig: global.handlerConfig
                })
            } catch (e) { 
                console.error(`Error ejecutando comando '${command}' en plugin '${name}':`, e)
                await this.reply(m.chat, `❌ Error al ejecutar el comando: ${e.message}`, m)
            }

            break
        }

    } catch (e) {
        console.error("Error en handler:", e)
    } finally {
        try {
            if (!opts["noprint"]) {
                await (await import("./lib/print.js")).default(m, this)
            }
        } catch (e) { 
            console.warn("Error en print.js:", e) 
        }
    }
}

let file = global.__filename(import.meta.url, true)
watchFile(file, async () => {
    unwatchFile(file)
    console.log("═══ Handler recargado ═══")
})