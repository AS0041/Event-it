const express = require("express");
const router = express.Router({ mergeParams: true });
const { isLoggedIn, asyncError, isAuthor, validatePost } = require("../middleware");
const multer = require("multer");
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const Post = require("../models/post");
const Event = require("../models/event");
const Ucevent = require("../models/ucevent");

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
router.get("/create/:id", isLoggedIn, asyncError(async (req, res) => {
    const id = req.params;
    const event = await Event.findById(id.id);
    res.render("viewEvent", { event });
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
router.delete("/:id", isLoggedIn, isAuthor, asyncError(async (req, res) => {
    const id = req.params;
    await Post.findByIdAndDelete(id.id);
    req.flash("success", "Successfully deleted the post");
    res.redirect("/events");
}))

module.exports = router;