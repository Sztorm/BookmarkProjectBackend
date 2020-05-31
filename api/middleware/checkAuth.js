const jwt = require('jsonwebtoken')

module.exports = (request, response, next) => {
    try {
        const decoded = jwt.verify(
            request.headers.authorization.split(' ')[1], process.env.JWT_PASS)
        request.userData = decoded
        next()
    }
    catch (error) {
        return response.status(401).json({
            message: 'Błąd uwierzytelnienia'
        })
    }
}