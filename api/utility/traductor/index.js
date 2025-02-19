const express = require('express');
const translateText = require('./traductor'); // Asegúrate de que el archivo correcto se esté importando

const app = express();
app.use(express.json());

app.post('/', async (req, res) => {
    const { texto, idioma } = req.body;
    if (!texto || !idioma) {
        return res.status(400).json({ error: "Faltan parámetros 'texto' o 'idioma'" });
    }
    try {
        const resultado = await translateText(texto, idioma);
        res.json({ resultado });
    } catch (error) {
        res.status(500).json({ error: "Error en la traducción", detalle: error.message });
    }
});

module.exports = app; // 🔹 Agregar esta línea
