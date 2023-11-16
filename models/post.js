const mongoose = require('mongoose')
const Comment = require('./comment')
//idk what to do with downvotes

const postSchema = new mongoose.Schema({
    id: 
    postTitle: String,
    postedBy: String,
    postDescription: String,
    game: String,
    upvote: Number,
    comments: [Comment],
    commentsNumber: comments.len(),
    createdAt: {
        type: Date,
        immutable: true,
        default: () => Date.now(),
    },
})


module.exports = mongoose.model('Post', postSchema)