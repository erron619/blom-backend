const express = require("express");
const log     = require("debug")("route:signup");
const jwt     = require("jsonwebtoken")

// middleware -------------------------------------------------
const cryption = require("./../middleware/cryption");
const jsrm     = require("./../middleware/jsonStatusRespondMessage");
const createAuthToken = require("./../middleware/createAuthToken");

// models -----------------------------------------------------
const userDB       = require("./../models/user");

// variables --------------------------------------------------
const router = express.Router();
const LOGIN_SEC = "unverfiedsecret";

// function ---------------------------------------------------
function invalid_error (res) { res.status(400).json(jsrm(false, "INVALID", validation.error.message.toLowerCase())) }
function null_error    (res) { res.status(400).json(jsrm(false, "NULL",    "the email sent does not exist")) }
function unequal_error (res) { res.status(400).json(jsrm(false, "UEQ",     "the password sent is not correct")) }

function internal_error (res, err) { 
    res.status(400).json(jsrm(false, "INTERNAL", err.message));
    log(err.message) ;
}

// routes -----------------------------------------------------
router.post("/", async(req, res) => {
    try {
        // validation
        const validation = userDB.login_validation(req.body);
        if (validation.error) return invalid_error(res);
        // finding user by email
        const email = req.body.email;
        const user  = await userDB.get_one({email});
        if (!user) return null_error(res);
        // password checking
        const password = req.body.password;
        if (password !== user.password) return unequal_error(res)
        // send auth token and redirect
        createAuthToken(res, user._id).status(200).json(jsrm(true));
    }
    catch(err) { internal_error(res, err) }
});


// exports ----------------------------------------------------
module.exports = router;