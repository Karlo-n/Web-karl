const express = require('express');
const { createBoostCard } = require('./boostCard');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/api/utility/boostcard', async (req, res) => {
    try {
        const { avatar, username, background, avatarposicion, usernameposicion } = req.query;

        if (!avatar || !username || !background) {
            return res.status(400).json({ error: "Faltan parámetros obligatorios. Debes incluir avatar, username y background." });
        }

        const imageBuffer = await createBoostCard(avatar, username, background, avatarposicion, usernameposicion);

        res.setHeader('Content-Type', 'image/png');
        res.send(imageBuffer);
    } catch (error) {
        res.status(500).json({ error: "Error al generar la imagen", detalle: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
