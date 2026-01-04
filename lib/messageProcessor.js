// ./lib/messageProcessor.js (Modificado: Solo retorno false)

/**
 * Procesa el mensaje del usuario. 
 * Modificado para no intervenir y dejar que el handler principal continúe.
 * @param {object} conn - Objeto de conexión del bot (WhatsApp Connection).
 * @param {object} m - Objeto de mensaje normalizado (smsg).
 * @returns {Promise<boolean>} Siempre devuelve False para que el flujo continúe.
 */
export async function messageProcessor(conn, m) {
    // Se desactiva la lógica de autorespuestas.
    // El bot ya no revisará el contenido del mensaje aquí.
    
    return false;
}
