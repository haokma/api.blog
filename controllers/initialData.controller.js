const Blog = require("../models/blog.model");
const Category = require("../models/category.model");
const Tag = require("../models/tag.model");

module.exports.getInitialData = async (req, res) => {
  try {
    let page = req.query.page * 1 || 1;
    let limit = req.query.limit * 1 || 2;
    let skip = (page - 1) * limit;

    const blogs = await Blog.find()
      .populate("category", "name slug")
      .populate("tag", "name slug")
      .populate("postedBy", "name")
      .select("-content")
      .skip(skip)
      .limit(limit);

    const categories = await Category.find();

    if (!categories)
      return res.status(400).json({
        status: "error",
        error: "Do not find category",
      });
    const tags = await Tag.find();

    if (!tags)
      return res.status(400).json({
        status: "error",
        error: "Do not find tags",
      });

    res.status(200).json({
      message: "success",
      result: blogs.length,
      blogs,
      categories,
      tags,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      error: error.message,
    });
  }
};
