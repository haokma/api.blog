const express = require("express");
const { requireSignin } = require("../controllers/auth.controller");
const {
  getAllCategories,
  addCategory,
  getCategoryBySlug,
  updateCategory,
  deleteOneCategory,
} = require("../controllers/category.controller");
const { runValidation } = require("../validator");
const { categoryCreateValidator } = require("../validator/category");

const router = express.Router();

router.get("/", getAllCategories);

router.post(
  "/create",
  requireSignin,
  categoryCreateValidator,
  runValidation,
  addCategory
);

router.route("/:slug").get(getCategoryBySlug);

router.patch(
  "/:id",
  requireSignin,
  categoryCreateValidator,
  runValidation,
  updateCategory
);

router.delete("/:id", requireSignin, deleteOneCategory);

module.exports = router;
