const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/usermodel");


router.get("/login", (req, res) => {
    res.render("login");
});

router.get("/register", (req, res) => {
    res.render("register");
});
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "Successfully logged out.");
    res.redirect("/");
});
router.get("/profile", (req, res) => {
    res.render("profile");
});
router.post("/register", async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = await new User({ email, username });
        const registeredUser = await User.register(user, password);
        await user.save();
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash("success", `Welcome, ${req.user.username}`);
            res.redirect("/events");
        });
    }
    catch (e) {
        req.flash("error", e.message);
        res.redirect("/register");
    }
});
router.post("/login", passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), (req, res) => {
    req.flash("success", `Welcome, ${req.user.username}`);
    res.redirect("/events");
});
router.get('/google',
    passport.authenticate('google', {
        scope:
            ['email', 'profile']
    }
    ));

router.get('/google/callback',
    passport.authenticate('google', {
        failureFlash: true,
        failureRedirect: '/login'
    }), async (req, res) => {
        if (!req.user._id) {
            const username = req.user.displayName;
            const mongoUser = await User.findOne({ username: username });
            const ID = mongoUser._id.toString();
            req.user._id = ID;
        }
        req.flash("success", `Welcome, ${req.user.displayName}`);
        res.redirect("/events")
    });
module.exports = router;
