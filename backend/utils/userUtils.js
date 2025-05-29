const jwt = require("jsonwebtoken")
const dotenv = require("dotenv");
dotenv.config({ path: '../backend/.env' });
const secret = process.env.JWT_SECRET;

function setUser(user) {
    return jwt.sign(user, secret);
}

function getUser(token) {
    if (!token) return null;
    try {

        return jwt.verify(token, secret);
    }
    catch (err) {
        return null;
    }
}

module.exports = { setUser, getUser };