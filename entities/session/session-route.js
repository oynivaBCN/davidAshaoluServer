const express = require("express");
const router = express.Router();
const SessionController = require("./session-controller");

router.get("/login", SessionController.login);

module.exports = router;
