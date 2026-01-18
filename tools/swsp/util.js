// SRC: https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
const cyrb53 = (str, seed = 0) => {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for(let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1  = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
    h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2  = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
    h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  
    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

function addTextIcons(text) {
    return text.replaceAll("{", `<span style="font-family: shatterpoint_icons">`).replaceAll("}", "</span>");
}

function lazySwap(activate, list) {
    list.forEach(function(value) {
        document.getElementById(value).style.display = "none";
    });
    document.getElementById(activate).style.display = "block";
}


var UNITS = {}
function withUnits(callback) {
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
}

var LOCATIONS = {};
function withLocations(callback) {
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
}

var ENEMIES = {};
function withEnemies(callback) {
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
}

function renderBasics(unit, isPrimary, ary, hash) {
    var switcher = unit["abilities"].hasOwnProperty("primary") ? `<input type="radio" id="unitPrimary${hash}" name="unitAry${hash}" ${isPrimary ? "checked" : ""} onclick="renderUnit('${unit["name"]}', true, ${hash});">
        <label for="unitPrimary${hash}">Primary</label>
        <input type="radio" id="unitSecondary${hash}" name="unitAry${hash}" ${isPrimary ? "" : "checked"} onclick="renderUnit('${unit["name"]}', false, ${hash});">
        <label for="unitSecondary${hash}">Secondary/Supporting</label>
        <br>` : "";
    return addTextIcons(`${switcher}
        {v} ${unit["force"]} {r} ${unit["stamina"][ary]} {w} ${unit["durability"][ary]}
        <br>
        <i>${unit["tags"].join("</i>•<i>")}</i>`);
}

function renderAbilities(unit, ary) {
    var abilities = unit["abilities"];
    return addTextIcons(abilities[ary].map((idx) => abilities["pool"][idx]).map((abil) => `${abil["type"]} <b>${abil["name"]}</b> ${abil["cost"]}<br>${abil["desc"]}`).join("<br>"));
}

function _renderUnit(unit, isPrimary, hash) {
    var ary = isPrimary ? "primary" : "secondary";
    return `${renderBasics(unit, isPrimary, ary, hash)}
    <br>
    ${renderAbilities(unit, ary)}
    ${renderStances(unit, isPrimary, hash)}`;
}

function expertiseTable(type, data) {
    return addTextIcons(`<table class="lineTable">
    <tr>
        <th>${type}</th>
        <th style="max-width: 150">${data["name"]}</th>
    </tr>
    ${Object.entries(data["breakpoints"]).map(([expertise, effect]) => `<tr><td>${expertise}</td><td>${effect}</td></tr>`).join("")}
</table>`);
}

function diceTable(stance, hash) {
    return addTextIcons(`<table class="lineTable">
    <tr>
        <th>Dice Pool</th>
        <th>{n}<br>{g} ${stance["ranged"]["range"]}</th>
        <th>{o}</th>
    </tr>
    <tr>
        <td>Attack</td>
        <td id="rangedAttack${hash}">${stance["ranged"]["attack"] == 0 ? "--" : stance["ranged"]["attack"]}</td>
        <td id="meleeAttack${hash}">${stance["melee"]["attack"] == 0 ? "--" : stance["melee"]["attack"]}</td>
    </tr>
    <tr>
        <td>Defence</td>
        <td id="rangedDefence${hash}">${stance["ranged"]["defence"]}</td>
        <td id="meleeDefence${hash}">${stance["melee"]["defence"]}</td>
    </tr>
</table>`);
}

const ctFIRST = "#df802a";
const ctAVL = "#ffffff";
const ctUNAVL = "#494949";
const ctSELECTED = "darkgreen";
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

            var childX = child.split("-")[0].split("_").at(-1);
            // TODO: see if we can break loops on vertically linked tiles. The problem is we check 
            // unlocks in the parent to see if the child needs to be clicked, and the parent doesn't
            // know that the child is in a vertical loop.
            unlocks -= 1;
            // if (childX === tileX)
            //     unlocks -= 1;

            childElem.setAttribute("data-unlocks", unlocks);
            if (unlocks === 0) {
                if (childRect.getAttribute("stroke") === ctSELECTED) {
                    childElem.onclick.apply(childElem);
                }
                childRect.setAttribute("fill", ctUNAVL);
            }
        }
        tileRect.setAttribute("stroke", "black");
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
<svg x="${tileX}" y="${tileY}" width="${ctSIZE}" height="${ctSIZE}" id="${tag}"  onclick="toggleCombatTreeTile('${tag}', ${unlockTags})" data-unlocks="0">
    <rect id="${tag}_rect" width="${ctSIZE}" height="${ctSIZE}" fill="${x === 0 ? ctFIRST : ctUNAVL}" rx="10" stroke="black" stroke-width="2"/>
    <foreignObject width="${ctSIZE}" height="${ctSIZE}">
        <div style="width: ${ctSIZE}; height: ${ctSIZE}; display: flex; flex-wrap: wrap; align-content: center; justify-content: center">
            <p id="${tag}_text" xmlns="http://www.w3.org/1999/xhtml" style="color: ${x === 0 ? "white" : ctFIRST}; font-size: 24px; word-wrap: break-word; text-align: center; font-family: shatterpoint_icons;margin: 8">${tile["value"]}</p>
        </div>
    </foreignObject>
</svg>`;
    }
    var nameHash = cyrb53(stance["name"]);
    var baseTag = `tile${hash}_${nameHash}`;
    var unlocks = stance["tree"]
        .map((col, x) => col.map((tile, y) => tile ? tile["unlocks"].map(([childX, childY]) => `<line x1="${x * (ctSIZE + ctPADDING) + ctHALFSIZE}" y1="${y * (ctSIZE + ctPADDING) + ctHALFSIZE}" x2="${childX * (ctSIZE + ctPADDING) + ctHALFSIZE}" y2="${childY * (ctSIZE + ctPADDING) + ctHALFSIZE}" stroke="white" stroke-width="4"/>`).join("") : "").join(""))
        .join("");
    var width = stance["tree"].length;
    var height = stance["tree"][0].length;
    var ctWidth = ctSIZE * width + ctPADDING * (width - 1);
    var ctHeight = ctSIZE * height + ctPADDING * (height - 1);

    return `<svg width="${ctWidth}" height="${ctHeight}" style="margin: 8">
    <rect width="${ctWidth}" height="${ctHeight}" fill="#050707" rx="10"/>
    ${unlocks}
    ${stance["tree"].map((col, x) => col.map((tile, y) => treeTile(x, y, tile, `${baseTag}_${x}-${y}`)).join("")).join("")}
</svg>`;
}

function renderStance(stance, hash) {
    return `<div style="border: 1px solid black;">
    <h4 style="margin-block: .33em; margin-inline: .33em">${stance["name"]}</h4>
    ${combatTree(stance, hash)}
    <br>
    <div class="tableGroup">
        ${diceTable(stance, hash)}
        ${stance["ranged"]["attack"] == 0 ? "" : expertiseTable("{n}", stance["ranged"])}
        ${stance["melee"]["attack"] == 0 ? "" : expertiseTable("{o}", stance["melee"])}
        ${expertiseTable("{f}", stance["defence"])}
    </div>
</div>`;
}

function renderStances(unit, isPrimary, hash) {
    return isPrimary ? unit["stances"]["primary"].map((stance) => renderStance(stance, hash)).join("<br>") : renderStance(unit["stances"]["secondary"], hash);
}

function renderUnit(unit, isPrimary, hash) {
    if (UNITS.hasOwnProperty(unit))
        unit = UNITS[unit];
    if (!unit["abilities"].hasOwnProperty("primary")) {
        isPrimary = false;
    }
    if (!hash) {
        var hash = cyrb53(unit["name"]);
        return `<button type="button" class="collapsible" onclick="toggleCollapsible(this)">${unit["name"]}</button>
<div class="collapsibleContent" id="unit${hash}">
    ${_renderUnit(unit, isPrimary, hash)}
</div>`;
    }
    document.getElementById(`unit${hash}`).innerHTML = _renderUnit(unit, isPrimary, hash);
}

function renderEnemyCard(card) {
    return addTextIcons(`<table class="lineTable">
    <tr>
        <td colspan="2" style="text-align:center">Condition: ${card["cond"]}</td>
    </tr>
    <tr style="vertical-align: top">
        <td style="max-width: 250; width: 250"><div style="text-align: center">✔</div><h4 style="margin-block: .33em">${card["true"]["name"]}</h4>${card["true"]["desc"]}</td>
        <td style="max-width: 250; width: 250"><div style="text-align: center">✘</div><h4 style="margin-block: .33em">${card["false"]["name"]}</h4>${card["false"]["desc"]}</td>
    </tr>
</table>`);
}

function renderEnemyDeck(enemy) {
    return enemy["deck"]["cards"].map((index) => renderEnemyCard(enemy["deck"]["pool"][index])).join("<br>");
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
            stats = `{r} <input id="stackStam${hash}" style="width: 50" type="number" value="${stamina}"/> / <span id="stackStamMax${hash}">${stamina}</span>
&nbsp;{w} <input id="stackDur${hash}" style="width: 50" type="number" value="${durability}"/> / <span id="stackDurMax${hash}">${durability}</span>
&nbsp;{j} ${Math.floor(enemy["actions"]["base"] + enemy["actions"]["scaling"] * difficulty)}
<br>${gameplayEffects(hash)}
<br>{8} <input min="0" style="width: 50" type="number" id="stackCount${hash}" placeholder="Character Count" value="2" onchange="updateStackUnit('${hash}', this.value, ${stamina}, ${durability}, ${enemy["stance"]["ranged"]["attack"]}, ${enemy["stance"]["ranged"]["defence"]}, ${enemy["stance"]["melee"]["attack"]}, ${enemy["stance"]["melee"]["defence"]});"/>`
        } else {
            stats = `{r} <input style="width: 50" type="number" value="${stamina}"/> / ${stamina} {w} <input style="width: 50" type="number" value="${durability}"/> / ${durability} {j} ${Math.floor(enemy["actions"]["base"] + enemy["actions"]["scaling"] * difficulty)}<br>${gameplayEffects(hash)}`;
        }
        stats += `<br>
    Label: 
    <input style="width: 50" type="text" value="" placeholder="Label"/>`
    }
    return `<button type="button" class="collapsible" onclick="toggleCollapsible(this)">${enemy["name"]}</button>
<div class="collapsibleContent">
    ${remove ? '<button type="button" style="float: right" onclick="removeEnemyUnit(\'' + remove + '\')">Remove</button>' : ""}
    ${addTextIcons(stats)}
    <br>
    <i>${enemy["tags"].join("</i>•<i>")}</i>
    <br>
    ${renderStance(enemy["stance"], hash)}
    ${withDeck ? '<br><h4 style="margin-block: .33em">' + addTextIcons("{j}") + ' Deck (' + enemy["deck"]["cards"].length + ' cards)</h4>' + renderEnemyDeck(enemy) : ""}
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
                        // non-quoted segment
                        // if (seg.includes(";")) {
                            // consider supporting multiple statements in one ||. This can be workedaround for now by chaining |a||b|
                        // }
                        args.push(...seg.split(" ").slice(0, -1));
                    } else {
                        // command0 arg0 `command1 arg1;`
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
            // case "randSpread":
            //     var total = args[1];
            //     var groups = args[2];
            //     var min = args[3] ?? 0;
            //     var max = args[4] ?? 1;
            //     return ;
            default:
                return chunk;
        }
    }

    for (let i = 0; i < chunks.length; i++) {
        // NOTE: we do not support nested || e.g. |command0 |command1 arg0||
        if (i % 2 == 0) {
            newText += chunks[i];
        } else {
            var chunk = chunks[i];
            newText += handleChunk(chunk);
        }
        // if (i % 2 == 0 || !ICONS.hasOwnProperty(chunks[i]))
        //     newText += chunks[i] + " ";
        // else
        //     newText += `<img height="${height}" style="vertical-align: middle" src="${ICONS[chunks[i]]}">`
    }
    return newText;
}

