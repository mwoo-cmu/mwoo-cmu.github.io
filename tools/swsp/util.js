// SRC: https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
const cyrb53 = (str, seed = 0) => {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
    h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
    h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);

    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

function addTextIcons(text) {
    // TODO: add a colour map mapping each icon to its colour for this
    return text.replaceAll("{", `<span class="shatterpoint-icon text-sm bg-slate-900 border border-slate-700 px-1.5 py-0.5 rounded">`).replaceAll("}", "</span>");
}

function lazySwap(activate, list) {
    list.forEach(function (value) {
        document.getElementById(value).style.display = "none";
    });
    document.getElementById(activate).style.display = "block";
}

var UNITS = {}
function withUnits(callback) {
    if (Object.keys(UNITS).length == 0)
        fetch("resources/units.json")
            .then(response => response.json())
            .then(data => {
                UNITS = {
                    ...data,
                    ...JSON.parse(localStorage.getItem("customUnits"))
                };
                callback(UNITS);
            })
            .catch(error => {
                console.error("Error Fetching JSON: ", error);
            });
    else
        callback(UNITS);
}

var LOCATIONS = {};
function withLocations(callback) {
    if (Object.keys(LOCATIONS).length == 0)
        fetch("resources/locations.json")
            .then(response => response.json())
            .then(data => {
                LOCATIONS = {
                    ...data,
                    ...JSON.parse(localStorage.getItem("customLocations"))
                };
                callback(LOCATIONS);
            })
            .catch(error => {
                console.error("Error Fetching JSON: ", error);
            });
    else
        callback(LOCATIONS);
}

var ENEMIES = {};
function withEnemies(callback) {
    if (Object.keys(ENEMIES).length == 0)
        fetch("resources/enemies.json")
            .then(response => response.json())
            .then(data => {
                ENEMIES = {
                    ...data,
                    ...JSON.parse(localStorage.getItem("customEnemies"))
                };
                callback(ENEMIES);
            })
            .catch(error => {
                console.error("Error Fetching JSON: ", error);
            });
    else
        callback(ENEMIES);
}

function renderBasics(unit, isPrimary, ary, hash) {
    var switcher = unit["abilities"].hasOwnProperty("primary") ? `
        <div class="flex gap-4 text-xs font-semibold mb-2">
            <label for="unitPrimary${hash}" class="cursor-pointer flex items-center gap-1">
                <input type="radio" id="unitPrimary${hash}" name="unitAry${hash}" ${isPrimary ? "checked" : ""} onclick="renderUnit('${unit["name"]}', true, ${hash});" class="accent-indigo-500">
                <span>Primary</span>
            </label>
            <label for="unitSecondary${hash}" class="cursor-pointer flex items-center gap-1">
                <input type="radio" id="unitSecondary${hash}" name="unitAry${hash}" ${isPrimary ? "" : "checked"} onclick="renderUnit('${unit["name"]}', false, ${hash});" class="accent-indigo-500">
                <span>Secondary/Supporting</span>
            </label>
        </div>` : "";
    return addTextIcons(`${switcher}
        <div class="flex items-center gap-3 bg-slate-950 p-2 rounded border border-slate-800 text-sm font-mono mb-2">
            <span>{v} ${unit["force"]}</span>
            <span>{r} ${unit["stamina"][ary]}</span>
            <span>{w} ${unit["durability"][ary]}</span>
        </div>
        <div class="text-xs text-slate-400 italic mb-2">${unit["tags"].join(" • ")}</div>`);
}

function renderAbilities(unit, ary) {
    var abilities = unit["abilities"];
    return addTextIcons(abilities[ary].map((idx) => abilities["pool"][idx]).map((abil) => `
        <div class="bg-slate-950/80 p-2.5 rounded border border-slate-800/80 mb-2 text-xs">
            <div class="flex justify-between items-center mb-1 font-semibold text-slate-200">
                <span>${abil["type"]} <b>${abil["name"]}</b></span>
                <span class="text-amber-400">${abil["cost"]}</span>
            </div>
            <div class="text-slate-400 leading-relaxed">${abil["desc"]}</div>
        </div>
    `).join(""));
}

