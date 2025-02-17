const QRCode = require('qrcode');

module.exports = async (req, res) => {
    try {
        const { texto } = req.query;

        if (!texto) {
            return res.status(400).json({ error: "Falta el parámetro 'texto'" });
        }

        // Genera el código QR y lo devuelve como imagen
        const qrImage = await QRCode.toDataURL(texto);
        
        // Responde con la imagen en formato PNG
        res.setHeader('Content-Type', 'image/png');
        res.send(Buffer.from(qrImage.split(',')[1], 'base64'));

    } catch (error) {
        res.status(500).json({ error: "Error generando el código QR" });
    }
};
