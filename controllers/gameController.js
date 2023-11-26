const Game = require('../models/game')
const Post = require('../models/post')


async function getGameListPage(req, res) {
    const games = await Game.find()
    
    const gamesByGenre = {}
    games.forEach(game => {
        const genre = game.genre
        if(!gamesByGenre[genre]){
            gamesByGenre[genre] = []
        }
        gamesByGenre[genre].push(game)
    })
    res.render('games/index', {
        games: games,
        gamesByGenre: gamesByGenre
    })
}   

async function getGamePage(req, res) {
    const title = req.params.title
    const game = await Game.findOne({title: title})
    const posts = await Post.find({game: game.title})
    res.render('games/page', {
        game: game,
        posts: posts
    })
}

module.exports = {
    getGameListPage,
    getGamePage
}