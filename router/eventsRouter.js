if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const router = express.Router({ mergeParams: true });
const { isLoggedIn, asyncError, isAuthor, validatePost } = require("../middleware");
const multer = require("multer");
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const Post = require("../models/post");
const Event = require("../models/event");
const Ucevent = require("../models/ucevent");
const Member = require("../models/member");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API,
    api_secret: process.env.CLOUDINARY_SECRET
})
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'Events',
        allowedformats: ['jpeg', 'png', 'jpg']
    },
});
const upload = multer({ storage });


router.get("/", isLoggedIn, asyncError(async (req, res) => {
    const posts = await Post.find({}).populate("author");
    res.render("events", { posts });
}));
router.get("/new", isLoggedIn, asyncError(async (req, res) => {
    res.render("newpost");
}));
router.get("/create", isLoggedIn, asyncError(async (req, res) => {
    res.render("createEvent");
}));
router.get("/view", isLoggedIn, asyncError(async (req, res) => {
    const events = await Event.find({}).populate("author");
    res.render("viewEvents", { events });
}));
router.get("/upcoming", isLoggedIn, asyncError(async (req, res) => {
    res.render("upcoming");
}));
router.get("/create/:id/Member", isLoggedIn, asyncError(async (req, res) => {
    const event = await Event.findById(req.params.id);
    res.render("Member", { event });
}));
router.get("/create/:id", isLoggedIn, asyncError(async (req, res) => {
    const event = await Event.findById(req.params.id).populate("members").populate("allowedMembers").populate("author");
    const members = await Member.find({});
    res.render("viewEvent", { event, members });
}));
router.get("/:id", isLoggedIn, asyncError(async (req, res) => {
    const id = req.params;
    const post = await Post.findById(id.id).populate(
        {
            path: "comments",
            populate: [
                {
                    path: "author"
                },
                {
                    path: "replies",
                    populate:
                    {
                        path: "author"
                    }
                }
            ]
        }
    ).populate("author");
    if (!post) {
        req.flash("error", "Post Not Found!");
        return res.redirect("/events");
    }
    res.render("showpost", { post });
}));


