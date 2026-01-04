export function before(m) {
  if (m.text && m.text.match(/^[.#!]/)) return true;
  
  const user = global.db.data.users[m.sender];
  
  if (user.afk > -1) {
    const tiempoInactivo = new Date() - user.afk;
    const horas = Math.floor(tiempoInactivo / 3600000);
    const minutos = Math.floor((tiempoInactivo % 3600000) / 60000);
    const segundos = Math.floor((tiempoInactivo % 60000) / 1000);
    
    let tiempoTexto = '';
    if (horas > 0) tiempoTexto += `${horas}h `;
    if (minutos > 0) tiempoTexto += `${minutos}m `;
    if (segundos > 0) tiempoTexto += `${segundos}s`;
    
    conn.reply(m.chat, `${emoji} Dejaste De Estar Inactivo\n${user.afkReason ? 'Motivo De La Inactividad: ' + user.afkReason : ''}\n\n*Tiempo Inactivo: ${tiempoTexto.trim() || '0s'}*`, m);
    user.afk = -1;
    user.afkReason = '';
  }
  
  return true;
}