const mongoose = require("mongoose");
const clickSchema = new mongoose.Schema({
    users: {
        type: Array
    }
});
const Click = mongoose.model("Click", clickSchema);
module.exports = Click;