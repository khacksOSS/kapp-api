const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1]
        const decoded = jwt.verify(token, process.env.SECRECT_KEY_STUDENT)
        req.studentData = decoded
        next()
    }
    catch(error) {
        return res.status(401).json({
            message: 'Auth failed'
        })
    }
}