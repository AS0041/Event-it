if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const path = require("path");
const methodOverride = require("method-override");
const user = require("./router/userRouter");
const event = require("./router/eventsRouter");
const comment = require("./router/commentRouter");
const session = require("express-session");
const flash = require("connect-flash");
const User = require("./models/usermodel");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const MongoDBStore = require('connect-mongo');
const dbUrl = process.env.DB_ATLAS || 'mongodb://localhost:27017/event';

mongoose.connect("mongodb://localhost:27017/event", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Database connected")
    })
    .catch((e) => {
        console.log("Error: ", e)
    })

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, "/public")));//serving the static files
app.use(express.urlencoded({ extended: true }));

const secret = process.env.SECRET || "mysecret";
const store = new MongoDBStore({
    mongoUrl: dbUrl,
    secret: secret,
    touchAfter: 24 * 3600
})
store.on("error", (e) => {
    console.log("Mongo Error:", e);
})

const sessionConfig = {
    store: store,
    name: "secretname",
    secret: "thisismysecretforeventwebsite",
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: true,
        httpOnly: true,
        expires: Date.now() * 1000 * 3600 * 24 * 7,
        maxAge: 1000 * 3600 * 24 * 7
    }
};
passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:8000/google/callback",
    passReqToCallback: true
},
    async function (request, accessToken, refreshToken, profile, done) {
        const retrieveUser = await User.find({ email: profile.emails[0].value });
        if (!retrieveUser[0]) {
            const user = await new User({
                username: profile.displayName,
                email: profile.emails[0].value
            })
            await user.save();
            console.log(user);
        }
        return done(null, profile);
    }
));
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());
passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

app.get("/", (req, res) => {
    res.render("home");
})
app.use("/events", event);
app.use("/", user);
app.use("/events/:id/comments", comment);
app.all("*", (req, res) => {
    throw new Error("Error 404: Page Not Found.");
})

app.use((err, req, res, next) => {
    if (!err.message) err.message = "Opps! something went wrong."
    res.render("error", { err });
})

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Listening to port ${port}`);
})