const express = require("express");
const { requireSignin } = require("../controllers/auth.controller");
const {
  getAllTags,
  addTag,
  getTagBySlug,
  updateTag,
  deleteOneTag,
} = require("../controllers/tag.controller");
const { runValidation } = require("../validator");
const { tagCreateValidator } = require("../validator/tag");

const router = express.Router();

router.get("/", getAllTags);

router.post(
  "/create",
  requireSignin,
  tagCreateValidator,
  runValidation,
  addTag
);

router.route("/:slug").get(getTagBySlug);

router.patch(
  "/:id",
  requireSignin,
  tagCreateValidator,
  runValidation,
  updateTag
);

router.delete("/:id", requireSignin, deleteOneTag);

module.exports = router;
