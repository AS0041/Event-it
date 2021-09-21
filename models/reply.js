const mongoose = require("mongoose");
const replySchema = new mongoose.Schema({
    reply:{
        type:String,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})
const Reply = mongoose.model("Reply", replySchema);
module.exports = Reply;