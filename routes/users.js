// routes/users.js

const express = require('express') 
const router = express.Router() 
const userController = require('../controllers/userController') 

router.get('/login', userController.getLoginPage) 
router.post('/login', userController.login) 

router.get('/', userController.getUsers) 

router.get('/signup', userController.getSignupPage) 
router.post('/signup', userController.signup) 

module.exports = router  
