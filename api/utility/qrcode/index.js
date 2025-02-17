import QRCode from 'qrcode';

export default async function handler(req, res) {
    try {
        const { texto } = req.query;

        if (!texto) {
            return res.status(400).json({ error: "Falta el parámetro 'texto'" });
        }

        // Genera el código QR en formato PNG
        const qrImage = await QRCode.toBuffer(texto);

        // Configura la cabecera para que el navegador interprete la imagen correctamente
        res.setHeader('Content-Type', 'image/png');
        res.send(qrImage);

    } catch (error) {
        console.error("Error generando el código QR:", error);
        res.status(500).json({ error: "Error generando el código QR" });
    }
}
