const express = require('express')
const router = express.Router()
const User = require('../models/user')

//route to login page
router.get('/login',  (req, res) => {
  res.render('users/login', {user: new User()})
})



//login flag??
router.post('/login', async (req, res) => {
  const user = User({
    username: req.body.username,
    password: req.body.password
  })

  const userCredentials = await User.findOne({username: user.username}).exec()
  console.log(userCredentials)
  try{
    if(userCredentials.username === user.username && userCredentials.password === user.password){
      res.redirect('/users')
    }
  } catch{
    errorMessage: 'Invalid login credentials'
    res.render('users/login', {user: user})
  }

  
})


//route to users/index.ejs
//search users
router.get('/', async (req, res) => {
    let searchOptions = {}
    if (req.query.username != null && req.query.username !== ' '){
        searchOptions.username = new RegExp(req.query.username)
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

//route to users/signup.ejs
router.get('/signup', (req, res) => {
    res.render("users/signup", {user: new User()})

})

//create user and insert in mongoDB
router.post('/signup', async (req, res) => {
    //instantiating new user object based on userSchema
    const user = new User({
        username: req.body.username,
        password: req.body.password
      })
      try {
        console.log('users: ' + user)
        if(await User.countDocuments({username: req.body.username}, {limit: 1}).exec() === 0){
        //save user in the database
        const newUser = await user.save()
        console.log("create success")
        // res.redirect(`users/${newUser.id}`)
        res.redirect('/users')
        } else{
          res.render('users/signup', {
            user: user,
            errorMessage: 'Username already exists'
          })
        }
      } catch {
        res.render('users/signup', {
          user: user,
          errorMessage: 'Error creating User'
        })
      }
})





module.exports = router