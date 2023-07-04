const jsrm = require("./jsrm");
module.exports = {
    auth     : function(res, message = "your request has not been authenticated") { res.status(400).json(jsrm(false, "AUTH", message)) },
    invalid  : function(res, message = "") { res.status(400).json(jsrm(false, "INVALID", message)) },
    exist    : function(res, message = "a user has already registered with the same email") { res.status(400).json(jsrm(false, "EXIST", message)) },
    null     : function(res, message = "the ID sent does not exist") { res.status(400).json(jsrm(false, "NULL", message)) },
    expired  : function(res, message = "the code sent has expired") { res.status(400).json(jsrm(false, "EXPIRED", message)) },
    unequal  : function(res, message = "the code sent is not correct") { res.status(400).json(jsrm(false, "UEQ", message)) },    
    internal : function(res, err, log) { 
        res.status(400).json(jsrm(false, "INTERNAL", err.message));
        if (log) log(err.message) ;
    },
}