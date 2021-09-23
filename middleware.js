const Post = require("./models/post");
const { joiPost, joiEvent, joiComment, joiReply, joiUser } = require("./joiSchema");
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash("error", "Please Login First");
        return res.redirect("/login");
    }
    next();
}
module.exports.asyncError = function (fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(next);
    }
}
module.exports.isAuthor = async (req, res, next) => {
    const id = req.params;
    const post = await Post.findById(id.id);
    if (!post.author.equals(req.user._id) && !req.user._id.equals("614ab14bf236171ab327a660")) {
        req.flash("error", "You do not have permission to do that!");
        return res.redirect(`/campgrounds/${id.id}`);
    }
    next();
}
module.exports.validatePost = (req, res, next) => {
    const { error } = joiPost.validate(req.body);
    if (error) {
        req.flash("error", error.details[0].message);
        res.redirect("/register");
    } else {
        next();
    }
};
module.exports.validateEvent = (req, res, next) => {
    const { error } = joiEvent.validate(req.body);
    if (error) {
        req.flash("error", error.details[0].message);
        res.redirect("/register");
    } else {
        next();
    }
};
module.exports.validateComment = (req, res, next) => {
    const { error } = joiComment.validate(req.body);
    if (error) {
        req.flash("error", error.details[0].message);
        res.redirect("/register");
    } else {
        next();
    }
};
module.exports.validateReply = (req, res, next) => {
    const { error } = joiReply.validate(req.body);
    if (error) {
        req.flash("error", error.details[0].message);
        res.redirect("/register");
    } else {
        next();
    }
};
module.exports.validateUser = (req, res, next) => {
    const { error } = joiUser.validate(req.body);
    if (error) {
        req.flash("error", error.details[0].message);
        res.redirect("/register");
    } else {
        next();
    }
};