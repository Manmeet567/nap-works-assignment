const mongoose = require("mongoose");
const validator = require("validator");

const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    validate: {
      validator: function (value) {
        return mongoose.Types.ObjectId.isValid(value);
      },
      message: "Invalid userId format",
    },
  },
  postName: {
    type: String,
    required: [true, "Post name is required"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    trim: true,
  },
  uploadTime: {
    type: Date,
    default: Date.now,
  },
  tags: {
    type: [String],
    default: [],
  },
  imageUrl: {
    type: String,
    validate: {
      validator: function (value) {
        return !value || validator.isURL(value); 
      },
      message: "Invalid image URL format",
    },
  },
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
