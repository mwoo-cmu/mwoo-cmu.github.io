function resizeImg(img, x, y, width, height) {
    return `<svg x="${x}" y="${y}" width="${width}" height="${height}">
    <image href="${img}" x="0" y="0" width="100%" height="100%" preserveAspectRatio="xMidYMid slice"/>
</svg>`;
}

function icon(img) {
    // x 51, y 51, w 152, h 152
    return `<svg x="51" y="51" width="152" height="152">
    <pattern id="icon" x="0" y="0" height="1" width="1">
      <image x="-3" y="-3" width="152" height="152" xlink:href="${img}" preserveAspectRatio="xMidYMid slice"></image>
    </pattern>
    </defs>
    <circle cx="76" cy="76" r="73" fill="url(#icon)" stroke="white" stroke-width="6"/>
  </svg>`
}

function cardArt(img) {
    return `<svg x="76" y="167" width="635" height="522">
        <pattern id="cardArt" x="0" y="0" height="1" width="1">
            <image x="0" y="0" width="100%" height="100%" xlink:href="${img}" preserveAspectRatio="xMidYMid slice"></image>
        </pattern>
        </defs>
    </svg>
    <path fill="url(#cardArt)" d="M 80 171 H 697 V 252 L 709 267 V 687 H 95 V 501 L 78 485 Z"/>
    <line x1="76" y1="169" x2="698" y2="169" stroke="black" stroke-width="4"/>
    <line x1="698" y1="167" x2="698" y2="252" stroke="black" stroke-width="4"/>
    <line x1="698" y1="250" x2="709" y2="267" stroke="black" stroke-width="4"/>
    <line x1="709" y1="265" x2="709" y2="689" stroke="black" stroke-width="4"/>
    <line x1="78" y1="167" x2="78" y2="487" stroke="black" stroke-width="4"/>
    <line x1="78" y1="485" x2="95" y2="503" stroke="black" stroke-width="4"/>
    <line x1="95" y1="501" x2="95" y2="689" stroke="black" stroke-width="4"/>
    <line x1="97" y1="687" x2="711" y2="687" stroke="black" stroke-width="4"/>
`;
}

function namePlate(text, colour, accent) {
    var nameColour = parseInt(colour.substring(1), 16) < 0x7f7f7f ? "white" : "black";
    return `
    <path d="M 174 74 H 667 L 730 135 V 154 H 174 Z" fill="${colour}" stroke="black" stroke-width="4"/>
    <rect x="174" y="154" width="556" height="17" fill="${accent}" stroke="black" stroke-width="4"/>
    <foreignObject x="201" y="76" width="466" height="76">
        <div width="466" height="76">
            <p xmlns="http://www.w3.org/1999/xhtml" style="color: ${nameColour}; font-size: 60px; word-wrap: break-word; text-align: center; font-family: ParkinsonAmboy;margin: 8">${text}</p>
        </div>
    </foreignObject>
`
}

function shapes(colours) {
    return `<path d="M 695 170 H 720 V 392 L 710 402 V 267 L 695 252 Z" fill="${colours["right"]}"/>
<line x1="721" y1="169" x2="721" y2="393" stroke="black" stroke-width="4"/>
<line x1="721" y1="392" x2="710" y2="401" stroke="black" stroke-width="4"/>
<path d="M 77 304 L 62 319 V 678 L 93 709 V 500 Z" fill="${colours["left"]}"/>
<line x1="80" y1="300" x2="61" y2="319" stroke="black" stroke-width="4"/>
<line x1="61" y1="318" x2="61" y2="679" stroke="black" stroke-width="4"/>
<line x1="61" y1="678" x2="95" y2="713" stroke="black" stroke-width="4"/>
<line x1="95" y1="713" x2="95" y2="600" stroke="black" stroke-width="4"/>
<path d="M 68 688 V 728 L 149 809 H 189 Z" fill="${colours["botLeft"]}"/>
<line x1="67" y1="685" x2="67" y2="729" stroke="black" stroke-width="4"/>
<line x1="67" y1="728" x2="148" y2="810" stroke="black" stroke-width="4"/>
<line x1="147" y1="810" x2="191" y2="810" stroke="black" stroke-width="4"/>
<line x1="67" y1="685" x2="189" y2="809" stroke="black" stroke-width="4"/>
<path d="M 98 688 V 725 L 189 816 H 371 L 444 743 H 493 V 688 Z" fill="${colours["botMid"]}"/>
<line x1="97" y1="686" x2="97" y2="726" stroke="black" stroke-width="4"/>
<line x1="97" y1="724" x2="190" y2="817" stroke="black" stroke-width="4"/>
<line x1="189" y1="817" x2="372" y2="817" stroke="black" stroke-width="4"/>
<line x1="371" y1="817" x2="445" y2="744" stroke="black" stroke-width="4"/>
<path d="M 114 688 V 696 L 165 747 H 279 L 296 730 H 555 L 596 688 Z" fill="${colours["botFront"]}"/>
<line x1="113" y1="687" x2="113" y2="697" stroke="black" stroke-width="4"/>
<line x1="113" y1="696" x2="166" y2="748" stroke="black" stroke-width="4"/>
<line x1="165" y1="748" x2="280" y2="748" stroke="black" stroke-width="4"/>
<line x1="278" y1="749" x2="296" y2="730" stroke="black" stroke-width="4"/>
<line x1="294" y1="731" x2="494" y2="731" stroke="black" stroke-width="4"/>
<path d="M 591 688 L 553 726 H 498 L 488 738 L 493 743 H 640 V 688 Z" fill="${colours["botRight"]}"/>
<line x1="641" y1="685" x2="641" y2="746" stroke="black" stroke-width="4"/>
<line x1="591" y1="687" x2="553" y2="725" stroke="black" stroke-width="4"/>
<line x1="554" y1="725" x2="497" y2="725" stroke="black" stroke-width="4"/>
<line x1="498" y1="725" x2="487" y2="738" stroke="black" stroke-width="4"/>
<line x1="492" y1="744" x2="487" y2="736" stroke="black" stroke-width="4"/>
<line x1="443" y1="744" x2="643" y2="744" stroke="black" stroke-width="4"/>
`;
}

