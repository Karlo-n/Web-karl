import express from "express";
import { pipeline } from "@xenova/transformers";

const app = express();
app.use(express.json());

const translator = await pipeline("translation", "Helsinki-NLP/opus-mt-en-es"); // Traductor inglés-español

app.get("/api/utility/traductor", async (req, res) => {
    try {
        const { texto, idioma } = req.query;
        if (!texto || !idioma) {
            return res.status(400).json({ error: "Falta el parámetro 'texto' o 'idioma'" });
        }

        let modelo = `Helsinki-NLP/opus-mt-en-${idioma}`;
        if (idioma === "en") modelo = `Helsinki-NLP/opus-mt-es-en`; // Invertir español a inglés

        const traductor = await pipeline("translation", modelo);
        const resultado = await traductor(texto);

        res.json({ traduccion: resultado[0].translation_text });
    } catch (error) {
        console.error("Error en la traducción:", error);
        res.status(500).json({ error: "Error en la traducción" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
