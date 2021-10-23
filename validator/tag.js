const { check } = require("express-validator");

module.exports.tagCreateValidator = [
  check("name").not().isEmpty().withMessage("Tag name is required "),
];
