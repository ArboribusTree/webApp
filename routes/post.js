const  express = require('express')
const router = express.Router()
const multer = require('multer')                        
const path = require('path')
const fs = require('fs')
const Post = require('../models/post.js')
const Comment = require('../models/comment.js')
const uploadPath = path.join('public', Post.uploadPath)                  //concatenates path
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']             //used to specify file extensions of images
//used to direct uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log(file)
        cb(null, uploadPath)
    },
    filename: (req, file, cb) => {
        console.log(file)
        cb(null, Date.now() + path.extname(file.originalname))
    },
    
})
console.log(uploadPath)
//used to only accept image files 
function filter (req, file, callback) {
    console.log('file.mimetype: ' + file.mimetype)
    callback(null, imageMimeTypes.includes(file.mimetype))
}
//upload is now a multer object
const upload = multer({
    storage: storage, 
    fileFilter: filter})
    console.log(upload)
//routes to post create page
router.get('/createPosts', (req, res) =>{
    res.render('posts/createPosts')
})

//creates a post
router.post('/createPosts', upload.single('imagePost'), async (req, res) =>{    //upload.single('imagePost') is the method for saving image locally
               //stores file name
 const fileName = req.file != null ? req.file.filename: null                    //gets filename
    if(!req.session.user){                                                      //checks if user is logged in
        removeImagePost(fileName)
        return res.redirect('../users/login')                                   //makes the log in
    } else if(!req.body.title || !req.body.postDescription){
        removeImagePost(fileName)
        return res.render('posts/createPosts', {
            //post: post,
            errorMessage: 'Incomplete Input Data'
        })
    }
    try{
        //creates a Post object
        const post = new Post({
            title: req.body.title,
            author: req.session.user.username,
            postDescription: req.body.postDescription,
            game: req.body.game,
            upvote: 5,
            image: fileName

        })
        
        await post.save()
        res.redirect('/posts')
    } catch {
        if(fileName === null){
            console.log('has image')
            res.render('posts/createPosts', {
                //post: post,
                errorMessage: 'Missing Post Image'
            })
        }
        removeImagePost(fileName)
        res.render('posts/createPosts', {
            errorMessage: 'error'
        })
    }
})

function removeImagePost(fileName){
    fs.unlink(path.join(uploadPath, fileName), err => {
        if (err) console.error(err)
    })
}

router.post('/createComments', async (req, res) => {
    console.log(req.cookies.postId)
    const post = await Post.findById(req.cookies.postId)
    
    const comment = new Comment({
        author: req.session.user.username,
        commentDescription: req.body.comment,
        postId: post.id
    })
    post.comments.push(comment.id)
    await post.save()
    const comments = await Post.findById(post.id).populate('comments');
    await comment.save()
    res.redirect(`./${req.cookies.postId}`, {
        post: post,
        comments: comments
    })
})

router.get('/', async (req, res) => {
    try {
        
        const posts = await Post.find({})
        res.render('posts/index', { posts: posts})
    } catch{
        res.redirect('/')
    }
})

router.get('/:id', async (req, res) => {
    const post = await Post.findById(req.params.id).populate('comments')
    res.cookie('postId', post.id, {
        maxAge: 60000
    })
    res.render('posts/posts', {
        post: post
  })
})

module.exports = router