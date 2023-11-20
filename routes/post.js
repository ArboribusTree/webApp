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

module.exports = router 
