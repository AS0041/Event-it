const mongoose = require("mongoose");
const uceventSchema = new mongoose.Schema({
    eventuc: {
        type: Array
    }
});

const Ucevent = mongoose.model("Ucevent", uceventSchema);
module.exports = Ucevent;