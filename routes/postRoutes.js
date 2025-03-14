const express = require("express");
const router = express.Router();
const requireAuth = require("../middlewares/requireAuth");
const { createPost, getPosts } = require("../controllers/postControllers");

router.post("/add-post", requireAuth, createPost);

router.get("/get-posts", getPosts);

module.exports = router;
