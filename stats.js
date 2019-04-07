export const bots = {
    assault: {
        health: 5000,
        shield: {
            points: 3000,
            delay: 3,
            duration: 3
        },
        movement: {
            speed: 1.2,
            carry: 0.5
        },
        attack: {
            power: 300,
            aim: 1,
            duration: 0.1,
            bullets: 2,
            shots: 3,
            precision: {
                short: 95,
                medium: 55,
                long: 15
            }
        },
        size: 0.3
    },
    shotgun: {
        health: 3000,
        shield: {
            points: 5000,
            delay: 3,
            duration: 3
        },
        movement: {
            speed: 2.0,
            carry: 0.5
        },
        attack: {
            power: 600,
            aim: 1,
            duration: 0,
            bullets: 5,
            shots: 1,
            precision: {
                short: 75,
                medium: 25,
                long: 0
            }
        },
        size: 0.3
    },
    sniper: {
        health: 3000,
        shield: {
            points: 3000,
            delay: 3,
            duration: 3
        },
        movement: {
            speed: 1.0,
            carry: 0.5
        },
        attack: {
            power: 2000,
            aim: 3,
            duration: 0,
            bullets: 1,
            shots: 1,
            precision: {
                short: 100,
                medium: 100,
                long: 100
            }
        },
        size: 0.3
    },
    machine: {
        health: 7000,
        shield: {
            points: 6000,
            delay: 3,
            duration: 3
        },
        movement: {
            speed: 0.7,
            carry: 0.7
        },
        attack: {
            power: 250,
            aim: 2,
            duration: 0.075,
            bullets: 1,
            shots: 100,
            precision: {
                short: 80,
                medium: 50,
                long: 10
            }
        },
        size: 0.4
    }
};
