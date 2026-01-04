import fetch from 'node-fetch';

const API_KEY = global.playlistApiKey || 'f9e54e5c6amsh8b4dfc0bfb94abap19bab2jsne8b65338207e'; // Usar clave configurable

async function fetchPlaylistVideos(playlistId) {
  try {
    const url = `https://youtube-media-downloader.p.rapidapi.com/v2/playlist/videos?playlistId=${playlistId}`;

    console.log('Obteniendo videos de playlist...');
    console.log('URL:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': 'youtube-media-downloader.p.rapidapi.com',
        'x-rapidapi-key': API_KEY
      }
    });

    console.log('Status:', response.status);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Datos de respuesta:');
    console.log(JSON.stringify(data, null, 2));

    if (data.items && Array.isArray(data.items)) {
      console.log(`\nEncontrados ${data.items.length} videos en la playlist`);
      // Mapear los datos para que tengan la estructura esperada
      const videos = data.items.map(item => ({
        id: item.id,
        title: item.title,
        url: `https://www.youtube.com/watch?v=${item.id}`,
        thumbnail: item.thumbnails?.[0]?.url || '',
        duration: item.lengthText || 'Desconocido',
        channel: item.channel?.name || 'Desconocido'
      }));
      return videos;
    } else {
      throw new Error('No se encontraron videos en la playlist');
    }

  } catch (error) {
    console.error('Error obteniendo playlist:', error.message);
    throw error;
  }
}

export { fetchPlaylistVideos };
