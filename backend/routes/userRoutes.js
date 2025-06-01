const express = require("express");
const router = express.Router();
const { allUser, registerUser, loginUser, logoutUser } = require("../controllers/userController")
const { authenticationOfUser } = require("../middlewares/auth");

router.get("/", authenticationOfUser, allUser)
router.post("/register", registerUser);
router.post("/login", loginUser)
router.post("/logout", logoutUser)

module.exports = router;