function _renderUnit(unit, isPrimary, hash) {
    var ary = isPrimary ? "primary" : "secondary";
    return `${renderBasics(unit, isPrimary, ary, hash)}
    ${renderAbilities(unit, ary)}
    <div class="mt-3">${renderStances(unit, isPrimary, hash)}</div>`;
}

function expertiseTable(type, data) {
    return addTextIcons(`<div class="overflow-hidden rounded border border-slate-800 text-xs my-2">
    <table class="w-full text-left border-collapse">
        <thead>
            <tr class="bg-slate-800/60 text-slate-300">
                <th class="p-1.5 border-b border-slate-800">${type}</th>
                <th class="p-1.5 border-b border-slate-800">${data["name"]}</th>
            </tr>
        </thead>
        <tbody class="divide-y divide-slate-800/50 bg-slate-950/40">
            ${Object.entries(data["breakpoints"]).map(([expertise, effect]) => `<tr><td class="p-1.5 font-mono text-indigo-300">${expertise}</td><td class="p-1.5 text-slate-300">${effect}</td></tr>`).join("")}
        </tbody>
    </table>
</div>`);
}

function diceTable(stance, hash) {
    var range = stance["ranged"]["attack"] == 0 ? "-" : `{g} ${stance["ranged"]["range"]}`;
    return addTextIcons(`<div class="overflow-hidden rounded border border-slate-800 text-xs my-2">
    <table class="w-full text-center border-collapse">
        <thead>
            <tr class="bg-slate-800/60 text-slate-300">
                <th class="p-1.5 border-b border-slate-800 text-left">Dice Pool</th>
                <th class="p-1.5 border-b border-slate-800">{n}<br>${range}</th>
                <th class="p-1.5 border-b border-slate-800">{o}</th>
            </tr>
        </thead>
        <tbody class="divide-y divide-slate-800/50 bg-slate-950/40 font-mono">
            <tr>
                <td class="p-1.5 text-left font-sans font-medium text-slate-400">Attack</td>
                <td class="p-1.5" id="rangedAttack${hash}">${stance["ranged"]["attack"] == 0 ? "--" : stance["ranged"]["attack"]}</td>
                <td class="p-1.5" id="meleeAttack${hash}">${stance["melee"]["attack"] == 0 ? "--" : stance["melee"]["attack"]}</td>
            </tr>
            <tr>
                <td class="p-1.5 text-left font-sans font-medium text-slate-400">Defence</td>
                <td class="p-1.5" id="rangedDefence${hash}">${stance["ranged"]["defence"]}</td>
                <td class="p-1.5" id="meleeDefence${hash}">${stance["melee"]["defence"]}</td>
            </tr>
        </tbody>
    </table>
</div>`);
}

const ctFIRST = "#df802a";
const ctAVL = "#ffffff";
const ctUNAVL = "#334155";
const ctSELECTED = "#10b981";
const ctSIZE = 50;
const ctHALFSIZE = ctSIZE / 2;
const ctPADDING = 10;

function toggleCombatTreeTile(tileTag, ...childTags) {
    var tileRect = document.getElementById(tileTag + "_rect");
    var tileFill = tileRect.getAttribute("fill");
    if (tileFill !== ctFIRST && tileFill !== ctAVL) {
        return;
    }
    var tileStroke = tileRect.getAttribute("stroke");
    if (tileStroke === ctSELECTED) {
        var tileX = tileTag.split("-")[0].split("_").at(-1);
        for (const child of childTags) {
            var childRect = document.getElementById(child + "_rect");
            var childElem = document.getElementById(child);
            var unlocks = parseInt(childElem.getAttribute("data-unlocks"));

            unlocks -= 1;

            childElem.setAttribute("data-unlocks", unlocks);
            if (unlocks === 0) {
                if (childRect.getAttribute("stroke") === ctSELECTED) {
                    childElem.onclick.apply(childElem);
                }
                childRect.setAttribute("fill", ctUNAVL);
            }
        }
        tileRect.setAttribute("stroke", "#1e293b");
        if (tileX === "0")
            document.getElementById(tileTag + "_text").style.color = "white";
        else
            document.getElementById(tileTag + "_text").style.color = ctFIRST;
    } else {
        tileRect.setAttribute("stroke", ctSELECTED);
        document.getElementById(tileTag + "_text").style.color = ctSELECTED;
        for (const child of childTags) {
            var childRect = document.getElementById(child + "_rect");
            var childElem = document.getElementById(child);
            var unlocks = parseInt(childElem.getAttribute("data-unlocks"));
            childElem.setAttribute("data-unlocks", unlocks + 1);
            childRect.setAttribute("fill", ctAVL);
        }
    }
}

