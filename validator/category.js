const { check } = require("express-validator");

module.exports.categoryCreateValidator = [
  check("name").not().isEmpty().withMessage("Name is required"),
];
