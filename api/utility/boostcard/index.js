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

        // Redimensionar avatar
        avatarImage.resize(80, 80);

        // Crear una nueva imagen base
        const image = new Jimp(600, 300);
        image.composite(bgImage.resize(600, 300), 0, 0);

        // Posición del avatar
        const [avatarX, avatarY] = avatarposicion ? avatarposicion.split(',').map(Number) : [50, 50];
        image.composite(avatarImage, avatarX, avatarY);

        // Cargar fuente para texto
        const font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
        const textColor = color || '#FFFFFF';
        const [textX, textY] = usernameposicion ? usernameposicion.split(',').map(Number) : [300, 250];
        image.print(font, textX, textY, username);

        // Enviar imagen como respuesta
        res.setHeader('Content-Type', 'image/png');
        image.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
            if (err) throw err;
            res.send(buffer);
        });
    } catch (error) {
        console.error('Error generando la imagen:', error);
        res.status(500).json({ error: 'Error generando la imagen' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
