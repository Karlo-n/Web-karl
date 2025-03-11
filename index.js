const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Servir archivos estáticos desde la raíz del proyecto
app.use(express.static(path.join(__dirname, '../public')));

// Servir el index.html cuando se acceda a la raíz del dominio
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// API Traductor
app.use('/api/utility/traductor', require('./utility/traductor/index'));

// API QR
app.use('/api/utility/qr', require('./utility/qr/index'));

// =========== MANEJADOR DE ERROR 404 ===========
// Esta ruta debe ir después de todas tus rutas regulares
app.use((req, res) => {
    // Primero verifica si es una ruta de API
    if (req.path.startsWith('/api/')) {
        // Para rutas de API, responde con JSON
        return res.status(404).json({
            error: true,
            code: 404,
            message: "El endpoint solicitado no existe"
        });
    }
    
    // Para rutas web, muestra la página 404 personalizada
    res.status(404).sendFile(path.join(__dirname, '../public/404.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
