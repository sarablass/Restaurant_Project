const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = (req, res, next) => {
    const cookieToken = req.cookies.accessToken;
    console.log(cookieToken);

    if (!cookieToken) return res.status(401).json({ message: "Access token not found" });

    jwt.verify(
        cookieToken,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.status(403).json({ message: "Invalid token" });
            req.id = decoded.id;
            req.idUserType = decoded.idUserType;
            return next();
        }
    );
};

module.exports = verifyJWT;