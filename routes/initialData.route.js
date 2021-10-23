const express = require("express");
const { getInitialData } = require("../controllers/initialData.controller");

const router = express.Router();

router.get("/", getInitialData);

module.exports = router;
