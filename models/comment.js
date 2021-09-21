const mongoose = require("mongoose");
const Reply = require("./reply");
const commentSchema = new mongoose.Schema({
    comment: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    replies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reply"
    }]
})
commentSchema.post("findOneAndDelete", async (doc) => {
    if (doc) {
        await Reply.deleteMany({
            _id: {
                $in: doc.replies
            }
        })
    }
})
const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;