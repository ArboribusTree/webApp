const fs = require('fs');
const path = require('path');
const Post = require('../models/post');
const Comment = require('../models/comment');
const removeImagePost = require('../middleware/removeImagePost'); // Import the removeImagePost function
const uploadPath = path.join('public', Post.uploadPath);

const createPosts = async (req, res) => {
    

    const fileName = req.file != null ? req.file.filename : null;

    if (!req.session.user) {
        removeImagePost(uploadPath, fileName);
        return res.redirect('../users/login');
    } else if (!req.body.title || !req.body.postDescription) {
        removeImagePost(uploadPath, fileName);
        return res.render('posts/createPosts', {
            errorMessage: 'Incomplete Input Data',
        });
    }

    try {
        const post = new Post({
            title: req.body.title,
            author: req.session.user.username,
            postDescription: req.body.postDescription,
            game: req.body.game,
            upvote: 5,
            image: fileName,
        });

        await post.save();
        res.redirect('/posts');
    } catch {
        if (fileName === null) {
            res.render('posts/createPosts', {
                errorMessage: 'Missing Post Image',
            });
        }
        removeImagePost(uploadPath, fileName);
        res.render('posts/createPosts', {
            errorMessage: 'error',
        });
    }
};

const getPostById = async (req, res) => {
    const post = await Post.findById(req.params.id).populate('comments');
    res.cookie('postId', post.id, {
        maxAge: 60000,
    });
    res.render('posts/posts', {
        post: post,
    });
};

const createComments = async (req, res) => {
    const postId = req.cookies.postId;
    let post = await Post.findById(postId);

    const comment = new Comment({
        author: req.session.user.username,
        commentDescription: req.body.comment,
        postId: post.id,
    });

    post.comments.push(comment.id);
    await post.save();
    post = await post.populate('comments');
    await comment.save();
    res.redirect(`./${postId}`);
};

const getPosts = async (req, res) => {
    try {
        const posts = await Post.find({});
        res.render('posts/index', { posts: posts });
    } catch {
        res.redirect('/');
    }
};

module.exports = {
    createPosts,
    getPostById,
    createComments,
    getPosts,
};
