const express = require('express');
const { createCanvas, loadImage, registerFont } = require('canvas');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Registrar la fuente
const fontPath = path.join(__dirname, 'fonts', 'NotoSans-VariableFont_wdth,wght.ttf');
registerFont(fontPath, { family: 'Noto Sans' });

app.get('/api/utility/boostcard', async (req, res) => {
    const { avatar, username, background, avatarposicion, usernameposicion, color } = req.query;

    if (!avatar || !username || !background || !avatarposicion || !usernameposicion) {
        return res.status(400).json({ error: "Faltan parámetros obligatorios" });
    }

    const canvas = createCanvas(800, 400);
    const ctx = canvas.getContext('2d');

    try {
        // Cargar imagen de fondo
        const bgImage = await loadImage(background);
        ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

        // Cargar avatar
        const avatarImage = await loadImage(avatar);
        const [avatarX, avatarY] = avatarposicion.split(',').map(Number);
        const avatarSize = 100; // Tamaño del avatar
        ctx.drawImage(avatarImage, avatarX, avatarY, avatarSize, avatarSize);

        // Configurar la fuente y tamaño
        ctx.font = '30px "Noto Sans"';
        ctx.fillStyle = color || 'white'; // Usar el color definido o blanco por defecto
        ctx.textAlign = 'center';

        // Definir posición del texto asegurando que siempre sea visible
        let [textX, textY] = usernameposicion.split(',').map(Number);

        // Ajustar posición si el texto sale de los límites del canvas
        textX = Math.max(50, Math.min(canvas.width - 50, textX));
        textY = Math.max(50, Math.min(canvas.height - 50, textY));

        // Agregar sombra para mayor visibilidad
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;

        // Renderizar el username
        ctx.fillText(username, textX, textY);

        res.setHeader('Content-Type', 'image/png');
        res.send(canvas.toBuffer());
    } catch (error) {
        console.error("Error generando la imagen:", error);
        res.status(500).json({ error: "Error generando la imagen" });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