function combatTree(stance, hash) {
    function treeTile(x, y, tile, tag) {
        if (!tile)
            return "";
        var tileX = x * (ctSIZE + ctPADDING);
        var tileY = y * (ctSIZE + ctPADDING);
        var unlockTags = tile["unlocks"].map(([childX, childY]) => `'${baseTag}_${childX}-${childY}'`).join();
        return `
<svg x="${tileX}" y="${tileY}" width="${ctSIZE}" height="${ctSIZE}" id="${tag}" onclick="toggleCombatTreeTile('${tag}', ${unlockTags})" data-unlocks="0" class="cursor-pointer">
    <rect id="${tag}_rect" width="${ctSIZE}" height="${ctSIZE}" fill="${x === 0 ? ctFIRST : ctUNAVL}" rx="8" stroke="#1e293b" stroke-width="2"/>
    <foreignObject width="${ctSIZE}" height="${ctSIZE}">
        <div style="width: ${ctSIZE}px; height: ${ctSIZE}px;" class="flex items-center justify-center p-1">
            <p id="${tag}_text" xmlns="http://www.w3.org/1999/xhtml" style="color: ${x === 0 ? "white" : ctFIRST}; font-family: shatterpoint_icons;" class="text-lg text-center m-0">${tile["value"]}</p>
        </div>
    </foreignObject>
</svg>`;
    }
    var nameHash = cyrb53(stance["name"]);
    var baseTag = `tile${hash}_${nameHash}`;
    var unlocks = stance["tree"]
        .map((col, x) => col.map((tile, y) => tile ? tile["unlocks"].map(([childX, childY]) => `<line x1="${x * (ctSIZE + ctPADDING) + ctHALFSIZE}" y1="${y * (ctSIZE + ctPADDING) + ctHALFSIZE}" x2="${childX * (ctSIZE + ctPADDING) + ctHALFSIZE}" y2="${childY * (ctSIZE + ctPADDING) + ctHALFSIZE}" stroke="#475569" stroke-width="3"/>`).join("") : "").join(""))
        .join("");
    var width = stance["tree"].length;
    var height = stance["tree"][0].length;
    var ctWidth = ctSIZE * width + ctPADDING * (width - 1);
    var ctHeight = ctSIZE * height + ctPADDING * (height - 1);

    return `<div class="overflow-x-auto my-2 p-2 bg-slate-950 rounded-lg border border-slate-800 flex justify-center">
    <svg width="${ctWidth}" height="${ctHeight}">
        <rect width="${ctWidth}" height="${ctHeight}" fill="#020617" rx="8"/>
        ${unlocks}
        ${stance["tree"].map((col, x) => col.map((tile, y) => treeTile(x, y, tile, `${baseTag}_${x}-${y}`)).join("")).join("")}
    </svg>
</div>`;
}

function renderStance(stance, hash) {
    return `<div class="bg-slate-900/60 p-3 rounded-lg border border-slate-800 my-2">
    <h4 class="font-bold text-sm text-indigo-300 border-b border-slate-800 pb-1 mb-2">${stance["name"]}</h4>
    ${combatTree(stance, hash)}
    <div class="space-y-2 mt-2">
        ${diceTable(stance, hash)}
        ${stance["ranged"]["attack"] == 0 ? "" : expertiseTable("{n}", stance["ranged"])}
        ${stance["melee"]["attack"] == 0 ? "" : expertiseTable("{o}", stance["melee"])}
        ${expertiseTable("{f}", stance["defence"])}
    </div>
</div>`;
}

