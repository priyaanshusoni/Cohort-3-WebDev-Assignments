const jwt = require("jsonwebtoken");

function userMiddleware(req, res, next) {
  const SECRET_KEY = process.env.TOKEN_KEY;
  // Implement user auth logic
  const authHeader = req?.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (token == null) return res.sendStatus(401); // No token present

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403); // Invalid token

    req.user = user;
    next();
  });
}

module.exports = {
  userMiddleware,
};
