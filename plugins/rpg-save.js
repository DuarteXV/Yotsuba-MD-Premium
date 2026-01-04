import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'src', 'database');
const databaseFilePath = path.join(dbPath, 'waifudatabase.json');

function loadDatabase() {
    try {
        if (!fs.existsSync(dbPath)) {
            fs.mkdirSync(dbPath, { recursive: true });
        }
        if (!fs.existsSync(databaseFilePath)) {
            const data = { users: {} };
            fs.writeFileSync(databaseFilePath, JSON.stringify(data, null, 2));
            return data;
        }
        return JSON.parse(fs.readFileSync(databaseFilePath, 'utf-8'));
    } catch (error) {
        console.error('Error DB:', error);
        return { users: {} };
    }
}

function saveDatabase(data) {
    try {
        fs.writeFileSync(databaseFilePath, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Error saving:', error);
        return false;
    }
}

let handler = async (m, { conn }) => {
    const userId = m.sender;
    let userName = 'Usuario';
    
    try {
        userName = (await conn.getName(userId)) || 'Usuario';
    } catch {}

    
    if (!global.db) global.db = {};
    if (!global.db.waifu) global.db.waifu = { waifus: {} };

    try {
        
        let currentWaifu = null;
        let waifuKey = null;

       
        const waifuKeys = Object.keys(global.db.waifu.waifus);
        
        if (waifuKeys.length === 0) {
            return m.reply('⚽️ No hay personajes disponibles. Usa .rw para generar uno.');
        }

        
        if (global.db.waifu.waifus[userId]) {
            currentWaifu = global.db.waifu.waifus[userId];
            waifuKey = userId;
        }
       
        else if (waifuKeys.length > 0) {
            waifuKey = waifuKeys[0];
            currentWaifu = global.db.waifu.waifus[waifuKey];
        }

        if (!currentWaifu || !currentWaifu.name) {
            return m.reply('⚽️ No se encontró personaje válido para guardar.');
        }

        
        let db = loadDatabase();
        
       
        if (!db.users[userId]) {
            db.users[userId] = {
                name: userName,
                characters: []
            };
        }

        
        const exists = db.users[userId].characters.find(
            char => char.name === currentWaifu.name && char.rarity === currentWaifu.rarity
        );

        if (exists) {
            delete global.db.waifu.waifus[waifuKey];
            return m.reply(`⚽️ Ya tienes a *${currentWaifu.name}* (${currentWaifu.rarity}) en tu colección.`);
        }

        
        db.users[userId].characters.push({
            name: currentWaifu.name,
            rarity: currentWaifu.rarity,
            obtainedAt: new Date().toISOString()
        });

        
        if (!saveDatabase(db)) {
            return m.reply('❌ Error al guardar en base de datos.');
        }

        
        delete global.db.waifu.waifus[waifuKey];

        
        const rarityEmojis = {
            'comun': '⚪', 'poco comun': '🟢', 'raro': '🔵',
            'epico': '🟣', 'legendario': '🟡', 'mitico': '🔴'
        };

        const emoji = rarityEmojis[currentWaifu.rarity.toLowerCase()] || '💙';
        
        let msg = `✅ ¡PERSONAJE GUARDADO! ✅\n\n`;
        msg += `${emoji} *${currentWaifu.name}*\n`;
        msg += `💎 *${currentWaifu.rarity.toUpperCase()}*\n`;
        msg += `👤 ${userName}\n`;
        msg += `📊 Total: *${db.users[userId].characters.length}* personajes\n\n`;
        msg += `🔍 Usa *.col* para ver tu colección`;

        return m.reply(msg);

    } catch (error) {
        console.error('Error en save:', error);
        return m.reply(`❌ Error: ${error.message}`);
    }
}

handler.help = ['save', 'guardar', 'claim']
handler.tags = ['rpg']
handler.command = /^(save|guardar|c|reclamar)$/i
handler.group = true

export default handler;

