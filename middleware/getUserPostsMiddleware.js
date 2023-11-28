const Post = require('../models/post');

async function getUserPostsMiddleware(req, res, next) {
    try {
        let post = await Post.findById(req.params.id)
            .populate({
                path: 'comments',
                populate: {
                    path: 'author',
                    model: 'User' 
                }
            })
            .populate('author');
        res.cookie('post', post, {
            maxAge: 86400000,
        });

        next();
    } catch (error) {
        // Handle errors
        console.error('Error in getUserPostsMiddleware:', error);
        
    }
}

module.exports = getUserPostsMiddleware;