function renderStances(unit, isPrimary, hash) {
    return isPrimary ? unit["stances"]["primary"].map((stance) => renderStance(stance, hash)).join("") : renderStance(unit["stances"]["secondary"], hash);
}

function renderUnit(unit, isPrimary, hash) {
    if (UNITS.hasOwnProperty(unit))
        unit = UNITS[unit];
    if (!unit["abilities"].hasOwnProperty("primary")) {
        isPrimary = false;
    }
    if (!hash) {
        var hash = cyrb53(unit["name"]);
        return `<button type="button" class="collapsible w-full text-left py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold rounded-md transition text-xs flex justify-between items-center my-1" onclick="toggleCollapsible(this)">
    <span>${unit["name"]}</span>
</button>
<div class="collapsibleContent max-h-0 overflow-hidden transition-all duration-300 bg-slate-950/40 rounded-b-md p-0" id="unit${hash}">
    <div class="p-3 border border-t-0 border-slate-800 rounded-b-md">
        ${_renderUnit(unit, isPrimary, hash)}
    </div>
</div>`;
    }
    document.getElementById(`unit${hash}`).innerHTML = `<div class="p-3 border border-t-0 border-slate-800 rounded-b-md">${_renderUnit(unit, isPrimary, hash)}</div>`;
}

function renderEnemyCard(card) {
    return addTextIcons(`<div class="bg-slate-950 p-3 rounded-md border border-slate-800 text-xs space-y-2">
    <div class="text-center font-semibold text-slate-300 border-b border-slate-800 pb-1">Condition: ${card["cond"]}</div>
    <div class="grid grid-cols-2 gap-2 pt-1">
        <div class="bg-slate-900/60 p-2 rounded border border-emerald-900/40">
            <div class="text-emerald-400 text-center font-bold mb-1">✔</div>
            <h4 class="font-bold text-slate-200 mb-1">${card["true"]["name"]}</h4>
            <div class="text-slate-400 text-xs leading-relaxed">${card["true"]["desc"]}</div>
        </div>
        <div class="bg-slate-900/60 p-2 rounded border border-rose-900/40">
            <div class="text-rose-400 text-center font-bold mb-1">✘</div>
            <h4 class="font-bold text-slate-200 mb-1">${card["false"]["name"]}</h4>
            <div class="text-slate-400 text-xs leading-relaxed">${card["false"]["desc"]}</div>
        </div>
    </div>
</div>`);
}

function renderEnemyDeck(enemy) {
    return enemy["deck"]["cards"].map((index) => renderEnemyCard(enemy["deck"]["pool"][index])).join("<div class='h-2'></div>");
}

function updateStackUnit(hash, count, stamina, durability, rangedAttack, rangedDefence, meleeAttack, meleeDefence) {
    var newMaxStam = Math.floor(count * stamina / 2);
    var newMaxDur = Math.floor(count * durability / 2);
    var curStam = document.getElementById(`stackStam${hash}`);
    var maxStam = document.getElementById(`stackStamMax${hash}`);
    curStam.value = newMaxStam - (parseInt(maxStam.innerText) - curStam.value);
    maxStam.innerText = newMaxStam;
    var curDur = document.getElementById(`stackDur${hash}`);
    var maxDur = document.getElementById(`stackDurMax${hash}`);
    curDur.value = newMaxDur - (parseInt(maxDur.innerText) - curDur.value);
    maxDur.innerText = newMaxDur;
    if (rangedAttack !== "-") {
        var rangedAttackEl = document.getElementById(`rangedAttack${hash}`);
        rangedAttackEl.innerText = rangedAttack + parseInt(count) - 2;
    }
    if (meleeAttack !== "-") {
        var meleeAttackEl = document.getElementById(`meleeAttack${hash}`);
        meleeAttackEl.innerText = meleeAttack + parseInt(count) - 2;
    }
    if (rangedDefence !== "-") {
        var rangedDefenceEl = document.getElementById(`rangedDefence${hash}`);
        rangedDefenceEl.innerText = rangedDefence + parseInt(count) - 2;
    }
    if (meleeDefence !== "-") {
        var meleeDefenceEl = document.getElementById(`meleeDefence${hash}`);
        meleeDefenceEl.innerText = meleeDefence + parseInt(count) - 2;
    }
}

