// routes/profileRoutes.js
const express = require('express')
const router = express.Router()
const path = require('path')
const profileController = require('../controllers/profileController')
const User = require('../models/user')
const createMulterConfig = require('../middleware/multerConfig')

const multerConfig = createMulterConfig(path.join('public', User.uploadPath))

router.get('/', profileController.getProfilePage)
router.get('/:id', profileController.getUserProfile)
router.get('/:id/posts', profileController.getUserPosts)
router.get('/:id/comments', profileController.getUserComments)
router.get('/:id/edit', profileController.getEditProfilePage)
router.put('/:id', multerConfig.upload.single('pfp'), profileController.updateProfile)

module.exports = router;
