const express = require('express');
const boostCard = require('./boostcard');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const imageBuffer = await boostCard(req.query);
        res.setHeader('Content-Type', 'image/png');
        res.send(imageBuffer);
    } catch (error) {
        console.error('Error generando la imagen:', error);
        res.status(500).json({ error: 'Error generando la imagen' });
    }
});

module.exports = router;
