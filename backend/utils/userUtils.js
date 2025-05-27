const jwt = require("jsonwebtoken")
const secret = "ThisIsSecretKey"

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