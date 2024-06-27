const jwt = require("jsonwebtoken");
const JWT_SECRET = "d0d9dc77406ef8cf1f1d461335680c2699db2354816c8077526441907d76d647";
// module.exports = (req, res, next) => {
//   try {
//     const token = req.headers.authorization.replace("Bearer ", "");
//     const decoded = jwt.verify(token, JWT_SECRET);
//     req.userData = decoded;
//     next();
//   } catch (err) {
//     return res.status(401).json({
//       message: "Authentification Failed"
//     });
//   }
// };

// auth_middleware.js

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  jwt.verify(token.replace('Bearer ', ''), JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to authenticate token' });
    }

    req.userId = decoded.id;
    next();
  });
};

module.exports = verifyToken;