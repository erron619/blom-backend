const config = require("config");
const jwt = require("jsonwebtoken");
const cookie = require("./jwtCookieVerification");

const SECRET = "authsecret";
const NAME = "user-auth-token"

module.exports = {
    check: async function(req, res, next) {
        const token = cookie(req, NAME, SECRET);
        if (!token && !token.hasOwnProperty("id")) return res.redirect("http://localhost:5000/403", 403);
        req.user = token;
        next();
    },
    create: function(res, id) {
        const token = jwt.sign({ id }, SECRET);
        return res.cookie(NAME, token);
    }
}