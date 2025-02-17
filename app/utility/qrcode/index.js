const QRCode = require('qrcode');

module.exports = async (req, res) => {
    try {
        const { texto } = req.query;

        if (!texto) {
            return res.status(400).json({ error: "Falta el parámetro 'texto'" });
        }

        // Genera el código QR y devuelve un buffer en PNG
        const qrImage = await QRCode.toBuffer(texto);

        // Configura el encabezado de respuesta para una imagen PNG
        res.setHeader('Content-Type', 'image/png');
        res.send(qrImage);

    } catch (error) {
        console.error("Error generando el código QR:", error);
        res.status(500).json({ error: "Error generando el código QR" });
    }
};
