const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// IMPORTA CORRECTAMENTE BOOSTCARD
const boostcard = require('./boostcard');
app.use('/api/utility/boostcard', boostcard.router);

app.get('/', (req, res) => {
    res.send('API de Traducción con Google Translate funcionando 🚀');
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
