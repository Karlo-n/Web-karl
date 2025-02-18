const express = require('express');
const Jimp = require('jimp');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/api/utility/boostcard', async (req, res) => {
    try {
        const { avatar, username, background, avatarposicion, usernameposicion, color } = req.query;

        if (!avatar || !username || !background) {
            return res.status(400).json({ error: 'Faltan parámetros obligatorios' });
        }

        // Cargar imágenes
        const bgImage = await Jimp.read(background);
        const avatarImage = await Jimp.read(avatar);
        const font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);

        // Ajustar tamaño del avatar
        avatarImage.resize(80, 80);

        // Posiciones
        const [avatarX, avatarY] = avatarposicion ? avatarposicion.split(',').map(Number) : [50, 50];
        const [textX, textY] = usernameposicion ? usernameposicion.split(',').map(Number) : [300, 250];

        // Componer imágenes
        bgImage.composite(avatarImage, avatarX, avatarY);

        // Configurar color del texto
        const textColor = color ? color : '#FFFFFF';

        // Dibujar texto
        bgImage.print(font, textX, textY, {
            text: username,
            alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
            alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
        }, 200, 50);

        // Convertir a buffer y responder
        const buffer = await bgImage.getBufferAsync(Jimp.MIME_PNG);
        res.setHeader('Content-Type', 'image/png');
        res.send(buffer);

    } catch (error) {
        console.error('Error generando la imagen:', error);
        res.status(500).json({ error: 'Error generando la imagen' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
