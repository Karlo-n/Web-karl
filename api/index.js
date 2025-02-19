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

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
