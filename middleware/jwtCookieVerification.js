const jwt = require("jsonwebtoken");

module.exports = function (req, name, secret) {
    const cookie = req.cookies[name];
    if (!cookie) return;
    return jwt.verify(cookie, secret);
}