const createColor = (r, g, b) => a => `rgba(${r}, ${g}, ${b}, ${a})`;
const orange = [255, 106, 13];
const blue = [13, 126, 255];

const drawBot = (bot, graphics, scale) => {
    const color = createColor(...(bot.team === 0 ? orange : blue));
    const x = bot.x * scale;
    const y = bot.y * scale;

    graphics.lineWidth = 2;

    graphics.fillStyle = color(1);
    graphics.beginPath();
    graphics.arc(x, y, bot.size * scale, 0, Math.PI * 2);
    graphics.fill();

    graphics.strokeStyle = color(0.5);
    graphics.beginPath();
    graphics.arc(x, y, 3000 * scale, 0, Math.PI * 2);
    graphics.stroke();

    graphics.strokeStyle = color(0.3);
    graphics.beginPath();
    graphics.arc(x, y, 8000 * scale, 0, Math.PI * 2);
    graphics.stroke();

    graphics.strokeStyle = color(0.15);
    graphics.beginPath();
    graphics.arc(x, y, 15000 * scale, 0, Math.PI * 2);
    graphics.stroke();
};

export const createRenderer = (canvas, scale) => {
    const graphics = canvas.getContext("2d", {
        alpha: false
    });

    return {
        clear: () => graphics.clearRect(0, 0, canvas.width, canvas.height),
        drawBot: bot => drawBot(bot, graphics, scale)
    };
};