function _renderEnemy(enemy, withDeck, difficulty, remove, tag) {
    var hash = cyrb53(enemy["name"] + tag ?? "");
    var stats;
    var stackable = enemy["stackable"];
    if (isNaN(difficulty)) {
        stats = `{r} ${enemy["stamina"]["base"]} (+${enemy["stamina"]["scaling"]} per Strike Team) {w} ${enemy["durability"]["base"]} (+${enemy["durability"]["scaling"]} per Strike Team) {j} ${enemy["actions"]["base"]} (+${enemy["actions"]["scaling"]} per Strike Team)`;
    } else {
        var stamina = Math.floor(enemy["stamina"]["base"] + enemy["stamina"]["scaling"] * difficulty);
        var durability = Math.floor(enemy["durability"]["base"] + enemy["durability"]["scaling"] * difficulty);
        if (stackable) {
            stats = `<div class="flex flex-wrap items-center gap-2 text-xs font-mono bg-slate-950 p-2 rounded border border-slate-800">
                <span>{r} <input id="stackStam${hash}" class="w-12 bg-slate-900 border border-slate-700 rounded px-1 text-center" type="number" value="${stamina}"/> / <span id="stackStamMax${hash}">${stamina}</span></span>
                <span>{w} <input id="stackDur${hash}" class="w-12 bg-slate-900 border border-slate-700 rounded px-1 text-center" type="number" value="${durability}"/> / <span id="stackDurMax${hash}">${durability}</span></span>
                <span>{j} ${Math.floor(enemy["actions"]["base"] + enemy["actions"]["scaling"] * difficulty)}</span>
            </div>
            ${gameplayEffects(hash)}
            <div class="mt-2 text-xs">
                {8} <input min="0" class="w-20 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs" type="number" id="stackCount${hash}" placeholder="Count" value="2" onchange="updateStackUnit('${hash}', this.value, ${stamina}, ${durability}, ${enemy["stance"]["ranged"]["attack"]}, ${enemy["stance"]["ranged"]["defence"]}, ${enemy["stance"]["melee"]["attack"]}, ${enemy["stance"]["melee"]["defence"]});"/>
            </div>`
        } else {
            stats = `<div class="flex flex-wrap items-center gap-2 text-xs font-mono bg-slate-950 p-2 rounded border border-slate-800">
                <span>{r} <input class="w-12 bg-slate-900 border border-slate-700 rounded px-1 text-center" type="number" value="${stamina}"/> / ${stamina}</span>
                <span>{w} <input class="w-12 bg-slate-900 border border-slate-700 rounded px-1 text-center" type="number" value="${durability}"/> / ${durability}</span>
                <span>{j} ${Math.floor(enemy["actions"]["base"] + enemy["actions"]["scaling"] * difficulty)}</span>
            </div>
            ${gameplayEffects(hash)}`;
        }
        stats += `<div class="mt-2 text-xs flex items-center gap-2">
            <span class="text-slate-400">Label:</span>
            <input class="flex-1 bg-slate-950 border border-slate-700 rounded px-2 py-1" type="text" value="" placeholder="Label"/>
        </div>`
    }
    return `<button type="button" class="collapsible w-full text-left py-2 px-3 bg-slate-800 hover:bg-slate-700 text-rose-300 font-semibold rounded-md transition text-xs flex justify-between items-center my-1" onclick="toggleCollapsible(this)">
    <span>${enemy["name"]}</span>
</button>
<div class="collapsibleContent max-h-0 overflow-hidden transition-all duration-300 bg-slate-950/40 rounded-b-md p-0">
    <div class="p-3 border border-t-0 border-slate-800 rounded-b-md space-y-2">
        ${remove ? '<button type="button" class="float-right text-xs bg-rose-900/40 hover:bg-rose-900 text-rose-200 px-2 py-0.5 rounded border border-rose-800" onclick="removeEnemyUnit(\'' + remove + '\')">Remove</button>' : ""}
        <div>${addTextIcons(stats)}</div>
        <div class="text-xs text-slate-400 italic">${enemy["tags"].join(" • ")}</div>
        ${renderStance(enemy["stance"], hash)}
        ${withDeck ? '<div class="mt-3"><h4 class="text-xs font-bold text-slate-300 mb-2">' + addTextIcons("{j}") + ' Deck (' + enemy["deck"]["cards"].length + ' cards)</h4>' + renderEnemyDeck(enemy) + '</div>' : ""}
    </div>
</div>`;
}

