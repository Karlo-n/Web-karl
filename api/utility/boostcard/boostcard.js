const express = require('express');
const { createCanvas, loadImage, registerFont } = require('canvas');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Registrar la fuente correctamente
const fontPath = path.join(__dirname, 'fonts', 'NotoSans-VariableFont_wdth,wght.ttf');
registerFont(fontPath, { family: 'NotoSans-Regular' });

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

        // Configurar color del texto con un valor por defecto
        const textColor = color && /^#([0-9A-F]{3}){1,2}$/i.test(color) ? color : '#FFFFFF';
        ctx.fillStyle = textColor;

        // Establecer la fuente y verificar que se registre bien
        ctx.font = '100px "NotoSans-Regular"';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Posición del texto
        const [textX, textY] = usernameposicion ? usernameposicion.split(',').map(Number) : [300, 250];

        // Validar que el texto realmente se renderice
        const textWidth = ctx.measureText(username).width;
        ctx.fillRect(textX - textWidth / 2 - 10, textY - 20, textWidth + 20, 40);

        // Dibujar el texto sobre la imagen
        ctx.fillStyle = '#000000'; // Asegurar visibilidad sobre el fondo blanco
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
