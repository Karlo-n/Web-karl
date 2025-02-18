const express = require('express');
const cors = require('cors');
const translateText = require('./traductor');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('API de Traducción con Google Translate funcionando 🚀');
});

app.all('/api/traducir', async (req, res) => {
    const { texto, idioma } = req.method === "GET" ? req.query : req.body;

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

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
