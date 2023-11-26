const mongoose = require("mongoose")
const User = require('./user')
const commentSchema = new mongoose.Schema({
    author: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User'
    },
    commentDescription: String,
    createdAt: {
        type: Date,
        immutable: true,
        default: Date.now(),
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
})


module.exports = mongoose.model('Comment', commentSchema)