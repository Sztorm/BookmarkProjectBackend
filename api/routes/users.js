const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const Opinion = require('../models/opinion')
const checkAuth = require('../middleware/checkAuth')
const checkIfUserNameIsTaken = require('../middleware/checkIfUserNameIsTaken')
const router = express.Router()

const userNameRegex = /^[a-zA-Z0-9_-]{5,32}$/
const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

router.post('/signup', checkIfUserNameIsTaken, (request, response, next) => {
    User.findOne({ email: request.body.email })
        .exec()
        .then(user => {
            if (user) {
                response.status(409)
                    .json({ message: "Taki email już istnieje." })
            }
            else {
                bcrypt.hash(request.body.password, 10, (error, hash) => {
                    if (error) {
                        return response.status(500)
                            .json({ error: error })
                    }
                    else {
                        const newUser = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: request.body.email,
                            name: request.body.name,
                            password: hash
                        })
                        newUser.save()
                            .then(result => {
                                response.status(201)
                                    .json({ message: 'Stworzono użytkownika' })
                            })
                            .catch(error => {
                                response.status(500)
                                    .json({ error: error })
                            })
                    }
                })
            }
        })
        .catch(error => {
            response.status(500)
                .json({ error: error })
        })
})

const login = (user, request, response, next) => {
    if (!user) {
        response.status(401)
            .json({ message: "Błąd uwierzytelnienia" })
    }
    else {
        bcrypt.compare(request.body.password, user.password, (error, result) => {
            if (error) {
                return response.status(401)
                    .json({ message: "Błąd uwierzytelnienia" })
            }
            if (result) {
                const token = jwt.sign({
                    email: user.email,
                    name: user.name,
                    userId: user._id
                },
                    process.env.JWT_PASS, {
                    expiresIn: "1h",
                }
                );
                return response.status(200)
                    .json({
                        message: "Zalogowano.",
                        token: token
                    })
            }
            else {
                return response.status(401)
                    .json({ message: "Błąd uwierzytelnienia" })
            }
        })
    }
}

router.post('/login', (request, response, next) => {
    if (request.body.email) {
        User.findOne({ email: request.body.email })
            .exec()
            .then(user => login(user, request, response, next))
            .catch(error => {
                response.status(500)
                    .json({ error: error })
            })
    }
    else if (request.body.name) {
        User.findOne({ name: request.body.name })
            .exec()
            .then(user => login(user, request, response, next))
            .catch(error => {
                response.status(500)
                    .json({ error: error })
            })
    }
    else if (request.body.nameOrEmail) {
        const nameOrEmail = request.body.nameOrEmail

        if (nameOrEmail.match(userNameRegex)) {
            User.findOne({ name: nameOrEmail })
                .exec()
                .then(user => login(user, request, response, next))
                .catch(error => {
                    response.status(500)
                        .json({ error: error })
                })
        }
        else if (nameOrEmail.match(emailRegex)) {
            User.findOne({ email: nameOrEmail })
                .exec()
                .then(user => login(user, request, response, next))
                .catch(error => {
                    response.status(500)
                        .json({ error: error })
                })
        }
        else {
            return response.status(401)
                .json({ error: 'Błąd uwierzytelnienia' })
        }
    }
    else {
        return response.status(422)
            .json({ error: 'Pola żądania są nieznane.' })
    }
})

router.get('/:userId', (request, response, next) => {
    const userId = request.params.userId

    User.findById(userId)
        .exec()
        .then(user => {
            response
                .status(200)
                .json({
                    message: `Znalaziono użytkownika o id: ${userId}`,
                    info: user,
                })
        })
        .catch(error => {
            console.log(error)
        })
})

router.get('/:userId/opinions', (request, response, next) => {
    const userId = request.params.userId

    Opinion.find({ userId })
        .exec()
        .then(opinions => {
            response
                .status(200)
                .json({
                    message: `Znalaziono opinie użytkownika o id: ${userId}`,
                    info: opinions,
                })
        })
        .catch(error => {
            console.log(error)
        })
})

router.delete('/:userId', checkAuth, (request, response, next) => {
    const userId = request.params.userId

    User.findByIdAndDelete(userId)
        .exec()
        .then(result => {
            response.status(200)
                .json({ message: `usunięto użytkownika o id: ${userId}` })
        })
        .catch(error => {
            response.status(500)
                .json({ error: error })
        })
})

module.exports = router