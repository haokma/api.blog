const formidable = require("formidable");
const slugify = require("slugify");
const stripHtml = require("string-strip-html");
const _ = require("lodash");
const fs = require("fs");
const path = require("path");

const Blog = require("../models/blog.model");
const Category = require("../models/category.model");
const Tag = require("../models/tag.model");
const { smartTrim } = require("../helper/blog");

module.exports.getAllBlogs = async (req, res) => {
  try {
    let page = req.query.page * 1 || 1;
    let limit = req.query.limit * 1 || 2;
    let skip = (page - 1) * limit;

    const totalBlogs = await Blog.countDocuments();

    if (skip >= totalBlogs) {
      return res.status(409).json({
        status: "error",
        message: "The page does not exist",
      });
    }

    const blogs = await Blog.find()
      .populate("category", "name slug")
      .populate("tag", "name slug")
      .populate("postedBy", "name")
      .select("-__v")
      .skip(skip)
      .limit(limit);
    const totalBlog = await Blog.find()
    let totalPage = Math.ceil(totalBlog.length / limit)
    res.status(200).json({
      message: "success",
      result: blogs.length,
      totalPage,
      blogs,

    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      error: error.message,
    });
  }
};

module.exports.addBlog = async (req, res) => {
  try {
    const { title, content, category, tag, photo } = req.body;

    let tempBlog = {
      title,
      content,
      photo,
      tag,
      category,
      slug: slugify(title),
      excerpt: smartTrim(content, 320, " ", " ..."),
      mtitle: `${process.env.APP_NAME} | ${title}`,
      mdesc: stripHtml(content.substring(0, 160)).result,
      postedBy: req.user.id,
    };

    const blog = await Blog.create(tempBlog);

    res.json({
      message: "success",
      blog,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      error: error.message,
    });
  }
};

module.exports.updateBlog = async (req, res) => {
  try {
    const { body } = req;
    const { blogId } = req.params;
    console.log(body);

    let tempBlog = {
      postedBy: req.user.id,
    };

    if (body.photo) {
      tempBlog.photo = body.photo;
    }

    // tempBlog.photo = photo;


    if (body.title) {
      tempBlog.title = body.title;
      tempBlog.slug = slugify(body.title);
      tempBlog.mtitle = `${process.env.APP_NAME} | ${body.title}`;
    }

    if (body.tag) {
      tempBlog.tag = body.tag;
    }

    if (body.category) {
      tempBlog.category = body.category;
    }

    if (body.content) {
      tempBlog.excerpt = smartTrim(body.content, 320, " ", " ...");
      tempBlog.mdesc = stripHtml(body.content.substring(0, 160)).result;
      tempBlog.content = body.content
    }

    const blog = await Blog.findByIdAndUpdate(blogId, tempBlog, { new: true })
      .populate("category", "name")
      .populate("tag", "name")
      .populate("postedBy", "name");

    res.json({
      message: "update blog successful",
      blog,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      error: error.message,
    });
  }
};

module.exports.deleteBlog = async (req, res) => {
  try {
    const { blogId } = req.params;

    await Blog.findByIdAndDelete(blogId);

    res.json({
      message: "delete blog successful",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      error: error.message,
    });
  }
};

module.exports.getBlog = async (req, res) => {
  try {
    const limit = 4;

    const { slug } = req.params;

    const blog = await Blog.findOne({ slug })
      .populate("category", "name slug")
      .populate("tag", "name slug")
      .populate("postedBy", "name")
    // .select("-content");

    if (!blog)
      return res.status(400).json({
        status: "error",
        error: "Do not find blog with this slug",
      });

    const relatedBlogs = await Blog.find({
      _id: { $ne: blog._id },
      category: { $in: blog.category },
    })
      .limit(limit)
      .populate("postedBy", "name profile")
      .select("-content");

    res.status(200).json({
      status: "success",
      blog,
      relatedBlogs,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      error: error.message,
    });
  }
};

module.exports.getAllBlogsWithCategory = async (req, res) => {
  try {
    const { categorySlug } = req.params;

    const limit = req.query.limit * 1 || 10;
    const page = req.query.page * 1 || 1;
    const skip = (page - 1) * limit;

    const total = await Blog.countDocuments({});

    const category = await Category.findOne({ slug: categorySlug });

    if (!category)
      return res.status(400).json({
        status: "error",
        error: "Do not find category with this slug",
      });

    const blogs = await Blog.find({ category: category._id })
      .populate("category", "name slug")
      .populate("tag", "name slug")
      .populate("postedBy", "name")
      // .select("-content")
      .sort("createdAt")
      .skip(skip)
      .limit(limit);

    if (!blogs) {
      return res.status(400).json({
        status: "error",
        error: "Do not find blogs with this slug",
      });
    }

    if (blogs.length < 1)
      return res.status(200).json({
        status: "error",
        error: "Have no blog with this slug",
      });
    const blogsTotal = await Blog.find({ category: category._id })
    res.status(200).json({
      status: "success",
      result: blogs.length,
      totalPage: Math.ceil(blogsTotal.length / limit),
      blogs,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      error: error.message,
    });
  }
};

module.exports.getAllBlogsWithTag = async (req, res) => {
  try {
    const { TagSlug } = req.params;

    const limit = req.query.limit * 1 || 10;
    const page = req.query.page * 1 || 1;
    const skip = (page - 1) * limit;

    const total = await Blog.countDocuments({});

    const tag = await Tag.findOne({ slug: TagSlug });

    if (!tag)
      return res.status(400).json({
        status: "error",
        error: "Do not find Tag with this tag slug",
      });

    const blogs = await Blog.find({ tag: tag._id })
      .populate("category", "name slug")
      .populate("tag", "name slug")
      .populate("postedBy", "name")
      .select("-content")
      .sort("createdAt")
      .skip(skip)
      .limit(limit);

    if (!blogs)
      return res.status(400).json({
        status: "error",
        error: "Do not find Blog with this tag slug",
      });

    res.status(201).json({
      status: "success",
      result: blogs.length,
      total,
      blogs,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      error: error.message,
    });
  }
};

module.exports.getPhotos = async (req, res) => {
  try {
    const { slug } = req.params;

    const blog = await Blog.findOne({ slug }).select("photo");

    if (!blog)
      return res.status(404).json({
        status: "error",
        error: "Do not find blog with this slug",
      });

    //FIXME need to watch and fix again
    if (!blog.photo)
      return res.status(404).json({
        status: "error",
        error: "Do not Photo in this blog",
      });

    res.status(200).json({
      status: "success",
      photo: blog.photo,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      error: error.message,
    });
  }
};
