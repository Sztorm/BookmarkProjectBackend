const User = require('../models/user')

module.exports = (request, response, next) => {
    User
        .findOne({ name: request.body.name})
        .exec()
        .then(user => {
            if (!user) {
                next()
            }
            else {
                response
                .status(409)
                .json({
                    message: 'Nazwa użytkownika jest zajęta.',
                })
            }
        })
        .catch(error => {
            console.log(error)
        })
}