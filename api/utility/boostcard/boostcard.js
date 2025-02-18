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
        const font = await Jimp.loadFont(Jimp.FONT_SANS_64_WHITE); // Aumentamos tamaño de fuente

        // Ajustar tamaño del avatar
        avatarImage.resize(100, 100);

        // Posiciones del avatar y texto
        const [avatarX, avatarY] = avatarposicion ? avatarposicion.split(',').map(Number) : [50, 50];
        const [textX, textY] = usernameposicion ? usernameposicion.split(',').map(Number) : [bgImage.bitmap.width / 2, bgImage.bitmap.height - 50];

        // Componer avatar sobre la imagen
        bgImage.composite(avatarImage, avatarX, avatarY);

        // Configurar color del texto (Jimp no soporta HEX, usamos blanco por defecto)
        bgImage.print(font, textX, textY, {
            text: username,
            alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
            alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
        }, 500, 100); // Tamaño del área de texto

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
