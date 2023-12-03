const fs = require('fs') 
const path = require('path') 
const Post = require('../models/post') 
const Comment = require('../models/comment') 
const removeImagePost = require('../middleware/removeImagePost')  // Import the removeImagePost function
const uploadPath = path.join('public', Post.uploadPath) 


const createPosts = async (req, res) => {

    const fileName = req.file != null ? req.file.filename : null 

    if (!req.session.user) {
        if (fileName !== null)
            removeImagePost(fileName, uploadPath) 
        return res.redirect('../users/login') 
    } else if (!req.body.title || !req.body.postDescription) {
        removeImagePost(fileName, uploadPath) 
        return res.render('posts/createPosts', {
            errorMessage: 'Incomplete Input Data',
        }) 
    }

    try {
        const post = new Post({
            title: req.body.title,
            author: req.session.user,
            postDescription: req.body.postDescription,
            game: req.body.game,
            upvote: 0,
            image: fileName,
        }) 

        await post.save() 
        res.redirect('/posts') 
    } catch {
        if (fileName === null) {
            console.log('missing post image')
            res.render('posts/createPosts', {
                errorMessage: 'Missing Post Image',
            }) 
        } else{
            removeImagePost(fileName, uploadPath) 
            res.render('posts/createPosts', {
                errorMessage: 'error',
            })
        }
    }
}

const getPostById = async (req, res) => {
    const post = await Post.findById(req.params.id)
            .populate({
                path: 'comments',
                populate: {
                    path: 'author', // Assuming 'author' is the field with the objectId
                    model: 'User' // Replace 'User' with your actual User model
                }
            })
            .populate('author')
    res.cookie('postId', post.id, {
        maxAge: 60000,
    }) 
    res.render('posts/posts', {
        post: post,
        upvotesCount: post.upvote,
        downvotesCount: post.downvote
    }) 

    
} 

const createComments = async (req, res) => {
    try{
        const postId = req.cookies.postId 
        let post = await Post.findById(postId) 

        const comment = new Comment({
            author: req.session.user,
            commentDescription: req.body.comment,
            postId: post.id,
        }) 

        post.comments.push(comment.id) 
        await post.save() 
        post = await post.populate('comments') 
        await comment.save() 
        res.redirect(`./${postId}`) 
    } catch {
        if (req.session.user === undefined){
            res.redirect('../users/login')
        }
    }
} 

const getPosts = async (req, res) => {
    try {
        const posts = await Post.find({}).populate('author')
        res.render('posts/index', { posts: posts }) 
    } catch (err){
        console.log(err)
        res.redirect('/') 
    }
} 

const upvotePost = async (req, res) => {

    
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).send('Post not found');
        }
        if(!post.upvoteBy) post.upvoteBy=[];

        if (post.upvoteBy.includes(req.session.user)) {
            console.log('User has already upvoted this post');
            return res.status(400).send('You have already upvoted this post');
        }

        post.upvote += 1;
        post.upvoteBy.push(req.session.user);

        await post.save();
        console.log('Post upvoted successfully');

    } catch (error) {
        console.error('Error upvoting post:', error);
    }
    
    

}


const downvotePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).send('Post not found');
        }
        
       
        if (!post.downvoteBy) post.downvoteBy = [];

        if (post.downvoteBy.includes(req.session.user)) {
           console.log('User has already downvoted this post');
            return res.status(400).send('You have already downvoted this post');
       }

        
        post.downvote += 1;
        post.downvoteBy.push(req.session.user);

        
        await post.save();
        console.log('Post downvoted successfully');

   } catch (error) {
       console.error('Error downvoting post:', error);
    }

    

    
}


module.exports = {
    createPosts,
    getPostById,
    createComments,
    getPosts,
    upvotePost,
    downvotePost  
} 
