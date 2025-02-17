import { NowRequest, NowResponse } from '@vercel/node';
import QRCode from 'qrcode';

export default async function (req = NowRequest, res = NowResponse) {
    const { texto } = req.query;

    if (!texto) {
        return res.status(400).json({ error: "Falta el parámetro 'texto'" });
    }

    try {
        const qr = await QRCode.toDataURL(texto);
        res.json({ qr });
    } catch (error) {
        res.status(500).json({ error: "Error generando el código QR" });
    }
}
