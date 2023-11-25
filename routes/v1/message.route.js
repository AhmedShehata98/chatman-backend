const express = require("express");
const { authentication } = require("../../middlewares/authentication");
const { getUserMessages } = require("../../controller/message.controller");
const router = express.Router();

router.get("/:conversationId", getUserMessages);

module.exports = router;
