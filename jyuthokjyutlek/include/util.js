function rubyify(chinese, pingtop, pingbot) {
    var tops = pingtop ? pingtop.split(" ") : "";
    var bots = pingbot ? pingbot.split(" ") : null;
    var rubied = "";
    chinese.split(" ").forEach((char, idx) => {
        if (bots)
            rubied += `<ruby style="ruby-position: under;"><ruby>${char}<rt>${tops[idx]}</rt></ruby><rt>${bots[idx]}</rt></ruby>`
        else 
            rubied += `<ruby>${char}<rt>${tops[idx]}</rt></ruby>`;
    });
    return rubied;
}