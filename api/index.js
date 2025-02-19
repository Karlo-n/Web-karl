const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

// Importar y usar las rutas de las APIs
app.use('/api/utility/traductor', require('./utility/traductor'));
app.use('/api/utility/qr', require('./utility/qr'));

// Página de prueba
app.get('/', (req, res) => {
    res.send('API Karl funcionando 🚀');
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
