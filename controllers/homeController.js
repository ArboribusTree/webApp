const Game = require('../models/game')
const Post = require('../models/post')




async function getHomePage(req, res) {
    const posts = await Post.find().sort('desc').limit(5).populate('author')
    res.render('index', {
        posts: posts
    })
}

module.exports = {
    getHomePage
}