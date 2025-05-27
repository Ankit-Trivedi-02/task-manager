const { getUser } = require("../utils/userUtils")

function authenticationOfUser(req, res, next) {
    try {
        const token = req.cookies.uid;
        if (!token) {
            return res.json({ error: "No login session detected" });
        }
        const user = getUser(token)
        if (!user) {
            return res.json({ eroor: "No login session detected" })
        }
        req.user = user;
        next();
    }
    catch (err) {
        return res.json({ error: "Server error" });
    }
}

module.exports = { authenticationOfUser };