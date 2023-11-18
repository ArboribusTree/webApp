const mongoose = require("mongoose")

const commentSchema = new mongoose.Schema({
    author: String,
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