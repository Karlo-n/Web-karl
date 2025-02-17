let visitas = { total: 0, users: new Set() };

export default async function handler(req, res) {
    try {
        const userIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        if (!visitas.users.has(userIP)) {
            visitas.total++;
            visitas.users.add(userIP);
        }

        res.status(200).json({ visitas: visitas.total });
    } catch (error) {
        res.status(500).json({ error: "Error al obtener visitas" });
    }
}