function renderEventCard(card, gameLocation) {
    return addTextIcons(`<div style="border: 1px solid black">
    <h4 style="margin-block: .33em; margin-inline: 0em">${card["name"]}</h4>
    ${addSpecial(card["desc"], gameLocation)}
</div>`);
}

function swapStance(name, number, hash) {
    document.getElementById(`unitCurStance${hash}`).innerHTML = renderStance(UNITS[name]["stances"]["primary"][number], hash);
}

function dropdownUnit(unit, isPrimary, remove, tag) {
    var hash = cyrb53(unit["name"] + tag ?? "");
    var ary = isPrimary ? "primary" : "secondary";
    var stats = addTextIcons(`{r} <input style="width: 50" type="number" value="${unit["stamina"][ary]}"/> / ${unit["stamina"][ary]} {w} <input style="width: 50" type="number" value="${unit["durability"][ary]}"/> / ${unit["durability"][ary]}`);
    var stance;
    if (isPrimary) {
        stance = `<br>
    <b>Active Stance: </b>
    <input type="radio" id="unitFirstStance${hash}" name="unitStance${hash}" checked onclick="swapStance('${unit["name"]}', 0, ${hash});">
    <label for="unitFirstStance${hash}">${unit["stances"]["primary"][0]["name"]}</label>
    <input type="radio" id="unitSecondStance${hash}" name="unitStance${hash}" onclick="swapStance('${unit["name"]}', 1, ${hash});">
    <label for="unitSecondStance${hash}">${unit["stances"]["primary"][1]["name"]}</label>
    <div id="unitCurStance${hash}">${renderStance(unit["stances"]["primary"][0], hash)}</div>`;
    } else {
        stance = renderStance(unit["stances"]["secondary"], hash);
    }
    return `<button type="button" class="collapsible" onclick="toggleCollapsible(this)">${unit["name"]}</button>
<div class="collapsibleContent">
    ${remove ? '<button type="button" style="float: right" onclick="removePlayerUnit(\'' + remove + '\')">Remove</button>' : ""}
    ${stats}
    <br>
    ${gameplayEffects(hash)}
    <br>
    <i>${unit["tags"].join("</i>•<i>")}</i>
    <br>
    ${renderAbilities(unit, ary)}
    ${stance}
</div>`;
// ${renderUnit(unit, isPrimary)}
}