function renderEnemy(enemy, withDeck, difficulty, remove, tag) {
    if (ENEMIES.hasOwnProperty(enemy))
        enemy = ENEMIES[enemy];
    return _renderEnemy(enemy, withDeck, difficulty, remove, tag);
}

function shuffle(array) {
    for (var i = array.length; i > 0;) {
        var rand = Math.floor(Math.random() * i);
        i--;
        [array[i], array[rand]] = [array[rand], array[i]];
    }
    return array;
}

function addSpecial(text, gameLocation) {
    if (!text.includes("|"))
        return text;
    var chunks = text.split("|");
    var newText = "";
    var specialVar = {
        "randomRooms": [],
    };
    function handleChunk(chunk) {
        function getArgs(command) {
            if (command.includes("`")) {
                var quoteds = command.split("`");
                var args = [];
                for (let i = 0; i < quoteds.length; i++) {
                    var seg = quoteds[i];
                    if (i % 2 == 0) {
                        args.push(...seg.split(" ").slice(0, -1));
                    } else {
                        if (seg.endsWith(";")) {
                            args.push(handleChunk(seg.slice(0, -1)));
                        } else {
                            args.push(seg);
                        }
                    }
                }
                return args;
            }
            return command.split(" ");
        }
        var args = getArgs(chunk);

        switch (args[0]) {
            case "randomRoom":
                if (args.length === 1) {
                    var rooms = Object.keys(gameLocation["rooms"]);
                    var room = rooms[Math.floor(Math.random() * rooms.length)];
                    specialVar["randomRooms"].push(room);
                    return room;
                } else {
                    return specialVar["randomRooms"][parseInt(chunk.split(" ")[1])];
                }
            case "randInt":
                var min = args[1];
                var max = args[2];
                return Math.floor(Math.random() * (max - min)) + min;
            case "set":
                var key = args[1];
                var value = args[2];
                specialVar[key] = value;
                return "";
            case "get":
                var key = args[1];
                var value = specialVar[key];
                if (args.length > 2 && !isNaN(args[2])) {
                    value = value[parseInt(args[2])];
                }
                return value ?? "";
            case "shuffle":
                return shuffle(args.slice(1));
            default:
                return chunk;
        }
    }

    for (let i = 0; i < chunks.length; i++) {
        if (i % 2 == 0) {
            newText += chunks[i];
        } else {
            var chunk = chunks[i];
            newText += handleChunk(chunk);
        }
    }
    return newText;
}

function renderEventCard(card, gameLocation) {
    return addTextIcons(`<div class="bg-slate-950 p-3 rounded-md border border-slate-800 text-xs my-1">
    <h4 class="font-bold text-amber-400 mb-1 border-b border-slate-800 pb-1">${card["name"]}</h4>
    <div class="text-slate-300 leading-relaxed">${addSpecial(card["desc"], gameLocation)}</div>
</div>`);
}

function swapStance(name, number, hash) {
    document.getElementById(`unitCurStance${hash}`).innerHTML = renderStance(UNITS[name]["stances"]["primary"][number], hash);
}

