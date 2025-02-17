import express from "express";
import { pipeline } from "@xenova/transformers";

const app = express();
app.use(express.json());

// Inicializar el modelo de traducción por defecto (Inglés a Español)
const defaultModel = "Helsinki-NLP/opus-mt-en-es";
const translator = await pipeline("translation", defaultModel);

app.get("/api/utility/traductor", async (req, res) => {
    try {
        const { texto, idioma } = req.query;
        if (!texto || !idioma) {
            return res.status(400).json({ error: "Falta el parámetro 'texto' o 'idioma'" });
        }

        // Definir el modelo adecuado según el idioma de destino
        let modelo = `Helsinki-NLP/opus-mt-en-${idioma}`;
        if (idioma === "en") modelo = `Helsinki-NLP/opus-mt-es-en`; // Español a Inglés

        // Cargar el modelo de traducción correspondiente
        const traductor = await pipeline("translation", modelo);
        const resultado = await traductor(texto);

        res.json({ traduccion: resultado[0].translation_text });
    } catch (error) {
        console.error("Error en la traducción:", error);
        res.status(500).json({ error: "Error en la traducción" });
    }
});

// Iniciar el servidor solo si se ejecuta en local (Vercel maneja esto automáticamente)
if (!process.env.VERCEL) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
}

export default app;
