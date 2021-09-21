const mongoose = require("mongoose");
const Comment = require("./comment");
const Reply = require("./reply");
const postSchema = new mongoose.Schema({
    images: [
        {
            url: String,
            filename: String
        }
    ],
    title: String,
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
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
})


postSchema.post("findOneAndDelete", async (doc) => {
    if (doc) {
        await Comment.deleteMany({
            _id: {
                $in: doc.comments
            }
        })
    }
})
const Post = mongoose.model("Post", postSchema);
module.exports = Post;