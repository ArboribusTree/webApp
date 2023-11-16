const  express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const Post = require('../models/post.js')
const Comment = require('../models/comment.js')
const uploadPath = path.join('public', Post.postImagePath)
const imageMimeTypes = ['images/jpg', 'images/jpeg', 'images/png', 'images/gif']
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback)=>{
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
})

router.get('/createPosts', (req, res) =>{
    res.render('posts/createPosts')
})


router.post('/createPosts', upload.single('imagePost'), async (req, res) =>{
    if(!req.session)
        return res.send(400)
    console.log(req.body)
    const fileName = req.file != null ? req.file.filename: null
    
    const post = new Post({
        title: req.body.title,
        author: req.session.user.username,
        postDescription: req.body.postDescription,
        game: req.body.game,
        upvote: 5,
        comments: null,
        image: fileName

    })

    await post.save()
    res.send(200)
})

router.post('/createComments', async (req, res) => {
    const comment = new Comment({
        author: req.session.user.username,
        commentDescription: req.body.comment
    })
    await comment.save()
    console.log(comment)
    res.send(200)
})

module.exports = router