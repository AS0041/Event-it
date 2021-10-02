const Post = require("./models/post");
const { joiPost, joiUser } = require("./joiSchema");
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
    if (!post.author.equals(req.user._id) && !req.user._id.equals("6156780ff3687e5a21a08d66" || "61479a514ccc3fdaffb8b2b8")) {
        req.flash("error", "You do not have permission to do that!");
        return res.redirect(`/events/${id.id}`);
    }
    next();
}
module.exports.validatePost = (req, res, next) => {
    const { error } = joiPost.validate(req.body);
    if (error) {
        req.flash("error", error.details[0].message);
        res.redirect("/events/new");
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