function dropdownUnit(unit, isPrimary, remove, tag) {
    var hash = cyrb53(unit["name"] + tag ?? "");
    var ary = isPrimary ? "primary" : "secondary";
    var stats = addTextIcons(`<div class="flex items-center gap-3 bg-slate-950 p-2 rounded border border-slate-800 text-xs font-mono">
        <span>{r} <input class="w-12 bg-slate-900 border border-slate-700 rounded px-1 text-center" type="number" value="${unit["stamina"][ary]}"/> / ${unit["stamina"][ary]}</span>
        <span>{w} <input class="w-12 bg-slate-900 border border-slate-700 rounded px-1 text-center" type="number" value="${unit["durability"][ary]}"/> / ${unit["durability"][ary]}</span>
    </div>`);
    var stance;
    if (isPrimary) {
        stance = `<div class="mt-2 text-xs">
    <b class="text-slate-300">Active Stance: </b>
    <div class="inline-flex gap-3 my-1">
        <label for="unitFirstStance${hash}" class="cursor-pointer">
            <input type="radio" id="unitFirstStance${hash}" name="unitStance${hash}" checked onclick="swapStance('${unit["name"]}', 0, ${hash});" class="accent-indigo-500">
            <span>${unit["stances"]["primary"][0]["name"]}</span>
        </label>
        <label for="unitSecondStance${hash}" class="cursor-pointer">
            <input type="radio" id="unitSecondStance${hash}" name="unitStance${hash}" onclick="swapStance('${unit["name"]}', 1, ${hash});" class="accent-indigo-500">
            <span>${unit["stances"]["primary"][1]["name"]}</span>
        </label>
    </div>
    <div id="unitCurStance${hash}">${renderStance(unit["stances"]["primary"][0], hash)}</div>
</div>`;
    } else {
        stance = renderStance(unit["stances"]["secondary"], hash);
    }
    return `<button type="button" class="collapsible w-full text-left py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold rounded-md transition text-xs flex justify-between items-center my-1" onclick="toggleCollapsible(this)">
    <span>${unit["name"]}</span>
</button>
<div class="collapsibleContent max-h-0 overflow-hidden transition-all duration-300 bg-slate-950/40 rounded-b-md p-0">
    <div class="p-3 border border-t-0 border-slate-800 rounded-b-md space-y-2">
        ${remove ? '<button type="button" class="float-right text-xs bg-rose-900/40 hover:bg-rose-900 text-rose-200 px-2 py-0.5 rounded border border-rose-800" onclick="removePlayerUnit(\'' + remove + '\')">Remove</button>' : ""}
        ${stats}
        ${gameplayEffects(hash)}
        <div class="text-xs text-slate-400 italic">${unit["tags"].join(" • ")}</div>
        ${renderAbilities(unit, ary)}
        ${stance}
    </div>
</div>`;
}

function toggleCollapsible(element) {
    element.classList.toggle("active");
    var content = element.nextElementSibling;
    if (content.style.maxHeight) {
        content.style.maxHeight = null;
    } else {
        content.style.maxHeight = content.scrollHeight + "px";
        var parent = element.parentElement;
        if (parent.classList.contains("collapsibleContent")) {
            parent.style.maxHeight = content.scrollHeight + parent.scrollHeight + "px";
        }
    }
}

function gameplayEffects(hash) {
    return addTextIcons(`<div class="bg-slate-950 p-2 rounded border border-slate-800 text-xs my-2 space-y-2">
    <div class="flex items-center gap-3">
        <span>Wounds <input class="w-12 bg-slate-900 border border-slate-700 rounded px-1 text-center font-mono" type="number" value="0"/></span>
        <span>Injuries <input class="w-12 bg-slate-900 border border-slate-700 rounded px-1 text-center font-mono" type="number" value="0"/></span>
    </div>
    <div class="flex flex-wrap items-center gap-3 pt-1 border-t border-slate-800/60">
        <label for="strained${hash}" class="flex items-center gap-1 cursor-pointer">
            <span>{5}</span>
            <input type="checkbox" id="strained${hash}" class="accent-indigo-500 rounded">
        </label>
        <label for="pinned${hash}" class="flex items-center gap-1 cursor-pointer">
            <span>{1}</span>
            <input type="checkbox" id="pinned${hash}" class="accent-indigo-500 rounded">
        </label>
        <label for="exposed${hash}" class="flex items-center gap-1 cursor-pointer">
            <span>{4}</span>
            <input type="checkbox" id="exposed${hash}" class="accent-indigo-500 rounded">
        </label>
        <label for="disarmed${hash}" class="flex items-center gap-1 cursor-pointer">
            <span>{9}</span>
            <input type="checkbox" id="disarmed${hash}" class="accent-indigo-500 rounded">
        </label>
        <div class="ml-auto flex items-center gap-1">
            <span>{3}</span>
            <input class="w-10 bg-slate-900 border border-slate-700 rounded px-1 text-center font-mono" type="number" value="0"/>
        </div>
    </div>
</div>`);
}

