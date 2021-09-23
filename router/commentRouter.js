const express = require("express");
const router = express.Router({ mergeParams: true });
const Post = require("../models/post");
const Comment = require("../models/comment");
const Reply = require("../models/reply");
const { isLoggedIn, asyncError, validateSchema } = require("../middleware");

router.post("/", isLoggedIn, validateSchema, asyncError(async (req, res) => {
    const post = await Post.findById(req.params.id);
    const comment = await new Comment(req.body);
    if (!req.user._id) {
        const username = req.user.displayName;
        const mongoUser = await User.findOne({ username: username });
        const ID = mongoUser._id;
        req.user._id = ID;
    }
    comment.author = req.user._id;
    post.comments.push(comment);
    await post.save();
    await comment.save();
    req.flash("success", "Successfully made a new comment");
    res.redirect(`/events/${post._id}`);
}))
router.post("/:ID/reply", isLoggedIn, validateSchema, asyncError(async (req, res) => {
    const post = await Post.findById(req.params.id);
    const comment = await Comment.findById(req.params.ID);
    const reply = await new Reply(req.body);
    if (!req.user._id) {
        const username = req.user.displayName;
        const mongoUser = await User.findOne({ username: username });
        const ID = mongoUser._id;
        req.user._id = ID;
    }
    reply.author = req.user._id;
    comment.replies.push(reply);
    await comment.save();
    await reply.save();
    req.flash("success", "Successfully made a new reply");
    res.redirect(`/events/${post._id}`);
}))


router.delete("/:commentid", isLoggedIn, asyncError(async (req, res) => {
    const { id, commentid } = req.params;
    await Post.findByIdAndUpdate(id, { $pull: { comments: commentid } });
    await Comment.findByIdAndDelete(commentid);
    req.flash("success", "Successfully deleted the comment");
    res.redirect(`/events/${id}`);
}))
router.delete("/:commentid/reply/:replyid", isLoggedIn, asyncError(async (req, res) => {
    const { id, commentid, replyid } = req.params;
    await Comment.findByIdAndUpdate(commentid, { $pull: { replies: replyid } });
    await Reply.findByIdAndDelete(replyid);
    req.flash("success", "Successfully deleted the reply");
    res.redirect(`/events/${id}`);
}))

module.exports = router;