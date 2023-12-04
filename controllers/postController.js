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
            res.render('posts/createPosts', {
                errorMessage: 'Missing Post Image',
            }) 
        }
        removeImagePost(fileName, uploadPath) 
        res.render('posts/createPosts', {
            errorMessage: 'error',
        })
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

const editPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        res.render('posts/edit', { post })
    } catch (error) {
        console.error(error)
        res.status(500).send('Internal Server Error')
    }
}

const updatePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (post.author.equals(req.session.user._id)) {
            post.title = req.body.title
            post.postDescription = req.body.postDescription
            post.game = req.body.game

            await post.save()
            res.redirect('/posts')
        } else {
            res.status(403).send('Forbidden')
        }
    } catch (error) {
        console.error(error)
        res.status(500).send('Internal Server Error')
    }
}


async function getEditCommentPage(req, res) {
    const commentId = req.params.id

    try {
        const comment = await Comment.findById(commentId)

        if (!comment) {
            return res.status(404).send('Comment not found')
        }

        
        const post = await Post.findOne({ comments: commentId })

        res.render('comments/editComment', { comment, post })
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error')
    }
}

async function updateComment(req, res) {
    const commentId = req.params.id
    const updatedCommentDescription = req.body.editedComment

    try {
        const comment = await Comment.findByIdAndUpdate(commentId, { commentDescription: updatedCommentDescription })

        if (comment) {
            
            const post = await Post.findOne({ comments: comment._id })

            if (post) {
                
                return res.redirect(`/posts/${post._id}`)
            } else {
                
                return res.status(404).send('Post not found')
            }
        } else {
           
            return res.status(404).send('Comment not found')
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error')
    }
}

async function deleteComment(req, res) {
    const commentId = req.params.id;

    try {
        
        const comment = await Comment.findById(commentId).populate('postId')

        if (!comment) {
            return res.status(404).send('Comment not found')
        }

        
        if (comment.author[0].equals(req.session.user._id)) {
           
            const postId = comment.postId._id
            const post = await Post.findById(postId)
            
            if (!post) {
                return res.status(404).send('Post not found')
            }

            post.comments.pull(commentId)
            await post.save()

            
            await Comment.deleteOne({ _id: commentId })

            console.log('Comment deleted successfully.')
            return res.redirect(`/posts/${postId}`)
        } else {
            console.log('User is not authorized to delete this comment.')
            return res.status(403).send('Forbidden')
        }
    } catch (error) {
        console.error('Error deleting comment:', error)
        return res.status(500).send('Internal Server Error')
    }
}

module.exports = {
    createPosts,
    getPostById,
    createComments,
    getPosts,
    editPost,
    updatePost,
    getEditCommentPage,
    updateComment,
    deleteComment,
} 
