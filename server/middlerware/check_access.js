const Permission = require('../models/permission')
const jwt = require('jsonwebtoken')

module.exports =  (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1]
        const requestFeature = req.headers.feature
        const decoded = jwt.decode(token, {complete: true})
        const payloadData = decoded.payload

        Permission.find({feature: requestFeature})
        .exec()
        .then(prems => {
            let access = [prems.find(person  => person.role === payloadData.role)];
            let allow = false;
            if (req.method == "POST" && access[0].permissions.create) {
                allow = true;
            }
            else if (req.method == "GET" && access[0].permissions.read) {
                allow = true;
            }
            else if ((req.method == "PUT" || req.method == "PATCH") && access[0].permissions.write) {
                allow = true;
            }
            else if (req.method == "DELETE" && access[0].permissions.delete) {
                allow = true;
            }

            if (allow) {
                next();
            }
            else {
                return res.status(401).json({
                    message: 'Access denied'
                })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                message: err
            });
        });
    }
    catch(error) {
        return res.status(401).json({
            message: 'Access denied'
        })
    }
}