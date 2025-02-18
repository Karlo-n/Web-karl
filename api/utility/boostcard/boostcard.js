const { createCanvas, loadImage } = require('canvas');

async function createBoostCard(avatarURL, username, backgroundURL, avatarPos, usernamePos) {
    const width = 800;
    const height = 400;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Verificar que los parámetros obligatorios estén presentes
    if (!username || !avatarURL || !backgroundURL) {
        throw new Error("Faltan parámetros obligatorios: avatar, username y background son requeridos.");
    }

    // Cargar el fondo (imagen o color de respaldo)
    try {
        const background = await loadImage(backgroundURL);
        ctx.drawImage(background, 0, 0, width, height);
    } catch (error) {
        console.error("No se pudo cargar la imagen de fondo:", error);
        ctx.fillStyle = "#1a1a2e";
        ctx.fillRect(0, 0, width, height);
    }

    // Posiciones por defecto si no se proporcionan
    let [avatarX, avatarY] = avatarPos ? avatarPos.split(',').map(Number) : [50, height / 2 - 60];
    let [usernameX, usernameY] = usernamePos ? usernamePos.split(',').map(Number) : [200, height / 2 + 15];

    // Cargar y dibujar el avatar en forma circular
    try {
        const avatarImage = await loadImage(avatarURL);
        const avatarSize = 120;

        ctx.save();
        ctx.beginPath();
        ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(avatarImage, avatarX, avatarY, avatarSize, avatarSize);
        ctx.restore();
    } catch (error) {
        console.error("No se pudo cargar el avatar:", error);
    }

    // Escribir el username en la posición personalizada
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 40px Arial";
    ctx.textAlign = "left";
    ctx.fillText(username, usernameX, usernameY);

    return canvas.toBuffer();
}

module.exports = { createBoostCard };
