const express = require('express')
const router = express.Router()
const path = require('path')
const Game = require('../models/game.js')
const gameController = require('../controllers/gameController.js')
const imagePath = path.join('public', Game.uploadPath)

router.get('/', gameController.getGameListPage)
router.get('/:title', gameController.getGamePage)

module.exports = router