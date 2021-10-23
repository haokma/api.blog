const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "You need enter name of category"],
      min: 3,
      max: 256,
    },
    slug: {
      type: String,
      required: [true, "You need enter slug"],
      unique: true,
      index: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model("Category", categorySchema);
