const express = require('express');
const { createCanvas, loadImage, registerFont } = require('canvas');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Registrar la fuente correctamente
const fontPath = path.join(__dirname, 'fonts', 'NotoSans-VariableFont_wdth,wght.ttf');
registerFont(fontPath, { family: 'NotoSans' });

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
        const avatarSize = 100;
        ctx.drawImage(avatarImage, avatarX, avatarY, avatarSize, avatarSize);

        // Configurar la fuente asegurando que se use una de respaldo
        ctx.font = 'bold 40px "NotoSans", sans-serif';
        ctx.fillStyle = color || 'white'; // Usar color personalizado o blanco
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Ajustar posición del texto si se sale de los límites
        let [textX, textY] = usernameposicion.split(',').map(Number);
        textX = Math.max(50, Math.min(canvas.width - 50, textX));
        textY = Math.max(50, Math.min(canvas.height - 50, textY));

        // Dibujar un fondo negro detrás del texto para asegurar visibilidad
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(textX - 60, textY - 25, 120, 50);

        // Dibujar el texto encima
        ctx.fillStyle = color || 'white';
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
