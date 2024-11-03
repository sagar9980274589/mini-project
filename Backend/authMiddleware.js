const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).send({ message: 'Unauthorized' });
  }
  try {
    const decoded = jwt.verify(token, 'your_jwt_secret'); // Use your secret key here
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).send({ message: 'Unauthorized' });
  }
};

module.exports = authMiddleware;
