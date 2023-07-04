const mongoose = require("mongoose");
const log      = require("debug")("model:group");

// variables --------------------------------------------------
const NAME_LENGTH = [6, 24]

// model ------------------------------------------------------
const schema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,  
        minlength: NAME_LENGTH[0], 
        maxlength: NAME_LENGTH[1],
    },
    members: [
        new mongoose.Schema({
            ref: {
                type: mongoose.SchemaTypes.ObjectId,
                required: true,
            }
        })
    ],
});
const model = mongoose.model("group", schema);

// methods ----------------------------------------------------

// export -----------------------------------------------------
module.exports = {
    model,
    schema,
}