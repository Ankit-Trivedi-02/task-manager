const user = require("../models/User")

async function registerUser(req, res) {
    if (!(req.body)) return res.json({ error: "All fields are required! " });
      const {username,email,password} = req.body;
      if(!username){
        return res.status(400).json({ error: "Username is required! "});
      }
      if(!email){
        return res.status(400).json({ error: "valid email is required! "});
      }
      if(!password || password.length<8){
        return res.status(400).json({ error: "password of min length 8 char is required! "});
      }
    try {
            const createdUser = await user.create({username,email,password})
            return res.status(201).json({success:"user created sucessfully"});
        }
        catch (err) {
            res.json({ error: err })
        }
}

module.exports= {registerUser};