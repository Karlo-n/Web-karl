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

        // Redimensionar imágenes
        avatarImage.resize(100, 100); // Ajusta tamaño del avatar

        // Crear imagen base
        const canvas = new Jimp(bgImage.getWidth(), bgImage.getHeight(), 0x00000000);

        // Fusionar imágenes
        canvas.composite(bgImage, 0, 0);
        const [avatarX, avatarY] = avatarposicion ? avatarposicion.split(',').map(Number) : [50, 50];
        canvas.composite(avatarImage, avatarX, avatarY);

        // Cargar fuente personalizada (Jimp usa fuentes `.fnt`)
        const font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE); // Fuente predeterminada

        // Establecer color del texto
        const textColor = color ? Jimp.cssColorToHex(color) : Jimp.cssColorToHex('#FFFFFF');

        // Posición del texto
        const [textX, textY] = usernameposicion ? usernameposicion.split(',').map(Number) : [200, 200];

        // Escribir texto
        canvas.print(font, textX, textY, {
            text: username,
            alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
            alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
        });

        // Enviar la imagen generada
        res.setHeader('Content-Type', 'image/png');
        res.send(await canvas.getBufferAsync(Jimp.MIME_PNG));

    } catch (error) {
        console.error('Error generando la imagen:', error);
        res.status(500).json({ error: 'Error generando la imagen' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
