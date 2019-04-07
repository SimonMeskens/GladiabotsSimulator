import * as stats from "./stats.js";

const actions = new Map();

export const createBot = (type, ai) => {
    type = stats.bots[type];
    return {
        type,
        ai,
        action: { type: "idle" },
        x: 0,
        y: 0,
        movementSpeed: type.movement.speed * 25,
        size: type.size * 1000
    };
};

const tick = arena => {
    for (let bot of arena.bots) {
        actions.set(bot, bot.ai(bot, arena));
    }
    for (let bot of arena.bots) {
        bot.action = actions.get(bot);
    }
};

const turn = arena => {
    for (let bot of arena.bots) {
        if (bot.action.type === "move") {
            const x = bot.action.target.x - bot.x;
            const y = bot.action.target.y - bot.y;

            const distance = Math.sqrt(x * x + y * y);
            let speed = bot.movementSpeed;
            if (distance - speed < bot.action.target.size + bot.size)
                speed = distance - (bot.action.target.size + bot.size);

            if (speed <= 0) {
                bot.action = { type: "idle" };
            } else {
                bot.x += (x * speed) / distance;
                bot.y += (y * speed) / distance;
            }
        }
    }

    // TODO collision
};

export const simulate = function*(arena) {
    let time = 0;

    while (true) {
        if (time % 250 === 0) tick(arena);
        turn(arena);
        time += 25;
        yield;
    }
};
