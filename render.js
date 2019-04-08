const color = hex => {
    hex = hex[0] === "#" ? hex.substring(1, 7) : hex;

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return a => `rgba(${r}, ${g}, ${b}, ${a})`;
};

const theme = {
    bg: ["#1d2021", "#282828", "#32302f", "#f2e5bc", "#fbf1c7", "#f9f5d7"],
    gray: [
        "#282828",
        "#3c3636",
        "#504945",
        "#665c54",
        "#7c6f64",
        "#928374",
        "#a89984",
        "#bdae93",
        "#d5c4a1",
        "#ebdbb2",
        "#fbf1c7"
    ],
    red: ["#9d0006", "#cc241d", "#fb4934"],
    green: ["#79740e", "#98971a", "#b8bb26"],
    yellow: ["#b57614", "#d79921", "#fabd2f"],
    blue: ["#076678", "#458588", "#83a598"],
    purple: ["#8f3f71", "#b16286", "#d3869b"],
    aqua: ["#427b58", "#689d6a", "#8ec07c"],
    orange: ["#af3a03", "#d65d0e", "#fe8019"]
};

const drawBot = (bot, graphics, scale) => {
    const fg = color(bot.team === 0 ? theme.red[0] : theme.blue[0]);

    const x = bot.x * scale;
    const y = bot.y * scale;

    graphics.fillStyle = fg(1);
    graphics.beginPath();
    graphics.arc(x, y, bot.size * scale, 0, Math.PI * 2);
    graphics.fill();
};

const drawBotInfo = (bot, graphics, scale) => {
    const bg = color(bot.team === 0 ? theme.red[1] : theme.blue[1]);

    const x = bot.x * scale;
    const y = bot.y * scale;

    graphics.lineWidth = 2;

    if (bot.action.type === "attack") {
        const target = bot.action.target;

        graphics.strokeStyle = color(theme.purple[0])(0.5);
        graphics.beginPath();
        graphics.setLineDash([15, 5]);
        graphics.moveTo(x, y);
        graphics.lineTo(target.x * scale, target.y * scale);
        graphics.stroke();
        graphics.setLineDash([]);
    }

    graphics.strokeStyle = bg(0.5);
    graphics.beginPath();
    graphics.arc(x, y, 3000 * scale, 0, Math.PI * 2);
    graphics.stroke();

    graphics.strokeStyle = bg(0.3);
    graphics.beginPath();
    graphics.arc(x, y, 8000 * scale, 0, Math.PI * 2);
    graphics.stroke();

    graphics.strokeStyle = bg(0.15);
    graphics.beginPath();
    graphics.arc(x, y, 15000 * scale, 0, Math.PI * 2);
    graphics.stroke();
};

const drawBullet = (bullet, graphics, scale) => {
    const fg = color(theme.yellow[2]);

    const x = bullet.x * scale;
    const y = bullet.y * scale;

    graphics.fillStyle = fg(0.7);
    graphics.beginPath();
    graphics.arc(x, y, 500 * scale, 0, Math.PI * 2);
    graphics.fill();
};

export const createRenderer = (canvas, scale) => {
    const graphics = canvas.getContext("2d", {
        alpha: false
    });

    return {
        clear: () => {
            graphics.fillStyle = color(theme.bg[3])(1);
            graphics.fillRect(0, 0, canvas.width, canvas.height);
        },
        drawBot: bot => drawBot(bot, graphics, scale),
        drawBotInfo: bot => drawBotInfo(bot, graphics, scale),
        drawBullet: bullet => drawBullet(bullet, graphics, scale)
    };
};
