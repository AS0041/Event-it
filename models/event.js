const mongoose = require("mongoose");
const eventSchema = new mongoose.Schema({
    images: [
        {
            url: String,
            filename: String
        }
    ],
    date: {
        type: Date
    },
    name: String,
    userids: {
        type: Array
    },
    createdAt: {
        type: Date
    },
    description: String,
    likes: {
        type: Number,
        default: 0
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    divisions: [
        {
            type: String
        }
    ]
})

const Event = mongoose.model("Event", eventSchema);
module.exports = Event;