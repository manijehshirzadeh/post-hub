const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const session = require("express-session");

const ensureLoggedIn = require("./middleware/ensureLoggedIn");
const passGlobalDataToViews = require("./middleware/passGlobalDataToViews");

const authController = require("./controllers/auth.js");
const postsController = require("./controllers/posts.js");

const port = process.env.PORT ? process.env.PORT : "3000";

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

const Post = require("./models/post.js");
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passGlobalDataToViews);

app.use("/auth", authController);

app.use("/posts", postsController);
app.use(express.static("public"));

// The HomePage of the website
app.get("/", async (req, res) => {
  try {
    // Getting all the posts in the database, to be shown in the homepage for all the visitors
    const posts = await Post.find().populate("owner");

    res.render("index.ejs", {
      user: req.session.user,
      posts: posts,
    });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});
app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
