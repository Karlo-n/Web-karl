const sharp = require('sharp');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const fontPath = path.join(__dirname, '..', '..', 'fonts', 'NotoSans-VariableFont_wdth,wght.ttf');

async function generateBoostCard(avatar, username, background, avatarposicion, usernameposicion, color) {
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

        // Añadir avatar sobre la imagen de fondo
        let compositeImage = await sharp(backgroundImage)
            .composite([
                { input: avatarImage, left: avatarX, top: avatarY }
            ])
            .toBuffer();

        // Convertir la imagen en un buffer para texto
        const finalImage = await sharp(compositeImage)
            .composite([
                {
                    input: await sharp({
                        create: {
                            width: 600,
                            height: 300,
                            channels: 4,
                            background: { r: 0, g: 0, b: 0, alpha: 0 }
                        }
                    })
                    .png()
                    .toBuffer(),
                    left: 0,
                    top: 0
                }
            ])
            .toBuffer();

        return finalImage;
    } catch (error) {
        console.error('Error generando la boostcard:', error);
        throw new Error('No se pudo generar la boostcard.');
    }
}

module.exports = generateBoostCard;
