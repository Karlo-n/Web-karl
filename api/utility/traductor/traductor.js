const axios = require('axios');

async function translateText(texto, idioma) {
    try {
        const response = await axios.get('https://translate.googleapis.com/translate_a/single', {
            params: {
                client: 'gtx',
                sl: 'auto',  // Detecta automáticamente el idioma original
                tl: idioma,  // Traduce al idioma de destino
                dt: 't',
                q: texto
            }
        });

        return response.data[0][0][0]; // Solo devuelve la traducción
    } catch (error) {
        return "Error en la traducción";
    }
}

module.exports = translateText;
