const express = require("express");
const log     = require("debug")("route:panel");
const jwt     = require("jsonwebtoken")

// middleware -------------------------------------------------
const cryption = require("./../middleware/cryption");
const jsrm     = require("./../middleware/jsonStatusRespondMessage");
const auth     = require("./../middleware/auth");

// models -----------------------------------------------------
const userDB  = require("./../models/user");
const plantDB = require("./../models/plant");

// variables --------------------------------------------------
const router  = express.Router();

// function ---------------------------------------------------

// routes -----------------------------------------------------
router.get("/", auth, async(req, res) => {
    const _id = req.user.id;
    const userdata = await userDB.get_one({ _id })
    res.status(200).send(userdata);
});

router.get("/plants", auth, async(req, res) => {
    try {
        const result = await userDB.get_allplants(req.user.id);
        res.status(200).send(result);
    }
    catch(err) { error.internal(res, err, log) }
});

router.post("/plants", auth, async(req, res) => {
    try {
        const result = await userDB.get_plant(req.user.id, req.body.id);
        res.status(200).send(result);
    }
    catch(err) { error.internal(res, err, log) }
})

router.post("/newplant", auth, async(req, res) => {
    try {
        // validation
        const validation = plantDB.validation(req.body);
        if (validation.error) return error.invalid(res);
        // create
        await userDB.add_plant(req.user.id, req.body);
        res.status(200).json(jsrm(true));
    }
    catch(err) { error.internal(res, err, log) }
});

// exports ----------------------------------------------------
module.exports = router;