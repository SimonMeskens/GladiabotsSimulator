import { createBot, simulate } from "./simulate.js";
import { createRenderer } from "./render.js";

const team1 = [
    createBot("shotgun", (self, arena) => {
        const target = arena.teams[1][0];
        const x = target.x - self.x;
        const y = target.y - self.y;
        const distance = Math.sqrt(x * x + y * y);

        return {
            type: distance < 3000 || self.shield < 3000 ? "flee" : "move",
            target
        };
    })
];
const team2 = [
    createBot("machine", (self, arena) => {
        const target = arena.teams[0][0];
        const x = target.x - self.x;
        const y = target.y - self.y;
        const distance = Math.sqrt(x * x + y * y);

        return {
            type: distance < 15000 ? "attack" : "move",
            target
        };
    })
];

const createArena = (team1, team2) => {
    Object.assign(team1[0], {
        x: 20000,
        y: 1500,
        team: 1
    });

    Object.assign(team2[0], {
        x: 30000,
        y: 48500,
        team: 0
    });

    return {
        bots: [...team1, ...team2],
        entities: [...team1, ...team2],
        teams: [team1, team2],
        bullets: []
    };
};

const arena = createArena(team1, team2);
const simulation = simulate(arena);

const canvas = document.getElementById("viewport");
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

const renderer = createRenderer(canvas, canvas.width / 50000);

const info = document.getElementById("info");
const updateInfo = arena => {
    let html = "";

    for (let bot of arena.bots) {
        html += `
            <div class="bot-info">
                <h2 class="team${bot.team}">${bot.proto.name}</h2>
                <dl>
                    <dt>Health</dt><dd>${Math.floor(
                        (bot.health / bot.proto.health) * 100
                    )}%</dd>
                    <dt>Shield</dt><dd>${Math.floor(
                        (bot.shield / bot.proto.shield) * 100
                    )}%</dd>
                </dl>
            </div>
        `;
    }

    info.innerHTML = html;
};

const run = () => {
    simulation.next();

    updateInfo(arena);

    renderer.clear();

    for (let bot of arena.bots) {
        renderer.drawBotInfo(bot);
    }

    for (let bot of arena.bots) {
        renderer.drawBot(bot);
    }

    requestAnimationFrame(run);
};

run();

/*

<pre>
    <code class="language-javascript">
    </code>
</pre>

import { Prism } from "./prism.js";

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
*/
