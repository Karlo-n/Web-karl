const express = require('express');
const generateBoostCard = require('./boostcard'); // Importamos la función que genera la imagen

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { avatar, username, background, avatarposicion, usernameposicion, color } = req.query;

        if (!avatar || !username || !background) {
            return res.status(400).json({ error: 'Faltan parámetros obligatorios' });
        }

        // Generamos la imagen con los parámetros recibidos
        const imageBuffer = await generateBoostCard({ avatar, username, background, avatarposicion, usernameposicion, color });

        res.setHeader('Content-Type', 'image/png');
        res.send(imageBuffer);
    } catch (error) {
        console.error('Error generando la imagen:', error);
        res.status(500).json({ error: 'Error generando la imagen', detalle: error.message });
    }
});

module.exports = router;
