const Game = require('../models/game')
const Post = require('../models/post')




async function getHomePage(req, res) {
    const posts = await Post.find().sort('desc').limit(5).populate('author')
    res.render('index', {
        posts: posts
    })
}

const logout = (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err)
      } else {
        res.redirect('/')
      }
    })
  }

module.exports = {
    getHomePage,
    logout,

}