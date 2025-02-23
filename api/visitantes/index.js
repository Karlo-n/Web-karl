const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

// 📂 Archivo donde se almacenará el número de visitantes
const VISITANTES_FILE = path.join(__dirname, "../../data/visitantes.json");

// 🔄 Función para leer el número de visitantes desde el archivo
const leerVisitantes = () => {
    try {
        if (fs.existsSync(VISITANTES_FILE)) {
            const data = fs.readFileSync(VISITANTES_FILE, "utf8");
            return JSON.parse(data).visitantes || 0;
        } else {
            return 0;
        }
    } catch (error) {
        console.error("❌ Error leyendo visitantes:", error);
        return 0;
    }
};

// 🔄 Función para guardar el número de visitantes
const guardarVisitantes = (visitantes) => {
    try {
        fs.writeFileSync(VISITANTES_FILE, JSON.stringify({ visitantes }));
    } catch (error) {
        console.error("❌ Error guardando visitantes:", error);
    }
};

// 📌 Ruta para obtener el número de visitantes (GET)
router.get("/", (req, res) => {
    const visitantes = leerVisitantes();
    res.json({ visitantes });
});

// 📌 Ruta para aumentar el número de visitantes (POST)
router.post("/", (req, res) => {
    let visitantes = leerVisitantes();
    visitantes += 1; // 🔥 Sumar un visitante
    guardarVisitantes(visitantes);

    res.json({ visitantes });
});

module.exports = router;
