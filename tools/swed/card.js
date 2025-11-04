/*


*/

const COLOURS = {
    "attacking": "#ae2125",
    "defending": "#3e729a",
    "anytime": "#676767",
    "attack": "#420b0e",
    "defence": "#22324b"
}

const HEX_REGEX = /^[0-9a-fA-F]+$/;

function getColour(colour) {
    if (!colour) 
        return COLOURS["anytime"];
    if (!colour.startsWith('#')) {
        if (HEX_REGEX.text(colour))
            return `#${colour}`;
        else
            return COLOURS[colour];
    }
    return colour;
}

function semiCircle(x, y, diameter, flatSide, fill, stroke) {
    var aLast3;
    switch (flatSide) {
        case "top":
            aLast3 = `0 ${diameter} 0`;
            break;
        case "bottom":
            aLast3 = `1 ${diameter} 0`;
            break;
        case "left":
            aLast3 = `1 0 ${diameter}`;
            break;
        case "right":
            aLast3 = `0 0 ${diameter}`;
            x += diameter;
            break;
        default:
            aLast3 = `0 ${diameter} ${diameter}`;
            break;
    }
    return `<path
    fill="${getColour(fill)}" stroke="${getColour(stroke)}" stroke-width="${stroke ? 3 : 0}"
    d="M ${x} ${y} a 1 1 0 0 ${aLast3} Z" />`
}

function playWhenElem(x, y, size, value, name) {
    var text;
    var colour1, colour2;
    switch (value) {
        case "Attacking":
            text = `Play when ${name} is attacking.`;
            colour1 = COLOURS["attacking"];
            colour2 = COLOURS["attacking"];
            break;
        case "Defending":
            text = `Play when ${name} is defending.`;
            colour1 = COLOURS["defending"];
            colour2 = COLOURS["defending"];
            break;
        case "Attacking or Defending":
            text = `Play when ${name} is attacking or defending.`;
            colour1 = COLOURS["attacking"];
            colour2 = COLOURS["defending"];
            break;
        case "Anytime":
            text = "Play anytime.";
            colour1 = COLOURS["anytime"];
            colour2 = COLOURS["anytime"];
            break;
        default:
            text = "Play anytime on your turn.";
            colour1 = COLOURS["anytime"];
            colour2 = COLOURS["anytime"];
            break;
    }
    var diameter = size * 1.2;
    return `${semiCircle(x, y, diameter, "right", colour1)}
    ${semiCircle(x + diameter * 0.6, y, diameter, "right", colour2)}
    <text x="${x + diameter * 2}" y="${y + size}" fill="black" font-size="${size}">${text}</text>`
}

function generateSpecCardSvg(data, charInfo) {
    // <text x="100" y="30" fill="white" font-size="24">${data[2]}</text>
    // <text x="100" y="30" fill="white" font-size="24">${data[3]}</text>

    var img = data[6] ? data[6] : charInfo[5];

    var firstBubble = "";
    var secondBubble = "";
    if (data[2] && data[3]) {
        firstBubble = `<circle cx="55" cy="70" r="35"/>;
        ${semiCircle(25, 70, 60, "top", COLOURS["attack"], COLOURS["attacking"])}
        <text x="55" y="60" fill="white" font-size="16" dominant-baseline="middle" text-anchor="middle">Attack</text>
        <text x="55" y="87" fill="white" font-size="26" dominant-baseline="middle" text-anchor="middle">${data[2]}</text>
        `;
        secondBubble = `<circle cx="55" cy="150" r="35"/>;
        ${semiCircle(25, 150, 60, "bottom", COLOURS["defence"], COLOURS["defending"])}
        <text x="55" y="162" fill="white" font-size="16" dominant-baseline="middle" text-anchor="middle">Defend</text>
        <text x="55" y="138" fill="white" font-size="26" dominant-baseline="middle" text-anchor="middle">${data[3]}</text>
        `;
    } else if (data[2]) {
        firstBubble = `<circle cx="55" cy="70" r="35"/>;
        ${semiCircle(25, 70, 60, "top", COLOURS["attack"], COLOURS["attacking"])}
        <text x="55" y="60" fill="white" font-size="16" dominant-baseline="middle" text-anchor="middle">Attack</text>
        <text x="55" y="87" fill="white" font-size="26" dominant-baseline="middle" text-anchor="middle">${data[2]}</text>
        `;
    } else if (data[3]) {
        firstBubble = `<circle cx="55" cy="70" r="35"/>;
        ${semiCircle(25, 70, 60, "bottom", COLOURS["defence"], COLOURS["defending"])}
        <text x="55" y="82" fill="white" font-size="16" dominant-baseline="middle" text-anchor="middle">Defend</text>
        <text x="55" y="58" fill="white" font-size="26" dominant-baseline="middle" text-anchor="middle">${data[3]}</text>
        `;
    }

    return `<svg width="310" height="431">
    <svg x="95" y="0" width="215" height="215">
        <image href="${img}" x="0" y="0" width="100%" height="100%" preserveAspectRatio="xMidYMid slice"/>
    </svg>
    <rect x="0" y="245" width="310" height="37" fill="black"/>
    <path d="M 0 0 V 311 l 66 -66 H 310 v -103 l -66 61 H 95 V 68 L 161 0 Z" fill="${charInfo[3]}"/>
    <foreignObject x="20" y="180" width="280" height="100">
        <p xmlns="http://www.w3.org/1999/xhtml" style="color: white; font-size: 30px; width: 280px; word-wrap: break-word; text-align: right;">${data[1]}</p>
    </foreignObject>
    <text x="66" y="272" fill="white" font-size="24">${data[0]}</text>
    ${playWhenElem(30, 285, 12, data[4], data[1])}
    <foreignObject x="20" y="295" width="280" height="100">
        <p xmlns="http://www.w3.org/1999/xhtml" style="width: 280px; word-wrap: break-word;">${data[5]}</p>
    </foreignObject>
    ${firstBubble}
    ${secondBubble}
</svg>`
}

