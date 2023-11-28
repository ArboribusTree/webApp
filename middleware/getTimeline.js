const User = require('../models/user')
const Post = require('../models/post')
const Comment = require('../models/comment')


async function getTimeline (userId){
    try {
        const user = await User.findById(userId)
        const posts = await Post.find({author: user}).populate({
            path: 'comments',
            populate: {
                path: 'author',
                model: 'User' 
            }
        })
        .populate('author').limit(5)
        const comments = await Comment.find({author: user}).populate('author').sort({createdAt:'desc'}).limit(5)
        

        let timeline = [...posts, ...comments].sort((a, b) => b.createdAt - a.createdAt)

        timeline = timeline.slice(0, 5)
        
        return { posts, comments, timeline}
    } catch (error){
        console.error(error)
    }

    
}

module.exports = getTimeline 