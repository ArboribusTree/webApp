const mongoose = require('mongoose')
const Comment = require('./comment')
const postImagePath = 'uploads/postImages'
//idk what to do with downvotes

const postSchema = new mongoose.Schema({
    title: String,
    author: String,
    postDescription: String,
    game: String,
    upvote: Number,
    comments: {
        type: [mongoose.Schema.Types.ObjectId],
        default: null
    },
    createdAt: {
        type: Date,
        immutable: true,
        default: Date.now
    },
    image: {
        type: String,
        // required: true
    }
})


module.exports = mongoose.model('Post', postSchema)
module.exports.postImagePath = postImagePath