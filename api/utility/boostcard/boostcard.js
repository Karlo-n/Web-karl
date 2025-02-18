const sharp = require('sharp');
const axios = require('axios');

async function generateBoostCard({ avatar, username, background, avatarposicion, usernameposicion, color }) {
    try {
        // Descargar imágenes
        const avatarBuffer = (await axios.get(avatar, { responseType: 'arraybuffer' })).data;
        const backgroundBuffer = (await axios.get(background, { responseType: 'arraybuffer' })).data;

        // Posiciones personalizadas
        const [avatarX, avatarY] = avatarposicion ? avatarposicion.split(',').map(Number) : [50, 50];
        const [textX, textY] = usernameposicion ? usernameposicion.split(',').map(Number) : [300, 250];

        // Procesar imagen de fondo
        let backgroundImage = await sharp(backgroundBuffer)
            .resize(600, 300)
            .toBuffer();

        // Procesar avatar
        const avatarImage = await sharp(avatarBuffer)
            .resize(80, 80)
            .toBuffer();

        // Componer la imagen final
        let compositeImage = await sharp(backgroundImage)
            .composite([{ input: avatarImage, left: avatarX, top: avatarY }])
            .toBuffer();

        return compositeImage;
    } catch (error) {
        console.error('Error generando la boostcard:', error);
        throw new Error('No se pudo generar la boostcard.');
    }
}

module.exports = generateBoostCard;
