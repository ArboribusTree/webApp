const Game = require('../models/game')
const Post = require('../models/post')
const findGames = require('../middleware/findGames')

const titles = ['Cs2', 'Elden Ring', 'Path of Exile']
let trendingGames = findGames(titles)


async function getHomePage(req, res) {
    const posts = await Post.find().sort('desc').limit(5)
    res.render('index', {
        trendingGames: await trendingGames,
        posts: posts
    })
}

module.exports = {
    getHomePage
}