// controllers/userController.js

const User = require('../models/user') 
const { hashPassword, comparePassword } = require('../middleware/hasher') 

const userController = {
  getLoginPage: (req, res) => {
    console.log('login')
    res.render('users/login', { user: new User() }) 
  },

  login: async (req, res) => {

    //gets information entered by user
    const {username, password} = req.body

    //checks whether any text fields are empty
    if(!username || !password){
      return res.render('users/login', {
        user: {username, password},
        errorMessage: 'Invalid Login'
      })
    } 

    //collects user credentials from the database if it EXISTS
    //this holds the username entered in the text field
    //AND THE ACTUAL PASSWORD FROM THE DATABASE
    const user = await User.findOne({username})

    //checks if username exists
    if (!user){
      return res.render('users/login', {
        user: {username, password},
        errorMessage: 'Invalid Login'
      })
    }

    const isValid = comparePassword(password, user.password)
    if(isValid){
      //just a console logger
      console.log("Auth success")

      //this creates a session if user successfully logs in
      req.session.user = user
      return res.redirect('/')
    } else {
      //just a console logger
      console.log("Auth denied")
      //if authentication fails dispose of retrieved password
      user.password = ""
      return res.render('users/login', {
        //returns the username
        user: user,
        errorMessage: 'Invalid Login'
      })
    }
  },

  getUsers: async (req, res) => {
    try {
      const users = await User.find({}) 
      res.render('users/index', { users }) 
    } catch (error) {
      res.redirect('/') 
    }
  },

  getSignupPage: (req, res) => {
    res.render('users/signup', { user: new User() }) 
  },

  signup: async (req, res) => {
    // Logic for handling signup
    //initializes a user based on userSchema
    const user = new User({
        username: req.body.username,
        password: req.body.password
      })
      //checks whether any text fields are empty
      if(!user.username || !user.password){
        user.password = ""
        return res.render('users/signup', {
          user: user,
          errorMessage: "Incomplete Credentials"
        })
      }
  
      try{
        //hashes password before saving into database
        const hashedPassword = hashPassword(user.password)
        user.password = hashedPassword
        //saves user credentials into database
        //await is used to execute .save()
        await user.save()
        res.redirect('./login')
      } catch {
        //error condition will only be if a username already exists
        //this is because username in schema is set to be unique
  
        //password is reset before sending back to user to make them type it again >:D
        user.password = ""
        res.render('users/signup', {
          //username is sent back to user
          user: user,
          errorMessage: 'Username already exists'
        })
      }
  },
} 

module.exports = userController 
