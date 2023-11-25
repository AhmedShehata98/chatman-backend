const User = require("../models/user.model");
const { verifyToken } = require("../utils/token");

const authentication = async (req, res, next) => {
  const { authorization } = req.headers;
  const token = authorization.split(" ")[1];

  if (token === undefined) {
    res.status(500).json({ message: `cannot find token key ,token: ${token}` });
    return;
  }
  try {
    console.log("#".repeat(10));
    console.log("auth middleware");
    console.log("#".repeat(10));

    if (token) {
      const decoded = verifyToken(token);
      if (!decoded) {
        res
          .status(401)
          .json({ message: `unauthorized user or expired token key` });
      }
      res.locals.userId = decoded._id;
      next();
      return;
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
    return;
  }
};
module.exports = { authentication };
