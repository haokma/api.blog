const express = require("express");
const {
  requireSignin,
  readUser,
  authMiddleware,
  adminMiddleware,
} = require("../controllers/auth.controller");

const router = express.Router();

router.get("/profile", requireSignin, authMiddleware, readUser);
router.get("/profile/admin", requireSignin, adminMiddleware, readUser);

module.exports = router;
