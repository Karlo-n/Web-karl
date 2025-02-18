const express = require('express');
const { createCanvas, loadImage, registerFont } = require('canvas');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Registrar la fuente NotoSans
const fontPath = path.join(__dirname, 'fonts', 'NotoSans-VariableFont_wdth,wght.ttf');
registerFont(fontPath, { family: 'NotoSans' });

app.get('/api/utility/boostcard', async (req, res) => {
    try {
        const { avatar, username, background, avatarposicion, usernameposicion, color } = req.query;

        if (!avatar || !username || !background) {
            return res.status(400).json({ error: 'Faltan parámetros obligatorios' });
        }

        const canvas = createCanvas(600, 300);
        const ctx = canvas.getContext('2d');

        // Cargar la imagen de fondo
        const bgImage = await loadImage(background);
        ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

        // Cargar la imagen del avatar
        const avatarImage = await loadImage(avatar);
        const [avatarX, avatarY] = avatarposicion ? avatarposicion.split(',').map(Number) : [50, 50];
        ctx.drawImage(avatarImage, avatarX, avatarY, 80, 80);

        // Asegurar el color del texto
        const textColor = color ? (color.startsWith('#') ? color : `#${color}`) : '#FFFFFF';
        ctx.fillStyle = textColor;
        ctx.font = '30px NotoSans';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Posición del texto
        const [textX, textY] = usernameposicion ? usernameposicion.split(',').map(Number) : [100, 100];

        // Agregar fondo detrás del texto para mejorar visibilidad
        const textWidth = ctx.measureText(username).width;
        ctx.fillRect(textX - textWidth / 5 - 20, textY - 20, textWidth + 100, 100);

        // Dibujar el texto
        ctx.fillStyle = '#FFFFFF'; // Asegurar que el texto sea visible
        ctx.fillText(username, textX, textY);

        res.setHeader('Content-Type', 'image/png');
        res.send(canvas.toBuffer());
    } catch (error) {
        console.error('Error generando la imagen:', error);
        res.status(500).json({ error: 'Error generando la imagen' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
