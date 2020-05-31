const mongoose = require('mongoose')

const opinionSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    bookId: {
        type: String,
        required: true,
    },
    userId: mongoose.Types.ObjectId,
    date: {
        type: Date,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 10,
    },
    comment: { 
        type: String,
        required: false,
    }
})
module.exports = mongoose.model('Opinion', opinionSchema)