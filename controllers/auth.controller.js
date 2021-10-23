const shortid = require("shortid");
const jwt = require("jsonwebtoken");
const util = require("util");

const User = require("../models/user.model");
const { errorHandler } = require("../helper/dbHandleError");

const signToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRED_IN,
  });
};

module.exports.signup = async (req, res) => {
  try {
    console.log(req.body);
    console.log(User);
    const newUser = await User.create(req.body);

    const token = signToken(newUser);

    // console.log(newUser);
    const cookieOptions = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRED_IN * 60 * 60 * 1000
      ),
    };

    if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
    res.cookie("jwt", token, cookieOptions);

    newUser.password = undefined;

    res.status(200).json({
      status: "success",
      message: "You are register success",
      token,
      user: newUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "error",
      message: errorHandler(error),
      error: error.message,
    });
  }
};

module.exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({
        status: "error",
        message: "You need enter email or password",
      });

    const user = await User.findOne({ email }).select("+password");

    if (!user)
      return res.status(400).json({
        status: "fail",
        error: "Do not found user with this email",
      });

    const correct = await user.correctPassword(password, user.password);
    console.log(correct);

    if (!correct)
      return res.status(400).json({
        status: "fail",
        error: "Incorrect password",
      });

    let token = signToken(user);

    const cookieOptions = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRED_IN * 60 * 60 * 1000
      ),
    };

    if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
    res.cookie("jwt", token, cookieOptions);

    user.password = undefined;

    res.status(200).json({
      status: "success",
      message: "You are login success",
      token,
      user,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: errorHandler(error),
      error: error.message,
    });
  }
};

module.exports.signout = async (req, res) => {
  res.clearCookie("jwt");

  res.status(400).json({
    message: "Sign out success",
  });
};

module.exports.requireSignin = async (req, res, next) => {
  try {
    // console.log(req.headers);
    if (
      !req.headers.authorization ||
      !req.headers.authorization.startsWith("Bearer")
    )
      return res.status(400).json({
        status: "error",
        message: "Authorization is required, please login get access",
      });

    const token = req.headers.authorization.split(" ")[1];

    let decoded = await util.promisify(jwt.verify)(
      token,
      process.env.JWT_SECRET
    );

    const currentUser = await User.findById(decoded.id);

    if (!currentUser)
      res.status(400).json({
        status: "fail",
        message: "The current user does not exits",
      });

    req.user = currentUser;
    console.log(req.user);

    next();
  } catch (error) {
    res.status(400).json({
      status: "error",
      error,
      message: "Something went wrong",
    });
  }
};

// ?
// module.exports.requireSigninJWT = expressJWT({
//   secret: process.env.JWT_EXPIRED_IN,
// });

module.exports.authMiddleware = async (req, res, next) => {
  try {
    const authUserId = req.user._id;

    const user = await User.findById(authUserId);

    if (!user)
      return res.status(400).json({
        status: "error",
        message: "User not found",
      });

    req.profile = user;

    next();
  } catch (error) {
    res.status(400).json({
      status: "error",
      error,
    });
  }
};

module.exports.adminMiddleware = async (req, res, next) => {
  try {
    const adminUserId = req.user._id;

    const user = await User.findById(adminUserId);

    if (!user)
      return res.status(400).json({
        status: "error",
        message: "Admin not found",
      });

    if (user.role !== "admin")
      return res.status(400).json({
        status: "error",
        message: "Admin resource, Access denied",
      });

    req.profile = user;

    next();
  } catch (error) {
    res.status(400).json({
      status: "error",
      error: error.message,
    });
  }
};

module.exports.readUser = (req, res) => {
  return res.status(200).json({
    user: req.profile,
  });
};
