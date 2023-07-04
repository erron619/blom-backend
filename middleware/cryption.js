const cryptojs = require("crypto-js");

function enc(value, secret) {
    return cryptojs.AES.encrypt(value, secret).toString();
}
function dec(value, secret) {
    return cryptojs.AES.decrypt(value, secret).toString(cryptojs.enc.Utf8);
}

module.exports = {
    enc,
    dec
}