import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'api_data', 'stats.json');

export default async function handler(req, res) {
    try {
        let data = { peticiones: 0 };

        // Si el archivo existe, lo leemos
        if (fs.existsSync(filePath)) {
            data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        }

        // Aumentamos el contador de peticiones
        data.peticiones++;
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

        res.status(200).json({ peticiones: data.peticiones });
    } catch (error) {
        res.status(500).json({ error: "Error al obtener las estadísticas" });
    }
}

