const jwt = require("jsonwebtoken");

/**
 * Middleware to authenticate JWT token
 * @name authenticateToken
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next function
 * @returns {void}
 */
function authenticateToken(req) {
  const token = req.headers["authorization"];
  // const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    throw new Error("No token provided");
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    return user;
  } catch (error) {
    throw new Error("Invalid token");
  }
}

module.exports = authenticateToken;
