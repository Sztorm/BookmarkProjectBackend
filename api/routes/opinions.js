const express = require('express')
const mongoose = require('mongoose')
const checkAuth = require('../middleware/checkAuth')
const checkIfOpinionIsAlreadyPosted = require('../middleware/checkIfOpinionIsAlreadyPosted')
const Opinion = require('../models/opinion')
const router = express.Router()

router.post(
    '/',
    checkAuth,
    checkIfOpinionIsAlreadyPosted,
    (request, response, next) => {
        const opinion = new Opinion({
            _id: new mongoose.Types.ObjectId(),
            bookId: request.body.bookId,
            userId: request.body.userId,
            date: new Date(),
            rating: request.body.rating,
            comment: request.body.comment,
        })
        opinion
            .save()
            .then(result => {
                response
                    .status(201)
                    .json({
                        message: 'Dodano nową opinię',
                        info: result,
                    })
            })
            .catch(error => console.log(error))
    })

router.get('/:opinionId', (request, response, next) => {
    const id = request.params.opinionId

    Opinion
        .findById(id)
        .exec()
        .then(opinion => {
            response
                .status(200)
                .json({
                    message: `Znalaziono opinię o podanym id: ${id}`,
                    info: opinion,
                })
        })
        .catch(error => {
            console.log(error)
        })
})

router.patch('/:opinionId', checkAuth, (request, response, next) => {
    const id = request.params.opinionId

    Opinion
        .findByIdAndUpdate(
            id, {
            date: new Date(),
            rating: request.body.rating,
            comment: request.body.comment,
        }, {
            new: true
        })
        .exec()
        .then(opinion => {
            response
                .status(200)
                .json({
                    wiadomosc: `Zmieniono opinie o id ${id} na:`,
                    info: opinion,
                })
        })
        .catch(error => {
            console.log(error)
        })
})

router.delete('/:opinionId', checkAuth, (request, response, next) => {
    const id = request.params.opinionId

    Opinion
        .findByIdAndRemove(id)
        .exec()
        .then(opinion => {
            if (opinion) {
                response
                    .status(200)
                    .json({
                        message: `Usunięcie opinii o id ${id}`,
                    })
            }
            else {
                response
                    .status(404)
                    .json({
                        message: 'Brak opinii o podanym Id'
                    })
            }
        })
        .catch(error => {
            console.log(error)
        })
})

module.exports = router