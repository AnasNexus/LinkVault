
const jwt = require("jsonwebtoken");

const secret = process.env.JWT_SECRET;

const auth = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token || !token.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            msg: "Missing or invalid token"
        });
    }

    try {
        const decoded = jwt.verify(token.split(" ")[1], secret);

        req.user = decoded;

        next();
    } catch (error) {
        console.log(error.message);

        return res.status(401).json({
            success: false,
            msg: "Invalid or expired token"
        });
    }
};

module.exports = auth;
