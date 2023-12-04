const express = require('express') 
const router = express.Router() 
const path = require('path')
const postController = require('../controllers/postController') 
const Post = require('../models/post')
const createMulterConfig = require('../middleware/multerConfig')

const multerConfig = createMulterConfig(path.join('public', Post.uploadPath))

router.get('/createPosts', (req, res) => {
    res.render('posts/createPosts') 
}) 

router.post('/createPosts', multerConfig.upload.single('imagePost'), postController.createPosts) 

router.get('/:id', postController.getPostById) 

router.post('/createComments', postController.createComments) 

router.get('/', postController.getPosts) 


router.get('/edit/:id', postController.editPost);


router.post('/:id/edit', postController.updatePost);


router.post('/:id/delete', async (req, res) => {
    const postId = req.params.id

    try {
        console.log('Deleting post with ID:', postId);

        const post = await Post.findById(postId)

       
        if (post.author.equals(req.session.user._id)) {
            
            await Post.deleteOne({ _id: postId })
            console.log('Post deleted successfully.')
            res.redirect('/posts')
        } else {
            console.log('User is not authorized to delete this post.')
            
            res.status(403).send('Forbidden')
        }
    } catch (error) {
        console.error('Error deleting post:', error)
        res.status(500).send('Internal Server Error')
    }
})

router.get('/:postId/comments/edit/:id', postController.getEditCommentPage)

router.post('/:postId/comments/:id/edit', postController.updateComment)

router.post('/:postId/comments/:id/delete', postController.deleteComment)

module.exports = router 
