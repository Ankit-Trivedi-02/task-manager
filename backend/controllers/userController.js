const user = require("../models/User")
const { setUser } = require("../utils/userUtils")

async function allUser(req, res) {
  res.json({ message: `${req.user.email} you are at user page` });
}


async function registerUser(req, res) {
  if (!(req.body)) return res.json({ error: "All fields are required! " });
  const { username, email, password } = req.body;
  if (!username) {
    return res.status(400).json({ error: "Username is required! " });
  }
  if (!email) {
    return res.status(400).json({ error: "valid email is required! " });
  }
  if (!password || password.length < 8) {
    return res.status(400).json({ error: "password of min length 8 char is required! " });
  }

  const isDoubleMail = await user.findOne({ email })
  if (isDoubleMail) {
    return res.status(400).json({ error: "User already exists with this email" });
  }

  try {
    const createdUser = await user.create({ username, email, password })
    return res.status(201).json({ success: "user created sucessfully" });
  }
  catch (err) {
    res.json({ error: err })
  }
}



async function loginUser(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Both email and password are required" })
  }
  try {
    const User = await user.findOne({ email });

    if (!User) {
      return res.status(400).json({ error: "Invalid credentials!" })
    }
    const isMatch = await User.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials!" })
    }

    const token = setUser({ _id: User._id, email: User.email });
    return res
      .cookie("uid", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      })
      .status(200)
      .json({ success: "You are at home page" })
  }
  catch (err) {
    return res.status(500).json({ error: "Server error" });
  }

}

async function logoutUser(req, res) {
  try {
    res.clearCookie("uid", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/", // important: match how the cookie was originally set
    });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    return res.status(500).json({ error: "Error logging out" });
  }
}


module.exports = { allUser, registerUser, loginUser, logoutUser };