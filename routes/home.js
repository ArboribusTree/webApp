const express = require('express')
const router = express.Router()
const homeController = require('../controllers/homeController.js')

router.get('/', homeController.getHomePage)

//logout route
router.get('/logout', homeController.logout)

module.exports = router