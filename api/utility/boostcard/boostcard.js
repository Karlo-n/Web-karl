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

        // 📌 Cargar fuente predeterminada (sin necesidad de subir archivos extra)
        const font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE); // Usa la fuente incluida en Jimp

        // Posiciones predeterminadas
        const [avatarX, avatarY] = avatarposicion ? avatarposicion.split(',').map(Number) : [50, 50];
        const [textX, textY] = usernameposicion ? usernameposicion.split(',').map(Number) : [200, 250];

        // Redimensionar avatar
        avatarImage.resize(80, 80);

        // Componer avatar sobre el fondo
        bgImage.composite(avatarImage, avatarX, avatarY);

        // Definir color del texto
        const textColor = color || '#FFFFFF'; // Color blanco por defecto

        // Agregar texto
        bgImage.print(font, textX, textY, {
            text: username,
            alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
            alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
        }, 300, 50);

        // Convertir a imagen PNG y enviar respuesta
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