function generateBasicCardSvg(stats, charInfo) {
    var stats = stats.split('/');
    return `<svg width="310" height="431">
    <svg x="0" y="0" width="310" height="431" >
        <image href="${charInfo[4]}" x="0" y="0" width="100%" height="100%" preserveAspectRatio="xMidYMid slice"/>
    </svg>
    <path d="M 0 0 H 111 V 137 L 0 250 Z" fill="${charInfo[3]}"/>
    <path d="M 0 28 H 94 V 132 L 0 226 Z" fill="black"/>
    ${semiCircle(25, 50, 60, "top", COLOURS["attack"], COLOURS["attacking"])}
    <text x="55" y="40" fill="white" font-size="16" dominant-baseline="middle" text-anchor="middle">Attack</text>
    <text x="55" y="67" fill="white" font-size="26" dominant-baseline="middle" text-anchor="middle">${stats[0]}</text>
    ${semiCircle(25, 120, 60, "bottom", COLOURS["defence"], COLOURS["defending"])}
    <text x="55" y="132" fill="white" font-size="16" dominant-baseline="middle" text-anchor="middle">Defend</text>
    <text x="55" y="108" fill="white" font-size="26" dominant-baseline="middle" text-anchor="middle">${stats[1]}</text>
</svg>`;
}

function trimAndSplit(string, delim) {
    string = string.trim();
    if (string.endsWith(delim)) {
    string = string.slice(0, -1);
    }
    return string.split(delim)
}

/*
<!DOCTYPE html>
<html>
<body>

<svg width="310" height="431" xmlns="http://www.w3.org/2000/svg">
  <svg x="95" y="0" width="215" height="215" >
    <image href="https://www.starwarsnewsnet.com/wp-content/uploads/2025/01/Zam-Wesell.jpg" x="0" y="0" width="100%" height="100%" preserveAspectRatio="xMidYMid slice"/>
  </svg>
  <rect x="0" y="245" width="310" height="37" fill="black"/>
  <path d="M 0 0 V 311 l 66 -66 H 310 v -103 l -66 61 H 95 V 68 L 161 0 Z" fill="green"/>
  <foreignObject x="20" y="180" width="280" height="100">
    <p xmlns="http://www.w3.org/1999/xhtml" style="color: white;font-size: 30px; width: 280px; word-wrap: break-word; text-align: right;">
      Zam Wesell
    </p>
  </foreignObject>
  <text x="66" y="272" fill="white" font-size="30">Sniper Shot</text>
  <path d="M 50 285 a 1 1 0 0 0 0 20 Z" fill="red" stroke="blue" stroke-width="0"/>
  <path d="M 62 285 a 1 1 0 0 0 0 20 Z" fill="red" stroke="blue" stroke-width="0"/>
  <text x="70" y="300" fill="black" font-size="16">Play when Zam Wesell is attacking</text>
  <foreignObject x="20" y="295" width="270" height="100">
    <p xmlns="http://www.w3.org/1999/xhtml" style="width: 270px; word-wrap: break-word;">
      Turn any character adjacent to Yoda on its side. This character cannot move, attack, or defend until any player discards 3 cards to stand it back up.
    </p>
  </foreignObject>
</svg>
 
</body>
</html>

https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/viewBox#examples
https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/preserveAspectRatio

*/