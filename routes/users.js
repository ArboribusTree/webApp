const express = require('express')
const router = express.Router()
const User = require('../models/user')



router.get('/', async (req, res) => {
    let searchOptions = {}
    if (req.query.username != null && req.query.username !== ' '){
        searchOptions.username = new RegExp(req.query.username, 'i')
    }
    try{
        const users = await User.find(searchOptions)
        res.render('users/index', {
            users: users,
            searchOptions: req.query
        })
    } catch{
        res.redirect('/')
    }

})

router.get('/new', (req, res) => {
    res.render("users/new", {user: new User()})

})

router.post('/', async (req, res) => {
    const user = new User({
        username: req.body.username,
        password: req.body.password
      })
      try {
        const newUser = await user.save()
        console.log("create success")
        // res.redirect(`users/${newUser.id}`)
        res.redirect(`users`)
      } catch {
        res.render('users/new', {
          user: user,
          errorMessage: 'Error creating User'
        })
      }
})

module.exports = router