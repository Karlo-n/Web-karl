const express = require('express');
const QRCode = require('qrcode');

const app = express();
app.use(express.json());

app.get('/', async (req, res) => {
    const { text } = req.query;
    if (!text) {
        return res.status(400).json({ error: "Falta el parámetro 'text'" });
    }
    try {
        const qr = await QRCode.toDataURL(text);
        res.json({ qr });
    } catch (error) {
        res.status(500).json({ error: "Error generando el QR", detalle: error.message });
    }
});

module.exports = app; // 🔹 Agregar esta línea
