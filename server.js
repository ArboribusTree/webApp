if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require("express")
const app = express()
const expressLayouts = require('express-ejs-layouts')
const port = 3000
const mongoose = require("mongoose")
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const methodOverride = require('method-override')
const setLoginStatus = require('./middleware/setLoginStatus.js')
const passport = require('passport')


app.set('view engine', "ejs")                                                   
app.set('views', __dirname + "/views")
app.set('layout', 'layouts/layout.ejs')
app.use(expressLayouts)
app.use(express.static("public"))
app.use(bodyParser.urlencoded({limit: '10mb', extended: false}))                    //used for retrieving information from body
app.use(cookieParser())                                                             //used for parsing cookies
app.use(session({                                                                   //used for creating a session
    secret: 'ThisIsASecret',
    resave: false,
    saveUninitialized: false
}))
app.use(methodOverride('_method'))
app.use(setLoginStatus)

console.log("this is the url" + process.env.DATABASE_URL)
mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

app.use(passport.initialize())
app.use(passport.session())

const trendingGamesMiddleware = require('./middleware/trendingGamesMiddleware.js')

app.use(trendingGamesMiddleware)



//routes
const userRouter = require('./routes/users')
const profileRouter = require('./routes/profiles')
const postRouter = require('./routes/post')
const gameRouter = require('./routes/games')
const homeRouter = require('./routes/home')
const aboutRouter = require('./routes/aboutUs')


//initializing routes
app.use('/', homeRouter)
app.use('/users', userRouter)
app.use('/profiles', profileRouter)
app.use('/posts', postRouter)
app.use('/games', gameRouter)
app.use('/aboutus', aboutRouter)

//uncomment this if running for the first time
const Game = require('./models/game.js')
const gamesToInsert = [
    {title: 'Cs2', genre: 'shooter', image: 'cs2.jpg'},
    {title: 'Elden Ring', genre: 'rpg', image: 'eldenring.jpg'},
    {title: 'FF16', genre: 'rpg', image: 'ff16.jpg'},
    {title: 'Path of Exile', genre: 'arpg', image: 'pathofexile.jpg'},
]
Game.insertMany(gamesToInsert)
  .then(result => {
    console.log('Inserted successfully:', result);
  })
  .catch(error => {
    console.error('Error inserting documents:', error);
  });


app.listen(port)
console.log('Listening to port: ' + port)
