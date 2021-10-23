const mongoose = require("mongoose");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "You need enter name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "You need enter email"],
      unique: true, // one email per user
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    photo: {
      type: String,
    },
    role: {
      type: String,
      enum: ["admin", "user", "guide", "lead-guide"],
      default: "user",
    },
    password: {
      type: String,
      required: [true, "You need enter password"],
      minlength: 6,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "You need enter password"],
      minlength: 6,
      validate: {
        // this only work on CREATE and SAVE !!!
        validator: function (el) {
          return el === this.password; // el = password confirm and this = {}
        },
        message: "Please enter the same password",
      },
    },
    resetPasswordLink: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);

  this.passwordConfirm = undefined;
  next();
});

userSchema.methods = {
  correctPassword: async function (plainPassword, userPassword) {
    return await bcrypt.compare(plainPassword, userPassword);
  },
};

module.exports = mongoose.model("User", userSchema);
