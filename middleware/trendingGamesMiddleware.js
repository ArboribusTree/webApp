const findGames = require('./findGames');

const titles = ['Cs2', 'Elden Ring', 'Path of Exile', 'FF16'];

async function trendingGamesMiddleware(req, res, next) {
  try {
    const trendingGames = await findGames(titles)
    res.locals.trendingGames = trendingGames
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = trendingGamesMiddleware
