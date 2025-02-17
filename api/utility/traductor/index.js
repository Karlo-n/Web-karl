const fetch = require('node-fetch');

module.exports = async (req, res) => {
    const { texto, idioma } = req.query;

    if (!texto || !idioma) {
        return res.status(400).json({ error: "Parámetros 'texto' e 'idioma' son requeridos." });
    }

    try {
        const response = await fetch('https://libretranslate.com/translate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                q: texto,
                target: idioma
            })
        });

        if (!response.ok) {
            throw new Error('Error en la respuesta de la API de LibreTranslate');
        }

        const data = await response.json();
        res.status(200).json({ traducción: data.translatedText });
    } catch (error) {
        console.error('Error al traducir:', error);
        res.status(500).json({ error: 'Error al procesar la traducción.' });
    }
};