function toggleCollapsible(element) {
    element.classList.toggle("active");
    var content = element.nextElementSibling;
    // if (content.classList.contains("collapsibleHidden")) {
    //     if (content.style.display === "none")
    //         content.style.display = "block";
    //     else 
    //         content.style.display = "none";
    //     return;
    // }
    if (content.style.maxHeight){
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
    return addTextIcons(`Wounds <input style="width: 50" type="number" value="0"/> Injuries <input style="width: 50" type="number" value="0"/><br>
<label for="strained${hash}">{5}</label>
<input type="checkbox" id="strained${hash}">
<label for="pinned${hash}">{1}</label>
<input type="checkbox" id="pinned${hash}">
<label for="exposed${hash}">{4}</label>
<input type="checkbox" id="exposed${hash}">
<label for="disarmed${hash}">{9}</label>
<input type="checkbox" id="disarmed${hash}">
{3} <input style="width: 50" type="number" value="0"/>
`);
}

function getOrderCard(unit, isPrimary) {
    var ary = isPrimary ? "primary" : "secondary";
    var pool = unit["abilities"]["pool"];
    return ((unit["abilities"][ary].map((idx) => pool[idx]["type"] === "{k}").includes(true)) ? addTextIcons("{k}") : "") +  unit["name"];
}

function renderLocationAbilities(rooms) {
    return addTextIcons(Object.entries(rooms).map(([room, data]) => data["abilities"] ? (`<button type="button" class="collapsible" onclick="toggleCollapsible(this)">${room}</button><div class="collapsibleContent">` + data["abilities"].map((abil) => `${abil["type"]} <b>${abil["name"]}</b> ${abil["cost"]}<br>${abil["desc"]}`).join("<br>") + "</div>") : "").join(""));
}

function renderMission(mission) {
    var specialAbilities = Object.keys(mission["bonus"]).length > 0 ? `<b>Special Abilities:</b><br>${renderLocationAbilities(mission["bonus"])}` : "";
    var tokenRules = mission["tokens"] ? `<b>Mission Token Rules:</b><br>${addTextIcons(mission["tokens"])}<br>` : "";
    var setup = mission["setup"] ? `<b>Setup:</b><br>${addTextIcons(mission["setup"])}<br>` : "";
    return addSpecial(`<button type="button" class="collapsible" onclick="toggleCollapsible(this)">${mission["name"]}</button>
<div class="collapsibleContent">
    ${setup}
    ${tokenRules}
    ${specialAbilities}
    <b>Goal:</b><br>${addTextIcons(mission["goal"])}<br>
</div>`);
}

function generateSetup(gameLocation) {
    var configs = gameLocation["configs"];
    var setup = configs[Math.floor(Math.random() * configs.length)];
    return `<h3 style="margin-block: .33em;">Game Setup</h3>Start deploying player Units in ${setup["start"]}.<br>Start deploying enemy Units in ${setup["enemy"]}.`;
}