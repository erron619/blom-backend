const mongoose = require("mongoose");
const log      = require("debug")("model:user");
const joi      = require("joi");

// middleware -------------------------------------------------
const code = require("../middleware/code");
const cryption = require("./../middleware/cryption");

// variables --------------------------------------------------
const PASSWORD_LENGTH = [6, 24];
const NAME_LENGTH = [3, 24];
const INVITE_TEMPLATE = "NLNlN";
const SECRET = "cryptosecret";
const STARTER_COINS = 3000;

// model ------------------------------------------------------
const plantDB = require("./plant");
const groupDB = require("./group");
const model = mongoose.model("users", new mongoose.Schema({
    name: {
        type: String,
        minlength: NAME_LENGTH[0],
        maxlength: NAME_LENGTH[1],
    },
    email: { 
        type: String,
        required: true,
        unique: true
    },
    phone: { 
        type: String,
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true, 
    },
    invite: { 
        type: String, 
        required: true, 
        unique: true,
    },
    invitedBy: { 
        type: mongoose.Types.ObjectId 
    },
    coins: { 
        type: Number,
        default: STARTER_COINS 
    },
    plants: [ plantDB.schema ],
    groups: [ groupDB.schema ],
    signinDate: { 
        type: Date, 
        default: Date.now() 
    },
    isAdmin: {
        type: Boolean,
        default: false,
    }
}));

// methods ----------------------------------------------------
function register_validation(input) {
    return joi.object({
        name: joi.string().required().min(NAME_LENGTH[0]).max(NAME_LENGTH[1]),
        email: joi.string().email().required(),
        phone: joi.string().required().length(11),
        password: joi.string().required().min(PASSWORD_LENGTH[0]).max(PASSWORD_LENGTH[1])
    }).validate(input);
}

function login_validation(input) {
    return joi.object({
        email: joi.string().email().required(),
        password: joi.string().required().min(PASSWORD_LENGTH[0]).max(PASSWORD_LENGTH[1])
    }).validate(input);
}

async function create(input) {
    const validation = register_validation(input);
    if (validation.error) throw new Error(validation.error);
    input.password = cryption.enc(input.password, SECRET);
    input.invite   = code.create(INVITE_TEMPLATE, SECRET);
    return await new model(input).save();
}

async function add_plant(id, input) {
    const user = await get_one({ _id: id });
    if (!user) return;
    user.plants.push(new plantDB.model(input));
    user.save();
}

async function get_allplants(id) {
    return model.findById(id).populate("plants.type", "faname engname -_id").select("-_id plants._id plants.name");
}

async function get_plant(user_id, plant_id) {
    const user = await model.findById(user_id).populate("plants.type", "-_id").select("-_id");
    return user.plants.id(plant_id)
}

async function get_one(selector, decrypt = false) {
    const user = await model.findOne(selector);
    if (!user) return;
    if (decrypt) {
        user.password = cryption.dec(user.password, SECRET);
        user.giftcode = cryption.dec(giftcode()     , SECRET);
    }
    return user;
}

// export -----------------------------------------------------
module.exports = {
    model,
    register_validation,
    login_validation,
    create,
    get_one,
    get_allplants,
    get_plant,
    add_plant,
}