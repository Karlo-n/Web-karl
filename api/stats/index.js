let stats = { peticiones: 0 };

export default async function handler(req, res) {
    try {
        stats.peticiones++;
        res.status(200).json({ peticiones: stats.peticiones });
    } catch (error) {
        res.status(500).json({ error: "Error al obtener las estadísticas" });
    }
}
