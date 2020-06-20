const Student = require('../models/student');
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// courses
const BTech = ['CS', 'EE', 'EC', 'ME'];

// make required data for the student db
function makeData(data) {
  let dept_demo = data.regId.match(/[A-Z]+/g);
  let dept = dept_demo[1];
  let year_demo = data.regId.match(/\d+/g);
  let year = Math.abs(
    parseInt(new Date().getFullYear().toString().substr(2, 2)) - year_demo[0]
  );
  let programme;
  if (BTech.includes(dept)) programme = 'BTech';
  return { dept, year, programme };
}

//  seed database with demo user details
const clearDataUser = async (req, res) => {
  // to clear the database
  Student.collection.drop();

  // seed one user for dev purpose
  const student = {
    name: 'A',
    regId: 'URK17CS401',
    macAddress: 'khacks1',
    groups: ['nss'],
  };
  let { dept, year, programme } = makeData(student);
  bcrypt.hash(student.macAddress, 10, (err, hash) => {
    if (err) {
      return res.status(500).json({
        message: err,
      });
    } else {
      const user = new Student({
        name: student.name,
        regId: student.regId,
        macAddress: hash,
        programme: programme,
        year: year,
        dept: dept,
        groups: student.groups,
      });
      user.save();
    }
  });

  // Deleted and one user seeded
  res.status(201).json({
    message: 'success',
  });
};

// Get users details to view all data for developers
const details = async (req, res) => {
  Student.find()
    .then(users => {
      res.status(201).json({
        confirmation: 'success',
        data: users,
      });
    })
    .catch(err => {
      res.status(401).json({
        confirmation: 'fail',
        message: err.message,
      });
    });
};

// user signup
// if we have nodemailer then we will send verification token in signup for kmail verification
// and for kmail domain verification we can use the regex so avoiding and protecting from backend from non kmail domain registration
const signup = async (req, res) => {
  await Student.find({ regId: req.body.regId })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: 'ID Already Exists',
        });
      } else {
        // verified checking so someone dosen't use body to change the gmail verification as true without verification
        if (typeof req.body.verified === 'undefined') {
          let { dept, year, programme } = makeData(req.body);
          bcrypt.hash(req.body.macAddress, 10, (err, hash) => {
            if (err) {
              return res.status(500).json({
                message: err,
              });
            } else {
              const user = new Student({
                name: req.body.name,
                regId: req.body.regId,
                macAddress: hash,
                programme: programme,
                year: year,
                dept: dept,
                groups: req.body.groups,
              });
              user
                .save()
                .then(() => {
                  res.status(201).json({
                    message: 'New Account Created',
                  });
                })
                .catch(() => {
                  res.status(401).json({
                    message: 'Account creation failed inefficient data',
                  });
                });
            }
          });
        } else {
          // verified was specified in body which is not allowed
          res.status(401).json({
            message: 'Invalid data send',
          });
        }
      }
    })
    .catch(err => {
      res.status(500).json({
        error: err,
      });
    });
};

// user verification
const verification = async (req, res) => {
  // till we implement nodemailer or anyother think for security purpose we will use this for dev purpose
  await Student.findOneAndUpdate({ regId: req.body.regId }, { verified: true })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: 'Kindly Register first',
        });
      } else {
        return res.status(201).json({
          message: 'Verified',
        });
      }
    })
    .catch(() => {
      res.status(500).json({
        message: 'Verification failed',
      });
    });
};

// user login
const login = async (req, res) => {
  await Student.find({ regId: req.body.regId, verified: true })
    .exec()
    .then(user => {
      // checking if regId present in db
      if (user.length < 1) {
        return res.status(401).json({
          message: 'Kindly Register first or verify kmail',
        });
      }
      // use bcrypt to encrypt the mac addreess entered by user and compare
      bcrypt.compare(req.body.macAddress, user[0].macAddress, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: 'Auth failed',
          });
        }
        // if true create a token with regId, name and role
        if (result) {
          const token = jwt.sign(
            {
              regId: user[0].regId,
              name: user[0].name,
              role: user[0].role,
            },
            process.env.SECRECT_KEY,
            {
              expiresIn: '1h',
            }
          );
          return res.status(201).json({
            message: 'Auth successful',
            token: token,
          });
        }
        // login from non registered device
        res.status(401).json({
          message: 'Auth failed',
        });
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err,
      });
    });
};

module.exports = {
  clearDataUser,
  details,
  signup,
  verification,
  login,
};
