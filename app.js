const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
var cors = require('cors')
const app = express()

mongoose.connect(
    `mongodb+srv://ja:${process.env.ATLAS_PASSWORD}@cluster0-rd7ac.mongodb.net/test?retryWrites=true&w=majority`,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())

const userRoutes = require("./api/routes/users")
const bookRoutes = require("./api/routes/books")
const opinionRoutes = require("./api/routes/opinions")

app.use('/user', userRoutes)
app.use('/book', bookRoutes)
app.use('/opinion', opinionRoutes)

app.use((request, response, next) => {
    const error = new Error('Nie znaleziono')
    error.status = 404

    next(error)
})

app.use((error, request, response, next) => {
    response
        .status(error.status || 500)
        .json({
            error: {
                message: error.message,
            }
        })
})

module.exports = app