const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('🚀 API de Karl funcionando con Sharp 🚀');
});

// Importar rutas de imágenes con Sharp
const boostCard = require('./utility/boostcard');
app.use('/api/utility/boostcard', boostCard);

app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
