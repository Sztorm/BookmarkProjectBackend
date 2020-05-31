const express = require('express')
const mongoose = require('mongoose')
const Opinion = require('../models/opinion')
const router = express.Router()

router.get('/:bookId/opinions', (request, response, next) => {
    const bookId = request.params.bookId

    Opinion
        .find({ bookId })
        .exec()
        .then(opinions => {
            response
                .status(200)
                .json({
                    message: `Znalaziono opinie o podanym id książki: ${bookId}`,
                    info: opinions,
                })
        })
        .catch(error => {
            console.log(error)
        })
})

module.exports = router