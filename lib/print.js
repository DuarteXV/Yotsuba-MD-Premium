import chalk from 'chalk';

const terminalPrint = (m) => {
    const msg = m.messages[0];
    if (!msg.message) return;

    const sender = msg.key.remoteJid.split('@')[0];
    const name = msg.pushName || 'Desconocido';
    const isGroup = msg.key.remoteJid.endsWith('@g.us');
    const text = msg.message.conversation || 
                 msg.message.extendedTextMessage?.text || 
                 msg.message.imageMessage?.caption || 'Formato Multimedia';
    
    const time = new Date().toLocaleTimeString();
    const type = isGroup ? chalk.magenta(' [GRUPO] ') : chalk.cyan(' [PRIVADO] ');

    console.log(chalk.gray(`\n--------------------------------------------`));
    console.log(`${chalk.white(`[${time}]`)}${type}${chalk.green('DE:')} ${chalk.yellow(name)} ${chalk.gray(`(${sender})`)}`);
    console.log(`${chalk.green('💬 MSG:')} ${chalk.white(text)}`);
    console.log(chalk.gray(`--------------------------------------------`));
};

export default terminalPrint;
