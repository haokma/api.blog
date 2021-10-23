const express = require("express");
const multer = require("multer");
const path = require("path");
const shortid = require("shortid");

const {
  requireSignin,
  adminMiddleware,
} = require("../controllers/auth.controller");
const {
  getAllBlogs,
  addBlog,
  updateBlog,
  deleteBlog,
  getBlog,
  getAllBlogsWithCategory,
  getAllBlogsWithTag,
  getPhotos,
} = require("../controllers/blog.controller");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.dirname(__dirname), "uploads")); // create path for folder upload
  },
  filename: function (req, file, cb) {
    cb(null, shortid.generate() + "-" + file.originalname); // create filename
  },
});

const upload = multer({ storage });

router.get("/", getAllBlogs);

router.post(
  "/create",
  requireSignin,
  adminMiddleware,
  upload.array("photo"),
  addBlog
);

router.get("/category/:categorySlug", getAllBlogsWithCategory);

router.get("/tag/:TagSlug", getAllBlogsWithTag);

router.get("/photo/:slug", getPhotos);

router.get("/:slug", getBlog);

router.patch("/:blogId", requireSignin, adminMiddleware, updateBlog);

router.delete("/:blogId", requireSignin, adminMiddleware, deleteBlog);

module.exports = router;
