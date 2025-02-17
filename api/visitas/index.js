import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'api_data', 'visitas.json');

export default async function handler(req, res) {
    try {
        let data = { total: 0 };

        // Si el archivo existe, lo leemos
        if (fs.existsSync(filePath)) {
            data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        }

        // Aumentamos la visita solo si es la primera vez del usuario
        const userIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        if (!data.users) data.users = [];
        if (!data.users.includes(userIP)) {
            data.total++;
            data.users.push(userIP);
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        }

        res.status(200).json({ visitas: data.total });
    } catch (error) {
        res.status(500).json({ error: "Error al obtener visitas" });
    }
}