function getOrderCard(unit, isPrimary) {
    var ary = isPrimary ? "primary" : "secondary";
    var pool = unit["abilities"]["pool"];
    return ((unit["abilities"][ary].map((idx) => pool[idx]["type"] === "{k}").includes(true)) ? addTextIcons("{k}") : "") + unit["name"];
}

function renderLocationAbilities(rooms) {
    return addTextIcons(Object.entries(rooms).map(([room, data]) => data["abilities"] ? (`
        <button type="button" class="collapsible w-full text-left py-1.5 px-2.5 bg-slate-800/80 hover:bg-slate-700 text-indigo-300 font-semibold rounded transition text-xs flex justify-between items-center my-1" onclick="toggleCollapsible(this)">
            <span>${room}</span>
        </button>
        <div class="collapsibleContent max-h-0 overflow-hidden transition-all duration-300 bg-slate-950/40 rounded-b-md p-0">
            <div class="p-2 border border-t-0 border-slate-800 text-xs space-y-1">
                ` + data["abilities"].map((abil) => `<div class="bg-slate-950 p-2 rounded border border-slate-800">${abil["type"]} <b>${abil["name"]}</b> <span class="text-amber-400">${abil["cost"]}</span><br><span class="text-slate-400">${abil["desc"]}</span></div>`).join("") + `
            </div>
        </div>
    `) : "").join(""));
}

function renderMission(mission) {
    var specialAbilities = Object.keys(mission["bonus"]).length > 0 ? `<div class="mt-2"><b class="text-indigo-300">Special Abilities:</b><br>${renderLocationAbilities(mission["bonus"])}</div>` : "";
    var tokenRules = mission["tokens"] ? `<div class="mt-2"><b class="text-indigo-300">Mission Token Rules:</b><br><span class="text-slate-300">${addTextIcons(mission["tokens"])}</span></div>` : "";
    var setup = mission["setup"] ? `<div class="mt-1"><b class="text-indigo-300">Setup:</b><br><span class="text-slate-300">${addTextIcons(mission["setup"])}</span></div>` : "";
    return addSpecial(`<button type="button" class="collapsible w-full text-left py-2 px-3 bg-slate-800 hover:bg-slate-700 text-indigo-300 font-semibold rounded-md transition text-xs flex justify-between items-center my-1" onclick="toggleCollapsible(this)">
    <span>${mission["name"]}</span>
</button>
<div class="collapsibleContent max-h-0 overflow-hidden transition-all duration-300 bg-slate-950/40 rounded-b-md p-0">
    <div class="p-3 border border-t-0 border-slate-800 text-xs leading-relaxed space-y-1">
        ${setup}
        ${tokenRules}
        ${specialAbilities}
        <div class="mt-2"><b class="text-indigo-300">Goal:</b><br><span class="text-slate-300">${addTextIcons(mission["goal"])}</span></div>
    </div>
</div>`);
}

function generateSetup(gameLocation) {
    var configs = gameLocation["configs"];
    var setup = configs[Math.floor(Math.random() * configs.length)];
    return `<div class="bg-slate-950 p-3 rounded-md border border-slate-800 my-2 text-xs">
        <h3 class="font-bold text-slate-200 border-b border-slate-800 pb-1 mb-2">Game Setup</h3>
        <p class="text-slate-300">Start deploying player Units in <span class="text-amber-400 font-semibold">${setup["start"]}</span>.</p>
        <p class="text-slate-300 mt-1">Start deploying enemy Units in <span class="text-rose-400 font-semibold">${setup["enemy"]}</span>.</p>
    </div>`;
}