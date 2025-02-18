const sharp = require('sharp');
const axios = require('axios');
const { createCanvas, loadImage } = require('canvas');

async function generateBoostCard({ avatar, username, background, avatarposicion, usernameposicion, color }) {
    try {
        // Descargamos las imágenes
        const [bgBuffer, avatarBuffer] = await Promise.all([
            axios.get(background, { responseType: 'arraybuffer' }).then(res => res.data),
            axios.get(avatar, { responseType: 'arraybuffer' }).then(res => res.data)
        ]);

        // Creamos un canvas
        const width = 600, height = 300;
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        // Cargar y dibujar fondo
        const bgImage = await loadImage(bgBuffer);
        ctx.drawImage(bgImage, 0, 0, width, height);

        // Cargar y dibujar avatar
        const avatarImage = await loadImage(avatarBuffer);
        const [avatarX, avatarY] = avatarposicion ? avatarposicion.split(',').map(Number) : [50, 50];
        ctx.drawImage(avatarImage, avatarX, avatarY, 80, 80);

        // Configurar color de texto
        ctx.fillStyle = color || '#FFFFFF';
        ctx.font = '30px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Posición del username
        const [textX, textY] = usernameposicion ? usernameposicion.split(',').map(Number) : [300, 250];
        ctx.fillText(username, textX, textY);

        return canvas.toBuffer('image/png');
    } catch (error) {
        console.error('Error generando boost card:', error);
        throw new Error('No se pudo generar la imagen');
    }
}

module.exports = generateBoostCard;
