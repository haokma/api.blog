const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "You need enter the tag name"],
    maxlength: 32,
  },
  slug: {
    type: String,
    unique: true,
    index: true,
  },
});

module.exports = mongoose.model("Tag", tagSchema);
