const express = require('express');
const cors = require('cors');
const { createCanvas, loadImage, registerFont } = require('canvas');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// 📌 REGISTRAR UNA FUENTE UNIVERSAL
registerFont(path.join(__dirname, 'fonts', 'NotoSans-Regular.ttf'), { family: 'Noto Sans' });

app.get('/', (req, res) => {
    res.send('API de Boost Card funcionando 🚀');
});

// 📌 Ruta para generar la imagen
app.get('/api/utility/boostcard', async (req, res) => {
    try {
        const { avatar, username, background, avatarposicion, usernameposicion } = req.query;

        if (!avatar || !username || !background) {
            return res.status(400).json({ error: "Faltan parámetros obligatorios (avatar, username, background)" });
        }

        const avatarPos = avatarposicion ? avatarposicion.split(',').map(Number) : [50, 50];
        const usernamePos = usernameposicion ? usernameposicion.split(',').map(Number) : [300, 300];

        const canvas = createCanvas(600, 300);
        const ctx = canvas.getContext('2d');

        const backgroundImg = await loadImage(background);
        ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);

        const avatarImg = await loadImage(avatar).catch(err => {
            console.error("Error cargando el avatar:", err);
            return null;
        });

        if (avatarImg) {
            ctx.beginPath();
            ctx.arc(avatarPos[0] + 50, avatarPos[1] + 50, 50, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(avatarImg, avatarPos[0], avatarPos[1], 100, 100);
        }

        // 📌 CONFIGURAR TEXTO CON FUENTE "NOTO SANS"
        ctx.font = '30px "Noto Sans"';
        ctx.fillStyle = "#FFFFFF";
        ctx.fillText(username, usernamePos[0], usernamePos[1]);

        res.setHeader('Content-Type', 'image/png');
        res.send(canvas.toBuffer());

    } catch (error) {
        console.error("Error generando la imagen:", error);
        res.status(500).json({ error: "Error generando la imagen" });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
