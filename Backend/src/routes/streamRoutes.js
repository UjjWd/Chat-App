const express = require("express");
const router = express.Router();
const { generateStreamToken } = require("../controllers/streamController");

router.get("/token", generateStreamToken);
module.exports = router;
