import fetch from 'node-fetch';

export default async function handler(req, res) {
    try {
        const { texto, idioma } = req.query;

        if (!texto || !idioma) {
            return res.status(400).json({ error: "Faltan los parámetros 'texto' y 'idioma'" });
        }

        const response = await fetch("https://libretranslate.com/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                q: texto,
                source: "auto",
                target: idioma,
                format: "text"
            })
        });

        const data = await response.json();

        if (data.error) {
            return res.status(500).json({ error: "Error en la traducción" });
        }

        res.json({ original: texto, traducido: data.translatedText, idioma });
    } catch (error) {
        res.status(500).json({ error: "Error en el servidor" });
    }
}
