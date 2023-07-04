const mongoose = require("mongoose");
const log      = require("debug")("model:plant");
const joi      = require("joi");

// variables --------------------------------------------------
const NAME_LENGTH = [6, 24];
const ADVICE_DEFAULT = "بلوم برای شما توصیه ای ندارد :)";

// model ------------------------------------------------------
const schema = new mongoose.Schema({
    name: { 
        type: String,
        required: true, 
        minlength: NAME_LENGTH[0], 
        maxlength: NAME_LENGTH[1] 
    },
    type: { 
        type: mongoose.SchemaTypes.ObjectId,
        ref: "planttype",
        required: true 
    },
    createdDate: { 
        type: Date, 
        default: Date.now() 
    },
    helpCounts: { 
        type: Number, 
        default: 0 
    },
    lastHelpDate: { 
        type: Date 
    },
    advices: { 
        type: String, 
        default: ADVICE_DEFAULT, 
        minlength: 6 
    }
});
const model = mongoose.model("plant", schema);

// methods ----------------------------------------------------
function validation(input) {
    return joi.object({
        name: joi.string().min(NAME_LENGTH[0]).max(NAME_LENGTH[1]).required(),
        type: joi.required(),
    }).validate(input)
}

async function create(input) {
    await new model({
        name: input.name,
        type: input.type,
    }).save();
}

// export -----------------------------------------------------
module.exports = {
    model,
    schema,
    validation,
    create,
}