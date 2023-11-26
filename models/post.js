const mongoose = require('mongoose')
const Comment = require('./comment')
const User = require('./user')
const path = require('path')
const uploadPath = 'uploads/postImages'
//idk what to do with downvotes

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    postDescription: {
        type: String,
        required: true
    },
    game: String,
    upvote: Number,
    comments: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Comment',
        default: []
    },
    createdAt: {
        type: Date,
        immutable: true,
        default: Date.now
    },
    image: {
        type: String,
        required: true
    }
})

postSchema.virtual('postImagePath').get(function() {
    return this.image ? path.join('/', uploadPath, this.image) : null 
}) 

module.exports = mongoose.model('Post', postSchema)
module.exports.uploadPath = uploadPath