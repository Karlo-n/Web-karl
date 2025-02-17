export default async function handler(req, res) {
    try {
        const fetch = (await import('node-fetch')).default;
        
        const { texto, idioma } = req.query;

        if (!texto || !idioma) {
            return res.status(400).json({ error: "Faltan los parámetros 'texto' o 'idioma'" });
        }

        // API alternativa: LibreTranslate (requiere registro para clave API gratuita)
        const response = await fetch("https://libretranslate.com/translate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                q: texto,
                source: "auto", // Detecta automáticamente el idioma de entrada
                target: idioma,
                format: "text"
            })
        });

        if (!response.ok) {
            return res.status(500).json({ error: "Error en la traducción" });
        }

        const data = await response.json();

        return res.json({ texto_original: texto, traducido: data.translatedText });

    } catch (error) {
        console.error("Error en la API de traducción:", error);
        return res.status(500).json({ error: "Error en la traducción" });
    }
}
