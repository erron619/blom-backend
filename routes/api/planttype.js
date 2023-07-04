const express = require("express");
const log     = require("debug")("route:api-planttype");

// middleware -------------------------------------------------
const error    = require("./../../middleware/errorHandling");

// models -----------------------------------------------------
const planttypeDB = require("./../../models/planttype");

// variables --------------------------------------------------
const router  = express.Router();

// routes -----------------------------------------------------
router.get("/", async(req, res) => {
    try {
        const result = await planttypeDB.get_all();
        res.status(200).send(result);
    }
    catch (err) {
        internal_error(res, err.message);
    }
});

router.get("/test", async(req, res) => {
    try {
        const result = await planttypeDB.createTest();
        res.sendStatus(200);
    }
    catch (err) {
        error.internal(res, err, log);
    }
});

// exports ----------------------------------------------------
module.exports = router;