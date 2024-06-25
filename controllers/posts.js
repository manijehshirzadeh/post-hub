const express = require("express");
const router = express.Router();

const User = require("../models/user.js");
const Post = require("../models/post.js");

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

router.post("/", async (req, res) => {
  try {
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

module.exports = router;
