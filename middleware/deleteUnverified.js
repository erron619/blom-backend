const unverifiedDB = require("./../models/unverified");
const log = require("debug")("middleware:deleteUnverified");

async function action () {
    try {
        const result = await unverifiedDB.delete_expiered_users();
        log(result);
    } catch (err) { log(err.message) }
}

module.exports = function(period) {
    return setInterval(action, period * 1000 * 60);
}