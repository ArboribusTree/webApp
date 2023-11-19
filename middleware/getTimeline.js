const User = require('../models/user')
const Post = require('../models/post')
const Comment = require('../models/comment')


async function getTimeline (userId){
    try {
        const user = await User.findById(userId)
        const posts = await Post.find({author: user.username}).sort({createdAt:'desc'})
        const comments = await Comment.find({author: user.username}).sort({createdAt:'desc'})

        const timeline = [...posts, ...comments].sort((a, b) => b.createdAt - a.createdAt)
        
        return { posts, comments, timeline}
    } catch (error){
        console.error(error)
    }

    
}

module.exports = getTimeline 