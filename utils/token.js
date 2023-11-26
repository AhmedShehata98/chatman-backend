const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/config');

function signToken(data, expires) {
    const token = jwt.sign(data, jwtSecret, {
        expiresIn: expires,
    });
    return token;
}

function verifyToken(token) {
    return jwt.verify(token, jwtSecret);
}

module.exports = { signToken, verifyToken };
