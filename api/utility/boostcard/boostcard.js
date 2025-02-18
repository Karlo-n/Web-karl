const { createCanvas, loadImage, registerFont } = require('canvas');
const path = require('path');

// Registrar la fuente desde la carpeta fonts
registerFont(path.join(__dirname, 'fonts', 'NotoSans-VariableFont_wdth,wght.ttf'), { family: 'Noto Sans' });

async function generateBoostCard(avatarUrl, username, backgroundUrl, avatarPos, usernamePos) {
    const canvas = createCanvas(800, 400);
    const ctx = canvas.getContext('2d');

    // Cargar el fondo
    const background = await loadImage(backgroundUrl);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    // Cargar el avatar
    const avatar = await loadImage(avatarUrl);
    const [avatarX, avatarY] = avatarPos.split(',').map(Number);
    ctx.drawImage(avatar, avatarX, avatarY, 100, 100);

    // Establecer la fuente correcta
    ctx.font = 'bold 30px "Noto Sans"';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';

    // Posicionar el username
    const [textX, textY] = usernamePos.split(',').map(Number);
    ctx.fillText(username, textX, textY);

    return canvas.toBuffer();
}

module.exports = generateBoostCard;
