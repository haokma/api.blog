const slugify = require("slugify");
const { errorHandler } = require("../helper/dbHandleError");
const { find } = require("../models/tag.model");
const Tag = require("../models/tag.model");

module.exports.getAllTags = async (req, res) => {
  try {
    const tags = await Tag.find();

    if (!tags)
      return res.status(400).json({
        status: "error",
        error: "Do not find tags",
      });

    res.status(200).json({
      status: "success",
      tag: tags,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      error: error.message,
      message: errorHandler(error),
    });
  }
};

module.exports.addTag = async (req, res) => {
  try {
    const { name } = req.body;
    const tag = {};
    tag.name = name;
    tag.slug = slugify(name).toLowerCase();

    const newTag = await Tag.create(tag);

    res.status(200).json({
      status: "success",
      message: "You are create success",
      tag: newTag,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      error: error.message,
      message: errorHandler(error),
    });
  }
};

module.exports.getTagBySlug = async (req, res) => {
  try {
    let slug = req.params.slug.toLowerCase();

    const tag = await Tag.findOne({ slug });

    if (!tag)
      return res.status(400).json({
        status: "error",
        error: "Do not find tag",
      });

    res.status(400).json({
      status: "success",
      tag,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      error: error.message,
      message: errorHandler(error),
    });
  }
};

module.exports.updateTag = async (req, res) => {
  try {
    let { id } = req.params;

    await Tag.findByIdAndUpdate(id, {
      name: req.body.name,
      slug: slugify(req.body.name).toLowerCase(),
    });
    const tag = await Tag.find()
    res.status(200).json({
      tag,
      status: "success",
      message: "Update tag success",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      error: error.message,
      message: errorHandler(error),
    });
  }
};

module.exports.deleteOneTag = async (req, res) => {
  try {
    let { id } = req.params;

    const tag = await Tag.findByIdAndDelete(id);
    const listTag = await Tag.find()
    res.status(200).json({
      tag: listTag,
      status: "success",
      message: "Tag deleted success",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      error: error.message,
      message: errorHandler(error),
    });
  }
};
