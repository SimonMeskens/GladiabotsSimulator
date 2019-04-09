import { createBot, simulate } from "./simulate.js";
import { createRenderer } from "./render.js";

const tainy = (self, arena) => {
    const distances = new Map();
    const allyTargets = [];

    for (let bot of arena.bots) {
        if (bot === self) continue;

        const x = bot.x - self.x;
        const y = bot.y - self.y;
        const distance = Math.sqrt(x * x + y * y);

        distances.set(bot, distance);

        if (bot.team === self.team) {
            if (bot.action.type === "attack") allyTargets.push(bot.action.target);
        }
    }

    if (self.shield < self.proto.shield / 2) {
        const fleeTargets = arena.teams[1 - self.team].filter(
            enemy =>
                enemy.action.type === "attack" &&
                enemy.action.target === self &&
                distances.get(enemy) <= 15000 &&
                enemy.health + enemy.shield >= self.health + self.shield
        );

        let [x, y] = fleeTargets.reduce(
            (acc, enemy) => [acc[0] + enemy.x, acc[1] + enemy.y],
            [0, 0]
        );

        x /= fleeTargets.length;
        y /= fleeTargets.length;

        if (fleeTargets.length > 0)
            return {
                type: "flee",
                target: { x, y }
            };
    }

    if (self.action.type === "attack" && distances.get(self.action.target) <= 15000) {
        return self.action;
    }

    const mediumTargets = arena.teams[1 - self.team]
        .filter(enemy => distances.get(enemy) <= 8000)
        .sort((a, b) => a.health < b.health);

    if (mediumTargets.length > 0)
        return {
            type: "attack",
            target: mediumTargets[0]
        };

    const nearest = arena.teams[1 - self.team]
        .slice(0)
        .sort((a, b) => distances.get(a) < distances.get(b));

    return {
        type: "move",
        target: nearest[0]
    };
};

const team1 = [
    createBot("sniper", tainy),
    createBot("machine", tainy),
    createBot("assault", tainy),
    createBot("assault", tainy)
];
const team2 = [
    createBot("assault", tainy),
    createBot("assault", tainy),
    createBot("assault", tainy),
    createBot("assault", tainy)
];

const createArena = (team1, team2) => {
    Object.assign(team1[0], {
        x: 22000,
        y: 1500,
        team: 0
    });
    Object.assign(team1[1], {
        x: 24000,
        y: 1500,
        team: 0
    });
    Object.assign(team1[2], {
        x: 26000,
        y: 1500,
        team: 0
    });
    Object.assign(team1[3], {
        x: 28000,
        y: 1500,
        team: 0
    });

    Object.assign(team2[0], {
        x: 22000,
        y: 48500,
        team: 1
    });
    Object.assign(team2[1], {
        x: 24000,
        y: 48500,
        team: 1
    });
    Object.assign(team2[2], {
        x: 26000,
        y: 48500,
        team: 1
    });
    Object.assign(team2[3], {
        x: 28000,
        y: 48500,
        team: 1
    });

    return {
        bots: [...team1, ...team2],
        teams: [team1, team2],
        bullets: [],
        size: 50000
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
                    <dt>Action</dt><dd>${bot.action.type}</dd>
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

    for (let bullet of arena.bullets) {
        renderer.drawBullet(bullet);
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
