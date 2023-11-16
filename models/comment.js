const mongoose = require("mongoose")

const commentSchema = new mongoose.Schema({
    author: String,
    commentDescription: String,
    createdAt: {
        type: Date,
        immutable: true,
        default: Date.now(),
    }
})


module.exports = mongoose.model('Comment', commentSchema)