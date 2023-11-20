// controllers/profileController.js
const User = require('../models/user.js') 
const getTimeline = require('../middleware/getTimeline')

async function getProfilePage(req, res) {
    if(!res.locals.isLoggedIn){
        res.render('users/login',{ user: new User() })
    } else {
        const username = req.session.user.username 
        
        const user = await User.findOne({ username }) 
        if (user) {
            res.redirect(`/profiles/${user.id}`) 
        } else {
            // Handle the case where the user is not found
            res.status(404).send('User not found') 
        }
    }
}

async function getUserProfile(req, res) {
    const userId = req.params.id
    const currUsername = req.session.cookie.username
    
    try {
        const user = await User.findById(userId)
        console.log(user)
        const {posts, comments, timeline} = await getTimeline(userId)
        if (user) {
            res.render('profiles/index', {
                user: user,
                timeline: timeline
            }) 
        } else {
            // Handle the case where the user is not found
            res.status(404).send('User not found')
        }
    } catch (error) {
        // Handle any errors that might occur during the database query
        console.error(error) 
        res.status(500).send('Internal Server Error')
    }
}

async function getUserPosts(req, res) {
    const userId = req.params.id
    const currUsername = req.session.cookie.username

    try {
        const user = await User.findById(userId)
        const currUser = await User.findOne({currUsername})
        const isCurrentUser = currUser && currUser.id === user.id 
        const {posts, comments, timeline} = await getTimeline(userId)
        if (user) {
            res.render('profiles/posts', {
                user: user,
                posts: posts,
                isCurrentUser: isCurrentUser
            }) 
        } else {
            // Handle the case where the user is not found
            res.status(404).send('User not found')
        }
    } catch (error) {
        // Handle any errors that might occur during the database query
        console.error(error) 
        res.status(500).send('Internal Server Error')
    }    
}

async function getUserComments(req, res) {
    const userId = req.params.id
    const currUsername = req.session.cookie.username

    try {
        const user = await User.findById(userId)
        const currUser = await User.findOne({currUsername})
        const isCurrentUser = currUser && currUser.id === user.id 
        const {posts, comments, timeline} = await getTimeline(userId)
        if (user) {
            res.render('profiles/comments', {
                user: user,
                comments: comments,
                isCurrentUser: isCurrentUser
            }) 
        } else {
            // Handle the case where the user is not found
            res.status(404).send('User not found')
        }
    } catch (error) {
        // Handle any errors that might occur during the database query
        console.error(error) 
        res.status(500).send('Internal Server Error')
    }
}

async function getEditProfilePage(req, res) {
    try{
        const user = await User.findById(req.params.id)
        res.render('profiles/edit', {
            user: user
        })
    } catch {

    }
}

async function updateProfile(req, res) {
    let user
    const fileName = req.file != null ? req.file.filename: null  
    try{
        user = await User.findById(req.params.id)
        //change field value
        user.username = req.body.username
        user.bio = req.body.bio
        if(fileName !== null)
            user.pfp = fileName
        await user.save()
        res.redirect(`/profiles/${user.id}`)
    } catch {
        if (user == null){
            res.redirect('/')
        }
        res.render('profiles/edit', {
            user: user,
            errorMessage: 'Error updating user'
        })
    }
}

module.exports = {
    getProfilePage,
    getUserProfile,
    getUserPosts,
    getUserComments,
    getEditProfilePage,
    updateProfile,
}

