const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// IMPORTA EL BOOSTCARD CORRECTAMENTE
const boostcardRouter = require('/api/utility/boostcard/index');
app.use('/api/utility/boostcard', boostcardRouter);

app.get('/', (req, res) => {
    res.send('API de Traducción con Google Translate funcionando 🚀');
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
