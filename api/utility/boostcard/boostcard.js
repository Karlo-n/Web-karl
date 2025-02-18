const { createCanvas, loadImage, registerFont } = require('canvas');
const path = require('path');

// Registrar la fuente
const fontPath = path.join(__dirname, 'fonts', 'NotoSans-VariableFont_wdth,wght.ttf');
registerFont(fontPath, { family: 'NotoSans' });

async function boostCard({ avatar, username, background, avatarposicion, usernameposicion, color }) {
    if (!avatar || !username || !background) {
        throw new Error('Faltan parámetros obligatorios');
    }

    const canvas = createCanvas(600, 300);
    const ctx = canvas.getContext('2d');

    // Cargar la imagen de fondo
    const bgImage = await loadImage(background);
    ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

    // Cargar la imagen del avatar
    const avatarImage = await loadImage(avatar);
    const [avatarX, avatarY] = avatarposicion ? avatarposicion.split(',').map(Number) : [50, 50];
    ctx.drawImage(avatarImage, avatarX, avatarY, 80, 80);

    // Configurar el color del texto
    ctx.fillStyle = color || '#FFFFFF';
    ctx.font = '30px NotoSans';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Posición del texto
    const [textX, textY] = usernameposicion ? usernameposicion.split(',').map(Number) : [300, 250];
    ctx.fillText(username, textX, textY);

    return canvas.toBuffer();
}

module.exports = boostCard;
