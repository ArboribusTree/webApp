const Game = require('../models/game')

async function getGamePage(req, res) {
    const game = await Game.find()
    res.render('games/index', {game: game})
}

module.exports = {
    getGamePage
}