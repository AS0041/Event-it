const mongoose = require("mongoose");
const Member = require("./member");
const eventSchema = new mongoose.Schema({
    images: [
        {
            url: String,
            filename: String
        }
    ],
    time: {
        type: Date
    },
    timed: {
        type: Date
    },
    name: String,
    createdOn: {
        type: Date
    },
    description: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    links: {
        type: Array
    },
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Member"
        }
    ],
    allowedMembers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Member"
        }
    ],
    userclick: {
        type: Array
    },
})
eventSchema.post("findOneAndDelete", async (doc) => {
    if (doc) {
        await Member.deleteMany({
            _id: {
                $in: doc.members
            }
        })
    }
})
eventSchema.post("findOneAndDelete", async (doc) => {
    if (doc) {
        await Member.deleteMany({
            _id: {
                $in: doc.allowedMembers
            }
        })
    }
})
const Event = mongoose.model("Event", eventSchema);
module.exports = Event;