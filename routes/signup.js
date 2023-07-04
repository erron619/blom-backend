const express = require("express");
const log     = require("debug")("route:signup");
const jwt     = require("jsonwebtoken")

// middleware -------------------------------------------------
const auth     = require("./../middleware/auth");
const cookie   = require("./../middleware/jwtCookieVerification");
const error    = require("./../middleware/signuploginErrorHandling");
const jsrm     = require("./../middleware/jsrm");
const mailer   = require("./../middleware/mailer");

// models -----------------------------------------------------
const userDB       = require("./../models/user");
const unverifiedDB = require("./../models/unverified");

// variables --------------------------------------------------
const router = express.Router();
const UNVERIFIED_COOKIE = "signup-auth-token";
const UNVERIFIED_SECRET = "unverfiedsecret";

// function ---------------------------------------------------
function create_token(id, email, verified = false) {
    return jwt.sign({id, email, verified}, UNVERIFIED_SECRET);
}

function send_code_mail(email, code) {
    mailer(
        email,
        "Sign up verification code",
        `<p>Your signup verification code is: ${code}</p>`
    );
}

// routes -----------------------------------------------------
router.post("/", async(req, res) => {
    try {
        // validation
        const validation = unverifiedDB.step1_validation(req.body);
        if (validation.error) return error.invalid(res, validation.error.message.toLowerCase());
        // user exist?
        const email = req.body.email;
        const user  = await userDB.get_one({email});
        if (user) return error.exist(res);
        // unverified exist? 
        const unverified = await unverifiedDB.get_one({email});
        const response = function (item) {
            const code = unverifiedDB.decrypt(item);
            const token = create_token(item._id, email, false);
            // send code via email
            send_code_mail(email, code);
            // create cookie and send code via response
            res.cookie(UNVERIFIED_COOKIE, token).status(200).json(jsrm(true));
        };
        // no: create one then send its '_id'
        if (!unverified) {
            const item = await unverifiedDB.create({email});
            response(item);
        }
        // yes: send its '_id'
        else {
            const item = await unverifiedDB.code_update({email});
            response(item);
        }
    }
    catch(err) { error.internal(res, err, log) }
});

router.post("/verify", async(req, res) => {
    try {
        // validation
        const validation = unverifiedDB.step2_validation(req.body);
        if (validation.error) return error.invalid(res, validation.error.message.toLowerCase());
        // cookie verification
        const token = cookie(req, UNVERIFIED_COOKIE, UNVERIFIED_SECRET);
        const _id = token.id;
        if (!_id) return error.auth(res);
        // id exist?
        const unverified = await unverifiedDB.get_one({_id}, true);
        if (!unverified) return error.null(res);
        // has the code expired?
        if (unverified.code_expiration < Date.now()) return error.expired(res);
        // code is correct?
        const code = req.body.code;
        if (unverified.code !== code) return error.unequal(res);
        // finish
        token.verified = true;
        const newtoken = create_token(_id, token.email, true);
        res.cookie(UNVERIFIED_COOKIE, newtoken).status(200).json(jsrm(true));
    }
    catch(err) { error.internal(res, err, log) }
});

router.post("/resend", async(req, res) => {
    try {
        // cookie verification
        const _id = cookie(req, UNVERIFIED_COOKIE, UNVERIFIED_SECRET).id;
        if (!_id) return error.auth(res);
        // update the code for user
        const unverified = await unverifiedDB.code_update({_id});
        if (!unverified) return error.null(res);
        send_code_mail(email, code);
        res.status(200).json(jsrm(true));
    }
    catch(err) { error.internal(res, err, log) }
});

router.post("/complete", async(req, res) => {
    try {
        const token = cookie(req, UNVERIFIED_COOKIE, UNVERIFIED_SECRET);
        if (!token || !token.verified) return error.auth(res);
        // create user
        const data = { ...req.body, email: token.email };
        const user = await userDB.create(data);
        // delete unverified
        await unverifiedDB.remove_one({_id: token.id});
        auth.create(res, user._id).status(200).json(jsrm(true));
    }
    catch(err) { error.internal(res, err, log) }
});

// exports ----------------------------------------------------
module.exports = router;