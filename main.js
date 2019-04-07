import { createBot, simulate } from "./simulate.js";
import { createRenderer } from "./render.js";

const team1 = [
    createBot("shotgun", (myself, arena) => {
        return {
            type: "move",
            target: arena.teams[1][0]
        };
    })
];
const team2 = [
    createBot("machine", (myself, arena) => {
        return {
            type: "move",
            target: arena.teams[0][0]
        };
    })
];

const createArena = (team1, team2) => {
    Object.assign(team1[0], {
        x: 25000,
        y: 48500,
        team: 0
    });

    Object.assign(team2[0], {
        x: 25000,
        y: 1500,
        team: 1
    });

    return {
        bots: [...team1, ...team2],
        entities: [...team1, ...team2],
        teams: [team1, team2]
    };
};

const arena = createArena(team1, team2);
const simulation = simulate(arena);

const canvas = document.body.appendChild(document.createElement("canvas"));
canvas.width = 500;
canvas.height = 500;
canvas.style.cssText = `
    position: absolute;
    left: 50%;
    top: 50%;
    width: 500px; 
    height: 500px;
    margin: -250px;
`;

const renderer = createRenderer(canvas, 0.01);

const run = () => {
    simulation.next();

    renderer.clear();

    for (let bot of arena.bots) {
        renderer.drawBot(bot);
    }

    setTimeout(run, 25);
};

run();
