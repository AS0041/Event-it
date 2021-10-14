const mongoose = require("mongoose");
const memberSchema = new mongoose.Schema({
    name: String,
    college: String,
    email: String,
    linkedin: String,
    skills: Array
})
const Member = mongoose.model("Member", memberSchema);
module.exports = Member;