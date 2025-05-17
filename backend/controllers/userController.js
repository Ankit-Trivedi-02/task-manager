const user = require("../models/User")

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
    const loginUser = await user.findOne({ email });

    if (!loginUser) {
      return res.status(400).json({ error: "Invalid credentials!" })
    }
    const isMatch = await loginUser.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials!" })
    }
    return res.status(200).json({ success: "You are at home page" });
  }
  catch (err) {
    return res.status(500).json({ error: "Server error" });
  }

}



module.exports = { registerUser, loginUser };