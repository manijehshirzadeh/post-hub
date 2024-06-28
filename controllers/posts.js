const express = require("express");
const router = express.Router();

const User = require("../models/user.js");
const Post = require("../models/post.js");
const Comment = require("../models/comment.js");

const cloudinary = require("../middleware/cloudinary");
const upload = require("../middleware/multer");

// Show all posts page
router.get("/", async (req, res) => {
  try {
    // Getting posts for a the user who signed in
    const posts = await Post.find({
      owner: req.session.user._id,
    }).populate("owner");
    res.render("posts/index.ejs", { posts: posts });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

// A new post page
router.get("/new", async (req, res) => {
  res.render("posts/new.ejs");
});

// Update an existing post
router.put("/:postId", async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    await post.updateOne(req.body);

    // Redirecting the user to the edited post page
    res.redirect(`/posts/${req.params.postId}`);
  } catch (error) {
    console.log(error);
    res.redirect("/posts");
  }
});

// Creating a new Post
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

// Creating a new Comment for a specific Post
router.post("/:postId/comments", async (req, res) => {
  try {
    const newComment = new Comment(req.body);

    // Checking if the user is signed in or is a Guest user
    if (req.session.user) {
      newComment.owner = req.session.user._id;
    }

    await newComment.save();

    // Adding the newly created Comment to the Corresponding Post
    const post = await Post.findById(req.params.postId).populate("comments");

    post.comments.push(newComment);
    await post.save();

    // Redirecting to the Post which was added a new Comment into it
    res.redirect(`/posts/${req.params.postId}`);
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

// Show a Post page
router.get("/:postId", async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
      .populate("owner")
      // Populating the Comments, and its Owners as well
      .populate({
        path: "comments",
        populate: { path: "owner" },
      });

    res.render("posts/show.ejs", { post: post, user: req.session.user });
  } catch (error) {
    console.log(error);
    res.redirect("/posts");
  }
});

// Deleting a Post
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

// Editing a Post
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
