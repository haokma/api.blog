const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "nguyenhao",
  api_key: "591886719435331",
  api_secret: "LQwBStiNZKb1n8KSBMQzWQlUN5c",
});

module.exports = cloudinary;
