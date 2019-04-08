const mPs_mmPt = 25;
const s_t = 40;
const m_mm = 1000;

export const global = {
    shieldDuration: 3 * s_t,
    shieldCooldown: 3 * s_t,
    bulletSpeed: 40 * mPs_mmPt
};

export const bots = {
    assault: {
        name: "Assault",

        health: 5000,
        shield: 3000,

        movementSpeed: 1.2 * mPs_mmPt,
        carrySpeed: 0.5 * mPs_mmPt,

        attackPower: 300,
        attackAim: 1 * s_t,
        attackDuration: 0.1 * s_t,
        attackBullets: 2,
        attackShots: 3,
        attackPrecision: [95, 55, 15],

        size: 0.3 * m_mm
    },
    shotgun: {
        name: "Shotgun",

        health: 3000,
        shield: 5000,

        movementSpeed: 2.0 * mPs_mmPt,
        carrySpeed: 0.5 * mPs_mmPt,

        attackPower: 600,
        attackAim: 1 * s_t,
        attackDuration: 0 * s_t,
        attackBullets: 5,
        attackShots: 1,
        attackPrecision: [75, 25, 0],

        size: 0.3 * m_mm
    },
    sniper: {
        name: "Sniper",

        health: 3000,
        shield: 3000,

        movementSpeed: 1.0 * mPs_mmPt,
        carrySpeed: 0.5 * mPs_mmPt,

        attackPower: 2000,
        attackAim: 3 * s_t,
        attackDuration: 0 * s_t,
        attackBullets: 1,
        attackShots: 1,
        attackPrecision: [100, 100, 100],

        size: 0.3 * m_mm
    },
    machine: {
        name: "Machine Gun",

        health: 7000,
        shield: 6000,

        movementSpeed: 0.7 * mPs_mmPt,
        carrySpeed: 0.7 * mPs_mmPt,

        attackPower: 250,
        attackAim: 2 * s_t,
        attackDuration: 0.075 * s_t,
        attackBullets: 1,
        attackShots: 100,
        attackPrecision: [80, 50, 10],
        size: 0.4 * m_mm
    }
};
