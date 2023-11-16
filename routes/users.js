const express = require('express')
const router = express.Router()
const User = require('../models/user')
const { hashPassword, comparePassword } = require('../controllers/hasher');

//route to login page
router.get('/login',  (req, res) => {
  res.render('users/login', {user: new User()})
})





//login flag??
router.post('/login', async (req, res) => {
  
    const {username, password} = req.body
    
    if(!username || !password){
      return res.render('users/login', {
        username: user.username, 
        password: user.password,
        errorMessage: 'Invalid Login'
      })
    } 

    const user = await User.findOne({username})

    if (!user){
      return res.render('users/login', {
        username: user.username, 
        password: user.password,
        errorMessage: 'Invalid Login'
      })
    }
    console.log("this is password: " + password)
    console.log("this is user.password: " + user)
    const isValid = comparePassword(password, user.password)
    if(isValid){
      console.log("Auth success")
      req.session.user = user
      return res.render('users/index', {user: user})
    } else {
      console.log("Auth denied")
      return res.render('users/login', {
        user: user,
        errorMessage: 'Invalid Login'
      })
    }


  
})


//route to users/index.ejs
//search users
router.get('/', async (req, res) => {
  try{
  console.log(req.session.user.username)
  } catch {
    
  }
    res.render('users/index')

})

//route to users/signup.ejs
router.get('/signup', (req, res) => {
    res.render("users/signup", {user: new User()})

})

//create user and insert in mongoDB
router.post('/signup', async (req, res) => {
    const user = new User({
      username: req.body.username,
      password: req.body.password
    })
    if(!user.username || !user.password){
      user.password = ""
      return res.render('users/signup', {
        user: user,
        errorMessage: "Incomplete Credentials"
      })
    }
    try{
      const hashedPassword = hashPassword(user.password)
      user.password = hashedPassword
      console.log('This is hashed password: ' + user.password)
      await user.save()
      res.redirect('/login')
    } catch {
      user.password = ""
      res.render('users/signup', {
        user: user,
        errorMessage: 'Username already exists'
      })
    }
})


//for searching


// let searchOptions = {}
//     console.log(req.cookies)
//     if (req.query.username != null && req.query.username !== ' '){
//         searchOptions.username = new RegExp(req.query.username)
//     }
//     try{
//         const users = await User.find(searchOptions)
//         res.render('users/index', {
//             users: users,
//             searchOptions: req.query
//         })
//     } catch{
//         res.redirect('/')
//     }

module.exports = router