const jwt = require('jsonwebtoken');

// check if the user has logged in before using the services
module.exports = (req, res, next) => {
  try {
    // bearer token
    const token = req.headers.authorization.split(' ')[1];
    // verify it with server
    const decoded = jwt.verify(token, process.env.SECRECT_KEY);
    req.studentData = decoded;
    // continue the control-flow of the code
    next();
  } catch (error) {
    // token was expired or user had made changes in the token
    return res.status(401).json({
      message: 'Auth failed',
    });
  }
};
