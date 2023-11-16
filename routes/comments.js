const express = require('express')
const router = express.Router()
const Comment = require('../models/comment')


router.post('/', (req, res) => {
    if(req.body.comment !== ""){
        Comment.
    }
})

module.exports = router