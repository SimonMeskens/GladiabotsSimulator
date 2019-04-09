import * as stats from "./stats.js";

export const createBot = (type, ai) => {
    const proto = stats.bots[type];
    return {
        type,
        proto,
        ai,

        action: { type: "idle" },
        x: 0,
        y: 0,

        ...proto,

        shieldCooldown: stats.global.shieldCooldown,

        attackPrecisionCounter: 0,
        attackShots: 0
    };
};

const tick = (() => {
    const actions = new Map();

    return arena => {
        for (let bot of arena.bots) {
            actions.set(bot, bot.ai(bot, arena));
        }
        for (let bot of arena.bots) {
            bot.action = actions.get(bot);
        }
    };
})();

const turn = arena => {
    for (let bot of arena.bots) {
        if (bot.shield < bot.proto.shield) {
            if (bot.shieldCooldown < stats.global.shieldCooldown) {
                bot.shieldCooldown++;
            } else {
                bot.shield = Math.min(
                    bot.proto.shield,
                    bot.shield + bot.proto.shield / stats.global.shieldDuration
                );
            }
        }

        if (bot.action.type !== "attack") {
            bot.attackTarget = undefined;
        }

        if (bot.action.type === "move" || bot.action.type === "flee") {
            let x = bot.action.target.x - bot.x;
            let y = bot.action.target.y - bot.y;

            if (bot.action.type === "flee") {
                x *= -1;
                y *= -1;
            }

            const distance = Math.sqrt(x * x + y * y);
            let speed = bot.movementSpeed;
            if (
                bot.action.type === "move" &&
                bot.action.target.size &&
                distance - speed < bot.action.target.size + bot.size
            )
                speed = distance - (bot.action.target.size + bot.size);

            if (speed <= 0) {
                bot.action = { type: "idle" };
            } else {
                bot.x += (x * speed) / distance;
                bot.y += (y * speed) / distance;
            }
        } else if (bot.action.type === "attack") {
            if (bot.attackTarget !== bot.action.target) {
                bot.attackTarget = bot.action.target;
                bot.attackDuration = bot.proto.attackDuration;
                bot.attackAim = 0;
                bot.attackShots = 0;
            } else if (bot.attackAim < bot.proto.attackAim) {
                bot.attackAim++;
            } else if (bot.attackDuration < bot.proto.attackDuration) {
                bot.attackDuration++;
            } else {
                const x = bot.action.target.x - bot.x;
                const y = bot.action.target.y - bot.y;
                const distance = Math.sqrt(x * x + y * y);

                const precision =
                    distance > 15000
                        ? 0
                        : distance > 8000
                        ? bot.attackPrecision[2]
                        : distance > 3000
                        ? bot.attackPrecision[1]
                        : bot.attackPrecision[0];

                for (let i = 0; i < bot.attackBullets; i++) {
                    if ((bot.attackPrecisionCounter += precision) >= 100) {
                        bot.attackPrecisionCounter -= 100;

                        arena.bullets.push({
                            x: bot.x,
                            y: bot.y,
                            target: bot.action.target,
                            power: bot.attackPower
                        });
                    } else {
                        arena.bullets.push({
                            x: bot.x,
                            y: bot.y,
                            target: bot.action.target,
                            power: 0
                        });
                    }
                }

                bot.attackShots++;
                bot.attackDuration = 0;

                if (bot.attackShots === bot.proto.attackShots) {
                    bot.attackTarget = undefined;
                }
            }
        }
    }

    for (let bullet of arena.bullets) {
        let x = bullet.target.x - bullet.x;
        let y = bullet.target.y - bullet.y;

        const distance = Math.sqrt(x * x + y * y);

        if (distance - stats.global.bulletSpeed < bullet.target.size) {
            arena.bullets.splice(arena.bullets.indexOf(bullet), 1);

            if (bullet.target.health > 0 && bullet.power > 0) {
                bullet.target.shield -= bullet.power;
                bullet.target.shieldCooldown = 0;

                if (bullet.target.shield < 0) {
                    bullet.target.health = Math.max(
                        0,
                        bullet.target.health + bullet.target.shield
                    );
                    bullet.target.shield = 0;

                    if (bullet.target.health === 0) {
                        arena.bots.splice(arena.bots.indexOf(bullet.target), 1);
                    }
                }
            }
        } else {
            bullet.x += (x * stats.global.bulletSpeed) / distance;
            bullet.y += (y * stats.global.bulletSpeed) / distance;
        }
    }

    for (let bot of arena.bots) {
        bot.x = Math.min(arena.size - bot.size, Math.max(bot.size, bot.x));
        bot.y = Math.min(arena.size - bot.size, Math.max(bot.size, bot.y));

        for (let target of arena.bots) {
            if (bot === target) continue;

            const x = target.x - bot.x;
            const y = target.y - bot.y;
            const distance = Math.sqrt(x * x + y * y);
            const speed = distance - target.size - bot.size;

            if (speed < 0) {
                bot.x += (x * speed) / distance;
                bot.y += (y * speed) / distance;
                target.x -= (x * speed) / distance;
                target.y -= (y * speed) / distance;
            }
        }
    }
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
