const QRCode = require("qrcode");

export default async function handler(req, res) {
    const { texto } = req.query;

    if (!texto) {
        return res.status(400).json({ error: "Falta el parámetro 'texto'" });
    }

    try {
        const qrImage = await QRCode.toDataURL(texto, { errorCorrectionLevel: "H" });
        res.json({ qrcode: qrImage });
    } catch (error) {
        res.status(500).json({ error: "No se pudo generar el código QR" });
    }
}
