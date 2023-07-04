const mongoose     = require("mongoose");
const log          = require("debug")("model:user");
const joi          = require("joi");

// middleware -------------------------------------------------
const code       = require("../middleware/code");
const cryption   = require("./../middleware/cryption");
const expiration = require("./../middleware/createExpiration");

// variables --------------------------------------------------
const SECRET = "unverfiedsecret";
const CODE_TEMPLATE = "NLNlN";
const CODE_EXPIRATION = [5, "min"];
const USER_EXPIRATION = [2, "hr" ];

// model ------------------------------------------------------
const model = mongoose.model("unverified", new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    code: {
        type: String,
        default: code.create(CODE_TEMPLATE, SECRET),
        required: true,
    },
    code_expiration: {
        type: Date,
        default: expiration(...CODE_EXPIRATION),
    },
    user_expiration: {
        type: Date,
        default: expiration(...USER_EXPIRATION),
    }
}));

// methods ----------------------------------------------------
function step1_validation(input) {
    return joi.object({
        email: joi.string().required().email(),
    }).validate(input);
}

function step2_validation(input) {
    return joi.object({
        code: joi.string().required().length(5),
    }).validate(input);
}

async function create(input) {
    return await new model(input).save();
}

async function delete_expiered_users() {
    const now = Date.now();
    return await model.deleteMany({user_expiration: { $lt: now }});
}

async function code_update(selector) {
    const user = await model.findOne(selector);
    user.code = code.create(CODE_TEMPLATE, SECRET);
    user.code_expiration = expiration(...CODE_EXPIRATION);
    user.user_expiration = expiration(...USER_EXPIRATION);
    await user.save();
    return user;
}

async function remove_one(selector) {
    return await model.findOneAndDelete(selector);
}

function decrypt(item, full = false) {
    item.code = cryption.dec(item.code, SECRET);
    if (!full) return item.code;
    return item;
}

async function get_one(selector, decrypt_code = false) {
    const result = await model.findOne(selector);
    if (!result) return;
    if (decrypt_code) result.code = decrypt(result);
    return result;
}

// export -----------------------------------------------------
module.exports = {
    model,
    create,
    step1_validation,
    step2_validation,
    delete_expiered_users,
    code_update,
    get_one,
    decrypt,
    remove_one,
}