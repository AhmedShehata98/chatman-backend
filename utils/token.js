const jwt = require("jsonwebtoken");

function signToken(data, expires) {
  const token = jwt.sign(data, process.env.JWT_KEY, {
    expiresIn: expires,
  });
  return token;
}

function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_KEY);
}

module.exports = { signToken, verifyToken };
