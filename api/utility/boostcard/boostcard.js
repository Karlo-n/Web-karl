const express = require('express');
const Jimp = require('jimp');
const path = require('path');

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

        // 📌 Cargar fuente personalizada
        const fontPath = path.join(__dirname, 'fonts', 'NotoSans-VariableFont_wdth,wght.ttf');
        const font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE); // Usa una fuente por defecto
        // ⚠️ Jimp no soporta TTF directamente, pero se puede convertir a `.fnt` si es necesario

        // Posiciones
        const [avatarX, avatarY] = avatarposicion ? avatarposicion.split(',').map(Number) : [50, 50];
        const [textX, textY] = usernameposicion ? usernameposicion.split(',').map(Number) : [200, 250];

        // Ajustar tamaño del avatar
        avatarImage.resize(80, 80);

        // Combinar imágenes
        bgImage.composite(avatarImage, avatarX, avatarY);
        bgImage.print(font, textX, textY, username);

        // Enviar imagen como respuesta
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
