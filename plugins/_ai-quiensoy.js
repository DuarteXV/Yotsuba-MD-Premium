// تم إنشاء الكود بواسطة Felix بالطبع، لا تقم بإزالة الاعتمادات

const handler = async (m, { conn }) => {
    const userNumber = m.sender; // خذ الرقم كاملا  
    await conn.sendMessage(
        m.chat,
        { text: `رقمك هو ${userNumber}\n\nبدون @ هو الآن  ${userNumber.split('@')[0]}` },
        { quoted: m }
    );
};

handler.help = ['quiensoy'];
handler.tags = ['info'];
handler.command = /^quiensoy$/i; // الأمر الذي سيتم تنفيذه  

export default handler;