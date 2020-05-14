const Permission = require('../models/permission')
const mongoose = require('mongoose')

//  seed database with demo feature details
const seedDataArticle = async (req, res) => {
  
    // if you wish to edit or add another demo feature add all three roles for best testing (student, admin, teacher)
    const permissions = [
        {feature: 'article', role: 'admin', permissions: {create: true, read: true, write: true, delete: true}},
        {feature: 'article', role: 'student', permissions: {read: true}},
        {feature: 'article', role: 'teacher', permissions: {create: true, read: true, write: true, delete: true}},
        {feature: 'studentdb', role: 'admin', permissions: {create: true, read: true, write: true, delete: true}},
        {feature: 'studentdb', role: 'teacher'},
        {feature: 'studentdb', role: 'student'}
      ];
    
    // seed data into db
    for (permission of permissions) {
      let prems = new Permission(permission)
      prems.save();
    }  
    // seeded!
    res.status(201).json({
        message: 'Database seeded Permission!'
    });
};

//  seed database with demo feature details
const addPermission = async (req, res) => {
    await Permission.find({ feature: req.body.feature, role: req.body.role })
    .exec()
    .then(perm => {
        // checking if regId present in db
        if(perm.length < 1) {
            const prems = new Permission(req.body)
            prems
            .save()
            .then(result => {
              res.status(201).json({
                  message: 'New Permission Created'
              });
            })
            .catch(err => {
              res.status(401).json({
                message: 'Permission creation failed'
              });
            });
        }
        else {
            return res.status(409).json({
                message: 'Permissions already exists'
            });
        }
    })
    .catch(err => {
        res.status(500).json({
            confirmation: 'fail',
            message: err.message
        });
    });
};

// Get permissions details to view all data for admin or developers
const permissions = async (req, res) => {
    Permission.find()                                       
    .then(prems => {
        res.status(201).json({
            confirmation: 'success',
            data: prems
        });
    })
    .catch(err => {
        res.status(401).json({
            confirmation: 'fail',
            message: err.message
        });
    });
};

module.exports = {
    seedDataArticle,
    permissions,
    addPermission,
  }