const ICONS = {
    "A": "resources/IMAGES/Attack_Icon.png",
    "M": "resources/IMAGES/Move_Icon.png",
    "H": "resources/IMAGES/Heroic_Icon.png",
    "W": "resources/IMAGES/Wild_Icon.png",
    "C": "resources/IMAGES/Civilian_Icon.png",
    "T": "resources/IMAGES/Thug_Icon.png"
};

function effectPane(effects) {
    // TODO: support more than 2?
    // for (let i = 0; i < effects.length; i++) {
    // }
    // y = 833 + 177/2 + 160/2 = 841
    var effectIcons = "";
    if (effects.length == 1) {
        // x = 394 - 80 = 314
        effectIcons = `<image href="${ICONS[effects[0]]}" x="314" y="841" width="160" height="160"/>`;
    } else if (effects.length == 2) {
        // let's say 30 px padding?
        // x1 = 394 - 15 - 160 = 219
        // x2 = 394 + 15 = 419
        effectIcons = `<image href="${ICONS[effects[0]]}" x="219" y="841" width="160" height="160"/>
<image href="${ICONS[effects[1]]}" x="419" y="841" width="160" height="160"/>
`;
    }
    return `<path d="M 103 833 L 171 922 L 102 1010 H 616 L 685 922 L 616 833 Z" fill="#d7e7f3"/>
<path d="M 619 833 L 687 922 L 619 1010 H 647 L 716 922 L 648 833 Z" fill="#d79558"/>
<line x1="99" y1="832" x2="648" y2="832" stroke="black" stroke-width="4"/>
<line x1="99" y1="1011" x2="648" y2="1011" stroke="black" stroke-width="4"/>
<line x1="647" y1="1011" x2="717" y2="921" stroke="black" stroke-width="4"/>
<line x1="647" y1="832" x2="717" y2="923" stroke="black" stroke-width="4"/>
<line x1="618" y1="1011" x2="686" y2="921" stroke="black" stroke-width="4"/>
<line x1="618" y1="832" x2="686" y2="923" stroke="black" stroke-width="4"/>
<line x1="101" y1="1011" x2="170" y2="921" stroke="black" stroke-width="4"/>
<line x1="101" y1="832" x2="170" y2="923" stroke="black" stroke-width="4"/>
${effectIcons}
`;
    // TODO: dots on the orange section (dots #7d553a)
}

function backLine() {
    return `<line x1="-2" y1="350" x2="95" y2="256" stroke="white" stroke-width="5"/>
<line x1="95" y1="256" x2="415" y2="766" stroke="white" stroke-width="5"/>
<line x1="415" y1="768" x2="526" y2="769" stroke="white" stroke-width="3"/>
<line x1="523" y1="769" x2="563" y2="726" stroke="white" stroke-width="5"/>
<line x1="564" y1="725" x2="638" y2="702" stroke="white" stroke-width="4"/>
<line x1="639" y1="701" x2="657" y2="701" stroke="white" stroke-width="3"/>
<line x1="655" y1="701" x2="723" y2="635" stroke="white" stroke-width="5"/>
<line x1="723" y1="637" x2="723" y2="424" stroke="white" stroke-width="3"/>
<line x1="723" y1="425" x2="790" y2="360" stroke="white" stroke-width="5"/>
`;
}

function addImgs(text, height) {
    if (!text.includes("|"))
        return text;
    chunks = text.split("|");
    var newText = "";
    for (let i = 0; i < chunks.length; i++) {
        if (i % 2 == 0 || !ICONS.hasOwnProperty(chunks[i]))
            newText += chunks[i] + " ";
        else
            newText += `<img height="${height}" style="vertical-align: middle" src="${ICONS[chunks[i]]}">`
    }
    return newText;
}

const ABILITY_BOTTOM = 820;
function abilityPane(ability) {
    if (ability == null)
        return "";
    var desc = `<div style="width: 610">
    <p style="word-wrap: break-word; margin: 0; text-align: center">
        <span style="width: 590; font-size: 50; font-family: ParkinsonAmboy">${ability["name"]}</span>
        <br>
        <span style="width: 590; font-size: 40; font-family: DINCond"><b>${addImgs(ability["desc"], 40)}</b></span>
    </p>
</div>`;
    var ruler = document.getElementById("ruler");
    ruler.innerHTML = desc;
    var descHeight = ruler.getBoundingClientRect().height;
    ruler.innerHTML = '';
    
    return `<rect x="97" y="${ABILITY_BOTTOM - descHeight}" width="610" height="${descHeight}" fill="#d8e2f0" stroke-width="3" stroke="black"/>
<foreignObject x="97" y="${ABILITY_BOTTOM - descHeight}" width="610" height="${descHeight}">
    ${desc}
</foreignObject>`;
}

function genCard(iconImg, effects, name, ability, art, colours) {
    return `<svg width="788" height="1088">
    <rect width="788" height="1088" fill="${colours["background"]}" rx="25"/>
    ${backLine()}
    ${shapes(colours)}
    ${cardArt(art)}
    ${namePlate(name, colours["nameplate"], colours["nameAccent"])}
    ${icon(iconImg)}
    ${abilityPane(ability)}
    ${effectPane(effects)}
    </svg>`;
}