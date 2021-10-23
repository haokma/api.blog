const slugify = require("slugify");
const { errorHandler } = require("../helper/dbHandleError");
const Category = require("../models/category.model");

module.exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();

    if (!categories)
      return res.status(400).json({
        status: "error",
        error: "Do not find category",
      });

    res.status(200).json({
      status: "success",
      category: categories,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      error: error.message,
      message: errorHandler(error),
    });
  }
};

module.exports.addCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = {};
    category.name = name;
    category.slug = slugify(name).toLowerCase();

    const newCate = await Category.create(category);

    res.status(200).json({
      status: "success",
      message: "You are create success",
      category: newCate,
    });
  } catch (error) {
    console.log(Object.keys(error.keyValue)[0]);
    console.log(error);
    res.status(400).json({
      status: "error",
      error: error.message,
      message: errorHandler(error),
    });
  }
};

module.exports.getCategoryBySlug = async (req, res) => {
  try {
    let slug = req.params.slug.toLowerCase();

    const category = await Category.findOne({ slug });

    if (!category)
      return res.status(400).json({
        status: "error",
        error: "Do not find category",
      });

    res.status(200).json({
      status: "success",
      category,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      error: error.message,
      message: errorHandler(error),
    });
  }
};

module.exports.updateCategory = async (req, res) => {
  try {
    let { id } = req.params;

    await Category.findByIdAndUpdate(id, {
      name: req.body.name,
      slug: slugify(req.body.name).toLowerCase(),
    });
    const category = await Category.find()
    res.status(200).json({
      category,
      status: "success",
      message: "Update category success",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      error: error.message,
      message: errorHandler(error),
    });
  }
};

module.exports.deleteOneCategory = async (req, res) => {
  try {
    let { id } = req.params;

    const category = await Category.findByIdAndDelete(id);
    const listCategory = await Category.find();
    res.status(200).json({

      listCategory,
      status: "success",
      message: "Category deleted success",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      error: error.message,
      message: errorHandler(error),
    });
  }
};
