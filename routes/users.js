const express = require('express')
const router = express.Router()
const User = require('../models/user')



router.get('/', (req, res) => {
    res.render('users/index')

})

router.get('/new', (req, res) => {
    res.render("users/new", {user: new User()})

})

router.post('/', async (req, res) => {
    const user = new User({
      name: req.body.name
    })
    try{
        const newUser = await user.save()
        res.redirect(`users`)
    } catch{
        res.render('users/new', {
            user: user,
            errorMessage: 'Error creating User'
        })
    }
  })

module.exports = router