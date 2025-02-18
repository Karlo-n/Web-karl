const express = require('express');
const router = express.Router();
const generateBoostCard = require('./boostcard');

router.get('/', async (req, res) => {
    try {
        const { avatar, username, background, avatarposicion, usernameposicion, color } = req.query;

        if (!avatar || !username || !background) {
            return res.status(400).json({ error: 'Faltan parámetros obligatorios' });
        }

        const imageBuffer = await generateBoostCard(avatar, username, background, avatarposicion, usernameposicion, color);

        res.setHeader('Content-Type', 'image/png');
        res.send(imageBuffer);
    } catch (error) {
        console.error('Error generando la imagen:', error);
        res.status(500).json({ error: 'Error generando la imagen' });
    }
});

module.exports = router;
