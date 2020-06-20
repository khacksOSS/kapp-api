const Permission = require('../models/permission');
const jwt = require('jsonwebtoken');

// check wheather a user has proper permissions for accessing the feature
module.exports = (req, res, next) => {
  try {
    // get the bearer token from headers
    const token = req.headers.authorization.split(' ')[1];
    // get the feature to be accessed from headers
    const requestFeature = req.headers.feature;
    // decode the token to get the data
    const decoded = jwt.decode(token, { complete: true });
    // data is stored is in playload
    const payloadData = decoded.payload;

    // get all the data with field feature matching request feature
    Permission.find({ feature: requestFeature })
      .exec()
      .then(prems => {
        // from the data extracted get only the data with specified role in payloadData role
        let access = [prems.find(person => person.role === payloadData.role)];
        // get false default for allow
        let allow = false;
        // array access will have only one record from which check for permissions to create, etc
        if (req.method == 'POST' && access[0].permissions.create) {
          allow = true;
        } else if (req.method == 'GET' && access[0].permissions.read) {
          allow = true;
        } else if (
          (req.method == 'PUT' || req.method == 'PATCH') &&
          access[0].permissions.write
        ) {
          allow = true;
        } else if (req.method == 'DELETE' && access[0].permissions.delete) {
          allow = true;
        }
        // if true then the next function will help in control-flow code
        if (allow) {
          next();
        } else {
          return res.status(401).json({
            message: 'Access denied',
          });
        }
      })
      // server internal error
      .catch(err => {
        console.log(err);
        res.status(500).json({
          message: err,
        });
      });
  } catch (error) {
    return res.status(401).json({
      message: 'Access denied',
    });
  }
};
