const express = require("express");
const router = express.Router();

const User = require("../models/user.js");
const Post = require("../models/post.js");

const cloudinary = require("../middleware/cloudinary");
const upload = require("../middleware/multer");

router.get("/", async (req, res) => {
  try {
    const posts = await Post.find({}).populate("owner");
    res.render("posts/index.ejs", { posts: posts });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

router.get("/new", async (req, res) => {
  res.render("posts/new.ejs");
});

router.put("/:postId", async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    await post.updateOne(req.body);
    res.redirect("/posts");
  } catch (error) {
    console.log(error);
    res.redirect("/posts");
  }
});

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const imageResult = await cloudinary.uploader.upload(req.file.path);
    req.body.image = imageResult.secure_url;
    req.body.cloudinary_id = imageResult.public_id;
    const newPost = new Post(req.body);
    newPost.owner = req.session.user._id;
    await newPost.save();
    res.redirect("/posts");
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});
router.get("/:postId", async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId).populate("owner");
    res.render("posts/show.ejs", { post: post });
  } catch (error) {
    console.log(error);
    res.redirect("/posts");
  }
});

router.delete("/:postId", async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (post.owner.equals(req.session.user._id)) {
      await post.deleteOne();
      res.redirect("/posts");
    }
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

router.get("/:postId/edit", async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    res.render("posts/edit.ejs", { post: post });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

module.exports = router;
