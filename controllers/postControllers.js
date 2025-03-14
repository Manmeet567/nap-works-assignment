const Post = require("../models/postModel");
const validator = require("validator");
const axios = require("axios");

const createPost = async (req, res, next) => {
  const { userId, postName, description, uploadTime, tags, imageUrl } =
    req.body;
  try {
    const loggedInUserId = req.user?.id;

    if (!loggedInUserId) {
      return res.status(401).json({ error: "Please Signup or Login first!" });
    }

    if (userId != loggedInUserId) {
      return res.status(401).json({ error: "Request not Authorized" });
    }

    // Validate tags
    if (tags) {
      if (!Array.isArray(tags)) {
        return res
          .status(400)
          .json({ error: "Tags must be an array of strings" });
      }

      if (!tags.every((tag) => typeof tag === "string")) {
        return res
          .status(400)
          .json({ error: "Tags must only contain string values" });
      }
    }

    // Validate imageUrl
    if (imageUrl) {
      if (!validator.isURL(imageUrl)) {
        return res.status(400).json({ error: "Invalid URL format" });
      }
      const isValidImage = await validateImageUrl(imageUrl);
      if (!isValidImage) {
        return res.status(400).json({ error: "Invalid image URL" });
      }
    }

    // Create new post
    const newPost = new Post({
      userId: loggedInUserId,
      postName,
      description,
      uploadTime: uploadTime || Date.now(),
      tags: tags && tags.length > 0 ? tags : [],
      imageUrl,
    });

    await newPost.save();

    return res.status(201).json({
      message: "Post created successfully",
      post: newPost,
    });
  } catch (error) {
    next(error);
  }
};

const getPosts = async (req, res, next) => {
  try {
    const {
      searchText,
      startDate,
      endDate,
      tags,
      page = 1,
      limit = 10,
    } = req.query;

    // Build dynamic query object
    let query = {};

    // Search in postName and description using regex (case-insensitive)
    if (searchText) {
      query.$or = [
        { postName: { $regex: searchText, $options: "i" } },
        { description: { $regex: searchText, $options: "i" } },
      ];
    }

    // Filter by date range
    if (startDate || endDate) {
      query.uploadTime = {};
      if (startDate) query.uploadTime.$gte = new Date(startDate);
      if (endDate) query.uploadTime.$lte = new Date(endDate);
    }

    // Filter by tags (ensures all given tags are present in the post)
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : tags.split(",");
      query.tags = { $all: tagArray };
    }

    // Convert page & limit to numbers
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;

    // Fetch filtered posts with pagination
    const posts = await Post.find(query)
      .sort({ uploadTime: -1 }) // Sort by newest posts first
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    // Count total matching posts
    const totalPosts = await Post.countDocuments(query);

    return res.status(200).json({
      totalPosts,
      totalPages: Math.ceil(totalPosts / limitNumber),
      currentPage: pageNumber,
      posts,
    });
  } catch (error) {
    next(error);
  }
};

const validateImageUrl = async (url) => {
  try {
    const { headers } = await axios.head(url, { timeout: 5000 });

    const contentType = headers["content-type"] || "";
    const validImageTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
      "image/bmp",
    ];

    return validImageTypes.some((type) => contentType.includes(type));
  } catch (error) {
    console.error("Error validating image URL:", error.message);
    return false;
  }
};

module.exports = { createPost, getPosts };
