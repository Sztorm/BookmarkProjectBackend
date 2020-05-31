const Opinion = require('../models/opinion')

module.exports = (request, response, next) => {
    const userId = request.body.userId
    const bookId = request.body.bookId

    Opinion
        .find({ userId, bookId })
        .exec()
        .then(opinions => {
            if (opinions.length == 0) {
                next()
            }
            else {
                response
                .status(403)
                .json({
                    message: `Użytkownik nie może dodać więcej opinii niż jedną.`,
                })
            }
        })
        .catch(error => {
            console.log(error)
        })
}