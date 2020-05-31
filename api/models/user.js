const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    _id: { 
        type: mongoose.Types.ObjectId,
        required: true,
    },
    email: { 
        type: String,
        required: true,
        match: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/ 
    },
    name: {
        type: String,
        required: true,
        match: /^[a-zA-Z0-9_-]{5,32}$/ 
    },
    password: { 
        type: String,
        required: true,
    },
})
module.exports = mongoose.model('User', userSchema)