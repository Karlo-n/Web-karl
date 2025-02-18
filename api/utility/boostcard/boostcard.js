const express = require('express');
const sharp = require('sharp');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/api/utility/boostcard', async (req, res) => {
    try {
        const { avatar, username, background, avatarposicion, usernameposicion, color } = req.query;

        if (!avatar || !username || !background) {
            return res.status(400).json({ error: 'Faltan parámetros obligatorios' });
        }

        // Convertir posiciones a números
        const [avatarX, avatarY] = avatarposicion ? avatarposicion.split(',').map(Number) : [50, 50];
        const [textX, textY] = usernameposicion ? usernameposicion.split(',').map(Number) : [300, 250];

        // Descargar imágenes
        const bgBuffer = (await axios.get(background, { responseType: 'arraybuffer' })).data;
        const avatarBuffer = (await axios.get(avatar, { responseType: 'arraybuffer' })).data;

        // Crear imagen de fondo
        let img = sharp(bgBuffer).resize(600, 300);

        // Redimensionar avatar
        let avatarResized = await sharp(avatarBuffer)
            .resize(80, 80)
            .toBuffer();

        // Superponer avatar
        img = img.composite([{ input: avatarResized, left: avatarX, top: avatarY }]);

        // Crear imagen con texto
        const textOverlay = Buffer.from(`
            <svg width="600" height="300">
                <text x="${textX}" y="${textY}" font-size="30" fill="${color || 'white'}" text-anchor="middle">
                    ${username}
                </text>
            </svg>
        `);

        // Añadir texto
        img = img.composite([{ input: textOverlay }]);

        // Convertir a PNG y enviar respuesta
        res.setHeader('Content-Type', 'image/png');
        res.send(await img.png().toBuffer());
    } catch (error) {
        console.error('Error generando la imagen:', error);
        res.status(500).json({ error: 'Error generando la imagen' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
