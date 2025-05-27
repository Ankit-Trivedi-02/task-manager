const express = require("express");
const router = express.Router();
const { allUser, registerUser, loginUser } = require("../controllers/userController")
const { authenticationOfUser } = require("../middlewares/auth");

router.get("/", authenticationOfUser, allUser)
router.post("/register", registerUser);
router.post("/login", loginUser)

module.exports = router;