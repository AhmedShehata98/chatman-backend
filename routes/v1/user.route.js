const express = require("express");
const {
  signup,
  login,
  searchUser,
  userData,
} = require("../../controller/users.controller");
const { authentication } = require("../../middlewares/authentication");
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/info", authentication, userData);
router.get("/search", searchUser);

module.exports = router;
