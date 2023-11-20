const Game = require('../models/game')

const findGames = async (titles) => {
    const games = await Game.find({ title: { $in: titles } })
    return games
    }

module.exports = findGames