const Student = require('../models/student')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// courses
BTech = ['CS', 'EE', 'EC', 'ME']

// make required data for the student db
function makeData(data) {
  let dept_demo = data.regId.match(/[A-Z]+/g)
  let dept = dept_demo[1]
  let year_demo = data.regId.match(/\d+/g)
  let year = Math.abs(parseInt(new Date().getFullYear().toString().substr(2,2)) - year_demo[0])
  let programme
  if (BTech.includes(dept))
    programme = 'BTech'
  return {dept, 
    year, 
    programme
  }
}

// hash the macAddress using bcrypt for storing in db
function saveStudent(studentData) {
  let {dept, year, programme} = makeData(studentData)
  bcrypt.hash(studentData.macAddress, 10, (err, hash) => {
    if(err) {
        return err
    }
    else {
        const user = new Student({
          name: studentData.name,
          regId: studentData.regId,
          macAddress: hash,
          programme: programme,
          year: year,
          dept: dept,
          groups: studentData.groups,
        })
        user.save()
      } 
  })
}

//  seed database with demo user details
const seedDataUser = async (req, res) => {
  // to clear the database
  mongoose.connection.dropDatabase();

  // if you wish to edit or add another demo user add in same format with your required data for testing
  const students = [
      { name: 'A', regId: 'URK17CS401', macAddress: 'khacks1', groups: ['nss']},
      { name: 'B', regId: 'URK16CS402', macAddress: 'khacks2' , groups: ['nss', 'CS201']},
      { name: 'C', regId: 'URK18CS403', macAddress: 'khacks3' , groups: ['nss']},
      { name: 'D', regId: 'URK19CS404', macAddress: 'khacks4' , groups: ['nss']},
      { name: 'E', regId: 'URK17EC405', macAddress: 'khacks5' , groups: ['ncc']},
      { name: 'F', regId: 'URK18EC406', macAddress: 'khacks6' , groups: ['ncc']},
      { name: 'G', regId: 'URK16EC407', macAddress: 'khacks7' , groups: ['ncc']},
      { name: 'H', regId: 'URK19EC408', macAddress: 'khacks8' , groups: ['ncc']},
    ];
  
  // seed data into db
  for (student of students) {
    saveStudent(student)
  }  
  // seeded!
  res.send('Database seeded!');
};

// Get users details to view all data for developers 
const details = async (req, res) => {
  Student.find()                                       
  .then(users => {
      res.json({
          confirmation: 'success',
          data: users
      });
  })
  .catch(err => {
      res.json({
          confirmation: 'fail',
          message: err.message
      });
  });
};

// user login
const login = async (req, res, next) => {
  await Student.find({ regId: req.body.regId})
  .exec()
  .then(user => {
    // checking if regId present in db
    if(user.length < 1) {
        // save new app user into db after the frontend has verified with ldap and ask user to login 
        saveStudent(req.body)
        return res.status(201).json({
          message: 'Registered successfully login again'
      })
    }
    // use bcrypt to encrypt the mac addreess entered by user and compare
    bcrypt.compare(req.body.macAddress, user[0].macAddress, (err, result) => {
      if(err) {
          return res.status(401).json({
              message: 'Auth failed'
          })
      };
      // if true create a token with regId and name
      if(result) {
          const token = jwt.sign({
              regId: user[0].regId,
              name: user[0].name
          },
          process.env.SECRECT_KEY_STUDENT,{
              expiresIn: '1h'
          });
          return res.status(201).json({
              message: 'Auth successful',
              token: token
          });
      };
      // login from non registered device
      res.status(401).json({
          message: 'Auth failed'
      });
    });
  })
  .catch(err => {
    res.status(500).json({
      error: err
    })
  });
};

module.exports = {
  seedDataUser,
  details,
  login,
}