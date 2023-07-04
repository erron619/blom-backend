const cryption = require("./cryption");

function randomPick (input) {
    const length = input.length;
    return input.charAt(Math.trunc(Math.random() * length))
}
function randomChar (type) {
    const chars_list = {
        letter: "abcdefghijklmnopqrstuvwxyz",
        number: "0123456789",
        symbol: "_#@!$%&"
    }
    return randomPick(chars_list[type]);
}
function randomCode (pattern) {
    let code = "";
    for (let i = 0; i < pattern.length; i++) {
        if (pattern[i] === "n" || pattern[i] === "N") code += randomChar("number");
        else if (pattern[i] === "L") code += randomChar("letter").toUpperCase();
        else if (pattern[i] === "l") code += randomChar("letter");
        else code += randomChar("symbol");
    }
    return code;
}

module.exports = {
    create: (template, secret) => {
        let code = randomCode(template);
        if (secret) code = cryption.enc(code, secret);
        return code;
    },
    extract: (code, secret) => { return cryption.dec(code, secret) },
}