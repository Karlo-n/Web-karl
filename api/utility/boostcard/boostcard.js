const express = require('express');
const sharp = require('sharp');
const axios = require('axios');
const path = require('path');
const fs = require('fs').promises;

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { avatar, username, background, avatarposicion, usernameposicion, color } = req.query;

        if (!avatar || !username || !background) {
            return res.status(400).json({ error: 'Faltan parámetros obligatorios' });
        }

        // Descargar imágenes
        const avatarBuffer = await axios.get(avatar, { responseType: 'arraybuffer' }).then(res => res.data);
        const backgroundBuffer = await axios.get(background, { responseType: 'arraybuffer' }).then(res => res.data);

        // Crear la imagen de fondo
        let image = sharp(backgroundBuffer)
            .resize(600, 300)
            .composite([{ input: avatarBuffer, top: avatarposicion ? parseInt(avatarposicion.split(',')[1]) : 100, left: avatarposicion ? parseInt(avatarposicion.split(',')[0]) : 100 }]);

        // Agregar texto usando Sharp
        const svgText = `
            <svg width="600" height="300">
                <text x="${usernameposicion ? parseInt(usernameposicion.split(',')[0]) : 300}" 
                      y="${usernameposicion ? parseInt(usernameposicion.split(',')[1]) : 250}" 
                      font-size="30" 
                      text-anchor="middle" 
                      fill="${color || '#FFFFFF'}"
                      font-family="Arial">
                    ${username}
                </text>
            </svg>
        `;

        const textBuffer = Buffer.from(svgText);

        image = image.composite([{ input: textBuffer, left: 0, top: 0 }]);

        const finalBuffer = await image.toBuffer();

        res.setHeader('Content-Type', 'image/png');
        res.send(finalBuffer);
    } catch (error) {
        console.error('❌ Error generando la imagen:', error);
        res.status(500).json({ error: 'Error generando la imagen' });
    }
});

module.exports = router;
