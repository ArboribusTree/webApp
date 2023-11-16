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

console.log("this is the url" + process.env.DATABASE_URL)
mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

//routes
const indexRouter = require('./routes/index')
const userRouter = require('./routes/users')
const profileRouter = require('./routes/profiles')

//initializing routes
app.use('/', indexRouter)
app.use('/users', userRouter)
app.use('/profiles', profileRouter)

app.listen(port)
console.log('Listening to port: ' + port)
