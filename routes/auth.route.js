const express = require("express");
const {
  signup,
  signin,
  requireSignin,
  signout,
} = require("../controllers/auth.controller");
const { runValidation } = require("../validator");
const {
  userSignupValidator,
  userSigninValidator,
} = require("../validator/auth");

const router = express.Router();

router.post("/signup", userSignupValidator, runValidation, signup);
router.post("/signin", userSigninValidator, runValidation, signin);

router.get("/signout", signout);

router.get("/secret", requireSignin, (req, res) => {
  res.status(200).json({
    user: req.user,
  });
});

module.exports = router;
