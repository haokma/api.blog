const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, "Name of blog is required"],
      min: 3,
      max: 128,
    },
    slug: {
      type: String,
      trim: true,
      required: [true, "Slug  is required"],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
      min: 20,
    },
    excerpt: {
      type: String,
    },
    mtitle: String,
    mdesc: String,
    photo: [{ img: String }],
    category: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: [true, "Category is required"],
      },
    ],

    tag: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
        required: [true, "Tag is required"],
      },
    ],
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

module.exports = mongoose.model("Blog", blogSchema);
