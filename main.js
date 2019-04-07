import { createBot, simulate } from "./simulate.js";
import { createRenderer } from "./render.js";

import { Prism } from "./prism.js";

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

const canvas = document.getElementById("viewport");
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

const renderer = createRenderer(canvas, canvas.width / 50000);

const run = () => {
    simulation.next();

    renderer.clear();

    for (let bot of arena.bots) {
        renderer.drawBot(bot);
    }

    requestAnimationFrame(run);
};

run();

const debounce = (wait, callback) => {
    let timeout = null;
    return (...args) => {
        const next = () => callback(...args);
        clearTimeout(timeout);
        timeout = setTimeout(next, wait);
    };
};

const code = document.getElementById("info").querySelector("pre code[class*=language-]");

code.textContent = `const hello = () => {
    let a = 4;
    // comment
    console.log("hello world");
}
`;

code.innerHTML =
    "<ol>" +
    Prism.highlight(code.textContent, Prism.languages.javascript, "javascript")
        .split("\n")
        .map(line => `<li class="line">${line}</span>`)
        .join("\n") +
    "</ol>";

code.parentElement.classList.add("formatted");
