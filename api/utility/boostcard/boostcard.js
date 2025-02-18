const express = require('express');
const Jimp = require('jimp');
const { createCanvas, registerFont } = require('canvas');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Registrar la fuente personalizada
const fontPath = path.join(__dirname, 'fonts', 'NotoSans-VariableFont_wdth,wght.ttf');
registerFont(fontPath, { family: 'NotoSans' });

app.get('/api/utility/boostcard', async (req, res) => {
    try {
        const { avatar, username, background, avatarposicion, usernameposicion, color } = req.query;

        if (!avatar || !username || !background) {
            return res.status(400).json({ error: 'Faltan parámetros obligatorios' });
        }

        // Cargar imágenes
        const bgImage = await Jimp.read(background);
        const avatarImage = await Jimp.read(avatar);

        // Crear un canvas
        const canvas = createCanvas(bgImage.bitmap.width, bgImage.bitmap.height);
        const ctx = canvas.getContext('2d');

        // Dibujar el fondo
        ctx.drawImage(bgImage.bitmap.data, 0, 0, canvas.width, canvas.height);

        // Dibujar el avatar
        const [avatarX, avatarY] = avatarposicion ? avatarposicion.split(',').map(Number) : [50, 50];
        ctx.drawImage(avatarImage.bitmap.data, avatarX, avatarY, 80, 80);

        // Configurar el texto
        ctx.fillStyle = color ? color : '#FFFFFF';
        ctx.font = '30px NotoSans';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Posición del texto
        const [textX, textY] = usernameposicion ? usernameposicion.split(',').map(Number) : [canvas.width / 2, canvas.height - 50];
        ctx.fillText(username, textX, textY);

        // Convertir el canvas a buffer
        const buffer = canvas.toBuffer('image/png');

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
