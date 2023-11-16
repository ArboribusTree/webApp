const mongoose = require('mongoose')

const gameSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    image: String//change to path
})