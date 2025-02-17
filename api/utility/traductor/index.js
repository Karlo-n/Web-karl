export default async function handler(req, res) {
    try {
        const { texto, idioma } = req.query;

        if (!texto || !idioma) {
            return res.status(400).json({ error: "Faltan parámetros 'texto' e 'idioma'" });
        }

        // Importación dinámica de node-fetch
        const fetch = (await import("node-fetch")).default;

        const response = await fetch("https://libretranslate.com/translate", {
            method: "POST",
            body: JSON.stringify({
                q: texto,
                source: "auto",
                target: idioma,
                format: "text",
                api_key: "" // LibreTranslate no requiere API key
            }),
            headers: { "Content-Type": "application/json" }
        });

        const data = await response.json();

        if (data.translatedText) {
            res.json({ traduccion: data.translatedText });
        } else {
            res.status(500).json({ error: "Error en la traducción", detalle: data });
        }
    } catch (error) {
        console.error("Error en la API de traducción:", error);
        res.status(500).json({ error: "Error interno en la traducción" });
    }
}
