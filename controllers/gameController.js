const Game = require('../models/game')
const Post = require('../models/post')
const findGames = require('../middleware/findGames')

const titles = ['Cs2', 'Elden Ring', 'Path of Exile']
let trendingGames = findGames(titles)

async function getGameListPage(req, res) {
    const game = await Game.find()
    console.log(game)
    res.render('games/index', {game: game})
}

async function getGamePage(req, res) {
    const title = req.params.title
    const game = await Game.findOne({title: title})
    const posts = await Post.find({game: game.title})
    res.render('games/page', {
        game: game,
        trendingGames: await trendingGames,
        posts: posts
    })
}

module.exports = {
    getGameListPage,
    getGamePage
}