router.post("/", upload.array("image"), isLoggedIn, validatePost, asyncError(async (req, res) => {
    const post = req.body;
    const posted = new Post(post);
    posted.images = req.files.map(x => ({ url: x.path, filename: x.filename }));
    posted.author = req.user._id;
    posted.createdAt = Date.now();
    await posted.save();
    req.flash("success", "You just made a new post");
    res.redirect(`/events/${posted._id}`);
}));
router.post("/create", upload.array("images"), isLoggedIn, asyncError(async (req, res) => {
    const event = req.body;
    const createdEvent = new Event(event);
    createdEvent.images = req.files.map(x => ({ url: x.path, filename: x.filename }));
    createdEvent.author = req.user._id;
    createdEvent.createdAt = Date.now();
    await createdEvent.save();
    req.flash("success", `You created a new event- ${createdEvent.name}`);
    res.redirect("/events/view");
}));
router.post("/upcoming", isLoggedIn, asyncError(async (req, res) => {
    await Ucevent.deleteMany({});
    const event = req.body;
    const ucevent = new Ucevent(event);
    await ucevent.save();
    req.flash("sucess", "Good-day, admin! Updated upcoming events.")
    res.redirect("/");
}));
router.post("/create/:id/Member", asyncError(async (req, res) => {
    const id = req.params;
    const event = await Event.findById(id.id);
    const member = new Member(req.body);
    member.name = req.user.username || req.user.displayName;
    await event.members.push(member);
    await event.userclick.push(member.name);
    await member.save();
    await event.save();
    req.flash("success", `Request send to join the event- ${event.name}. We will send you confirmation via your email.`);
    res.redirect(`/events/create/${id.id}`);
}));
router.post("/create/:id/:memberid", asyncError(async (req, res) => {
    const id = req.params;
    const event = await Event.findById(id.id);
    const member = await Member.findById(id.memberid);
    await Event.findByIdAndUpdate(id.id, { $pull: { members: id.memberid } });
    event.allowedMembers.push(member);
    await event.save();
    const oAuth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, "https://developers.google.com/oauthplayground");
    oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });
    async function sendMail() {
        const accessToken = await oAuth2Client.getAccessToken();
        const transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: "eventit41@gmail.com",
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: "1//04WPTcPl4Tt5sCgYIARAAGAQSNwF-L9IriXOR-rF7PR_GogBW3TvKc9qecw4ahmHSe_IEZB3kEC2wEoaUa0s2RGl87Z9vp83-KBE",//process.env.REFRESH_TOKEN,
                accessToken: accessToken
            }
        });
        const mailOptions = {
            from: '"EventIt 📧"<eventit41@gmail.com>',
            to: `${member.email}`,
            subject: `Congratulations! You are selected as a member for the event- ${event.name}`,
            text: `Congratulations! You are selected as a member for the event- ${event.name}`,
            html: `<p>Congratulations! You are selected as a member for the event- ${event.name}.<br><br><p>Regards</p>Abhishek Singh-EventIt.</p>`
        };
        const result = await transport.sendMail(mailOptions)
        return result
    };
    sendMail(req, res)
        .then((result) => {
            req.flash("success", `Accepted ${member.name} as a Member.Email sent to ${member.email}.Please visit your email to check the sent mail.`);
            res.redirect(`/events/create/${id.id}`);
        })
        .catch((error) => {
            req.flash("error", `Error! Could not send email to ${member.name}`);
            res.redirect(`/events/create/${id.id}`);
        });
}));
router.post("/:id/likes", asyncError(async (req, res) => {
    const id = req.params;
    const userID = req.user._id;
    const post = await Post.findById(id.id);
    const uid = post.userids.find(uid => uid === userID);
    if (uid) {
        post.likes -= 1;
        const newids = post.userids.filter(id => id !== userID);
        post.userids = newids;
        post.save();
        res.redirect(`/events/${id.id}`);
    } else {
        post.likes += 1;
        post.userids.push(userID);
        post.save();
        res.redirect(`/events/${id.id}`);
    }
}));
router.put("/:id", isLoggedIn, isAuthor, upload.array("image"), validatePost, asyncError(async (req, res) => {
    const id = req.params;
    const post = await Post.findByIdAndUpdate(id.id, req.body);
    const imgs = req.files.map(x => ({ url: x.path, filename: x.filename }))
    post.images.push(...imgs);
    await post.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await post.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
    }
    req.flash("success", "Successfully edited the post");
    res.redirect(`/events/${post._id}`);
}))
router.put("/create/:id", isLoggedIn, upload.array("image"), asyncError(async (req, res) => {
    const id = req.params;
    const event = await Event.findByIdAndUpdate(id.id, req.body);
    const imgs = req.files.map(x => ({ url: x.path, filename: x.filename }));
    event.images.push(...imgs);
    await event.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await event.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
    }
    req.flash("success", "Successfully edited the event");
    res.redirect(`/events/create/${event._id}`);
}))
router.delete("/create/:id/:memberid/allowed", isLoggedIn, asyncError(async (req, res) => {
    const id = req.params;
    const event = await Event.findById(id.id);
    const member = await Member.findById(id.memberid);
    await Event.findByIdAndUpdate(id.id, { $pull: { allowedMembers: id.memberid } });
    await Member.findByIdAndDelete(id.memberid);
    const userclicked = event.userclick.find(x => x === member.name);
    const newUserclick = await event.userclick.filter(x => x !== userclicked);
    event.userclick = newUserclick;
    event.save();
    req.flash("success", `Removed ${member.name} from Member`);
    res.redirect(`/events/create/${id.id}`);
}));
router.delete("/create/:id/:memberid", isLoggedIn, asyncError(async (req, res) => {
    const id = req.params;
    const event = await Event.findById(id.id);
    const member = await Member.findById(id.memberid);
    await Event.findByIdAndUpdate(id.id, { $pull: { members: id.memberid } });
    await Member.findByIdAndDelete(id.memberid);
    const userclicked = event.userclick.find(x => x === member.name);
    const newUserclick = await event.userclick.filter(x => x !== userclicked);
    event.userclick = newUserclick;
    event.save();
    req.flash("success", "Member declined permission");
    res.redirect(`/events/create/${id.id}`);
}));
router.delete("/create/:id", isLoggedIn, asyncError(async (req, res) => {
    const id = req.params;
    await Event.findByIdAndDelete(id.id);
    req.flash("success", "Successfully deleted the event");
    res.redirect("/events/view");
}));
router.delete("/:id", isLoggedIn, isAuthor, asyncError(async (req, res) => {
    const id = req.params;
    await Post.findByIdAndDelete(id.id);
    req.flash("success", "Successfully deleted the post");
    res.redirect("/events");
}));

module.exports = router;